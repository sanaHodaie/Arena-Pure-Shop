from functools import wraps

from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.db.models import Count, Q
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_GET, require_http_methods, require_POST

from .forms import ProductAdminForm
from .login_history import recent_logins
from .models import AdminLogin, Brand, Category, Product
from .photos import save_product_photo
from .spreadsheets import import_products, sample_workbook


def image_url(product):
    photo = getattr(product, "uploaded_photo", None)
    return photo.url() if photo else product.image


def staff_api(view):
    @never_cache
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if not (request.user.is_active and request.user.is_staff):
            return JsonResponse({"error": "ابتدا وارد حساب مدیریت شوید."}, status=401)
        return view(request, *args, **kwargs)
    return wrapped


def allowed(user, action):
    return user.has_perm(f"catalog.{action}_product")


def forbidden():
    return JsonResponse({"error": "اجازهٔ انجام این عملیات را ندارید."}, status=403)


@never_cache
@require_http_methods(["GET", "POST"])
def session(request):
    if request.method == "POST":
        if request.POST.get("action") == "logout":
            logout(request)
        else:
            user = authenticate(request, username=request.POST.get("username"), password=request.POST.get("password"))
            if not user or not user.is_active or not user.is_staff:
                return JsonResponse({"error": "نام کاربری یا رمز عبور مدیر درست نیست."}, status=400)
            recent_logins()
            AdminLogin.objects.create(username=user.get_username())
            login(request, user)
            request.session.set_expiry(None if request.POST.get("remember") == "1" else 0)
    user = request.user
    account = None
    if user.is_active and user.is_staff:
        account = {
            "username": user.get_username(), "name": user.get_full_name() or user.get_username(),
            "role": "مدیر فروشگاه", "can_view": allowed(user, "view") or allowed(user, "change"),
            "can_add": allowed(user, "add"), "can_change": allowed(user, "change"),
            "can_delete": allowed(user, "delete"),
            "articles": any(user.has_perm(f"catalog.{action}_article") for action in ("view", "add", "change")),
            "articleAdd": user.has_perm("catalog.add_article"), "articleChange": user.has_perm("catalog.change_article"),
            "articleDelete": user.has_perm("catalog.delete_article"),
            "reviews": any(user.has_perm(f"catalog.{action}_productreview") for action in ("view", "change")),
            "reviewChange": user.has_perm("catalog.change_productreview"),
            "loginLogs": user.has_perm("catalog.view_adminlogin"),
            "salesReports": allowed(user, "view"),
        }
    return JsonResponse({"account": account, "csrf": get_token(request)})


def product_row(product):
    return {
        "id": product.pk, "name": product.title, "sku": product.slug,
        "category": product.category_id, "categoryName": product.category.title,
        "brand": product.brand.name, "image": image_url(product), "stock": product.stock,
        "price": product.price, "active": product.is_active,
        "description": product.description, "type": product.product_type, "model": product.model,
    }


@staff_api
@require_GET
def catalog(request):
    if not (allowed(request.user, "view") or allowed(request.user, "change")):
        return forbidden()
    rows = Product.objects.select_related("category", "brand", "uploaded_photo").defer("uploaded_photo__data")
    return JsonResponse({
        "products": [product_row(product) for product in rows],
        "categories": list(Category.objects.annotate(product_count=Count("products", filter=Q(products__is_active=True)))
                           .values("id", "title", "slug", "product_count")),
    })


def edit_payload(product):
    form = ProductAdminForm(instance=product)
    fields = []
    for field in form:
        widget = field.field.widget
        value = field.value()
        kind = widget.input_type if hasattr(widget, "input_type") else "textarea"
        if field.name in {"faq", "extra"}:
            value = value or "[]"
        choices = [{"value": str(key), "label": str(label)} for key, label in field.field.choices] if kind == "select" else []
        fields.append({
            "name": field.name, "label": str(field.label), "type": kind, "value": value,
            "required": field.field.required, "choices": choices, "help": str(field.help_text),
        })
    return {"fields": fields, "image": image_url(product) if product else ""}


@staff_api
@require_http_methods(["GET", "POST"])
def product_editor(request, pk=None):
    if not allowed(request.user, "add" if pk is None else "change"):
        return forbidden()
    if request.method == "GET":
        product = get_object_or_404(Product.objects.select_related("uploaded_photo").defer("uploaded_photo__data"), pk=pk) if pk else None
        return JsonResponse(edit_payload(product))
    try:
        with transaction.atomic():
            product = get_object_or_404(Product.objects.select_for_update(), pk=pk) if pk else None
            form = ProductAdminForm(request.POST, request.FILES, instance=product)
            if not form.is_valid():
                return JsonResponse({"errors": form.errors}, status=400)
            product = form.save()
            save_product_photo(product, form)
    except IntegrityError:
        return JsonResponse({"error": "ذخیره انجام نشد. شناسه و اطلاعات محصول را بررسی کنید."}, status=409)
    return JsonResponse({"id": product.pk}, status=201 if pk is None else 200)


@staff_api
@require_POST
def product_action(request, pk):
    action = request.POST.get("action")
    if action == "delete":
        if not allowed(request.user, "delete"):
            return forbidden()
        get_object_or_404(Product, pk=pk).delete()
    elif action in {"hide", "show"}:
        if not allowed(request.user, "change"):
            return forbidden()
        if not Product.objects.filter(pk=pk).update(is_active=action == "show"):
            return JsonResponse({"error": "محصول پیدا نشد."}, status=404)
    else:
        return JsonResponse({"error": "عملیات معتبر نیست."}, status=400)
    return JsonResponse({"ok": True})


@staff_api
@require_http_methods(["GET", "POST"])
def workbook(request):
    if not allowed(request.user, "add"):
        return forbidden()
    if request.method == "GET":
        return HttpResponse(sample_workbook(), headers={"Content-Disposition": 'attachment; filename="arena-products.xlsx"'},
                            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    upload = request.FILES.get("workbook")
    if not upload:
        return JsonResponse({"error": "فایل اکسل را انتخاب کنید."}, status=400)
    try:
        count = import_products(upload)
    except ValidationError as exc:
        return JsonResponse({"error": " ".join(exc.messages)}, status=400)
    except IntegrityError:
        return JsonResponse({"error": "محصول هم‌زمان ثبت شده است. فایل را بررسی کنید."}, status=409)
    return JsonResponse({"count": count})
