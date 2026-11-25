from urllib.parse import urlsplit

from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied, ValidationError
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.template.response import TemplateResponse
from django.urls import path, reverse
from django.utils.html import format_html
from django.utils.http import url_has_allowed_host_and_scheme

from .forms import ProductAdminForm
from .models import Brand, Category, Product
from .photos import product_image_url, save_product_photo
from .spreadsheets import import_products, sample_workbook


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "slug")
    search_fields = ("title", "slug")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    change_list_template = "catalog/admin/product_list.html"
    list_display = ("title", "category", "price", "stock")
    list_filter = ("category", "brand", "is_active")
    list_editable = ("price", "stock")
    search_fields = ("title", "english_name", "slug", "shade")
    autocomplete_fields = ("category", "brand")
    prepopulated_fields = {"slug": ("english_name",)}
    list_per_page = 24
    actions = None
    show_facets = admin.ShowFacets.NEVER
    fieldsets = (
        ("هویت و دسته‌بندی", {"fields": ("title", "english_name", "slug", "category", "brand", "product_type", "model")}),
        ("قیمت و موجودی", {"fields": ("price", "old_price", "stock", "is_active")}),
        ("تصویر محصول", {"fields": ("photo", "remove_photo", "image", "photo_preview")}),
        ("رنگ و نسخه", {"fields": ("family", "shade", "color", "undertone", "shade_note")}),
        ("محتوای صفحه", {"fields": ("description", "suitability", "usage", "ingredients", "source_url", "extra", "faq")}),
    )
    readonly_fields = ("photo_preview",)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "category", "brand", "uploaded_photo",
        ).defer("uploaded_photo__data")

    def thumbnail(self, obj):
        src = product_image_url(obj)
        if src:
            return format_html('<img class="arena-thumbnail" src="{}" alt="" loading="lazy">', src)
        return format_html('<span class="arena-thumbnail arena-thumbnail-empty">{}</span>', "بدون عکس")

    @admin.display(description="تصویر فعلی")
    def photo_preview(self, obj):
        return self.thumbnail(obj) if obj and obj.pk else "—"

    def changelist_view(self, request, extra_context=None):
        if request.method == "GET":
            params = request.GET.copy()
            for name in ("brand__id__exact", "is_active__exact"):
                if name in params and not params[name]:
                    del params[name]
            if params != request.GET:
                query = params.urlencode()
                return HttpResponseRedirect(request.path + ("?" + query if query else ""))

        response = super().changelist_view(request, {
            **(extra_context or {}),
            "can_toggle": self.has_change_permission(request),
            "can_import": self.has_add_permission(request),
        })
        context = getattr(response, "context_data", None)
        if not context or "cl" not in context:
            return response

        cl = context["cl"]
        rows = cl.formset.forms if cl.formset is not None else []
        forms = {form.instance.pk: form for form in rows}
        categories = list(Category.objects.values_list("pk", "title"))
        brands = Brand.objects.values_list("pk", "name")
        selected_category = request.GET.get("category__id__exact", "")
        context.update({
            "product_cards": [
                {"product": product, "photo": product_image_url(product), "form": forms.get(product.pk)}
                for product in cl.result_list
            ],
            "category_choices": [
                {"title": title, "selected": str(pk or "") == selected_category,
                 "href": cl.get_query_string({"category__id__exact": pk, "p": None})}
                for pk, title in [(None, "همهٔ محصولات"), *categories]
            ],
            "brand_choices": [
                {"id": pk, "name": name, "selected": request.GET.get("brand__id__exact") == str(pk)}
                for pk, name in brands
            ],
            "selected_category": selected_category,
            "selected_status": request.GET.get("is_active__exact", ""),
        })
        return response

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        save_product_photo(obj, form)

    def get_urls(self):
        return [
            path("import/", self.admin_site.admin_view(self.upload_spreadsheet), name="catalog_product_import"),
            path("import/sample/", self.admin_site.admin_view(self.download_sample), name="catalog_product_sample"),
            path("<int:pk>/visibility/", self.admin_site.admin_view(self.toggle_visibility), name="catalog_product_visibility"),
        ] + super().get_urls()

    def toggle_visibility(self, request, pk):
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])
        product = get_object_or_404(Product, pk=pk)
        if not self.has_change_permission(request, product):
            raise PermissionDenied
        desired = request.POST.get("is_active")
        if desired not in {"true", "false"}:
            return HttpResponse(status=400)
        Product.objects.filter(pk=pk).update(is_active=desired == "true")
        target = request.POST.get("return_to", "")
        changelist = reverse("admin:catalog_product_changelist")
        if not url_has_allowed_host_and_scheme(target, allowed_hosts={request.get_host()}) or urlsplit(target).path != changelist:
            target = changelist
        return HttpResponseRedirect(target)

    def upload_spreadsheet(self, request):
        if not self.has_add_permission(request):
            raise PermissionDenied
        error = None
        if request.method == "POST":
            if not request.FILES.get("workbook"):
                error = "فایل اکسل را انتخاب کنید."
            else:
                try:
                    count = import_products(request.FILES["workbook"])
                except ValidationError as exc:
                    error = " ".join(exc.messages)
                except IntegrityError:
                    error = "محصول یا برند هم‌زمان ثبت شده است. فایل را بررسی و دوباره ارسال کنید."
                else:
                    self.message_user(request, f"{count} محصول وارد شد.", messages.SUCCESS)
                    return HttpResponseRedirect(reverse("admin:catalog_product_changelist"))
        return TemplateResponse(request, "catalog/admin/import.html", {
            **self.admin_site.each_context(request), "opts": self.model._meta,
            "title": "ورود محصولات از اکسل", "error": error,
            "categories": Category.objects.values_list("slug", flat=True),
        })

    def download_sample(self, request):
        if not self.has_add_permission(request):
            raise PermissionDenied
        return HttpResponse(sample_workbook(),
                            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            headers={"Content-Disposition": 'attachment; filename="arena-products.xlsx"'})
