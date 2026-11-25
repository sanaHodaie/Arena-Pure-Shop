from urllib.parse import urlsplit

from django.conf import settings
from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied, ValidationError
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.template.response import TemplateResponse
from django.templatetags.static import static
from django.urls import path, reverse
from django.utils.html import format_html
from django.utils.http import url_has_allowed_host_and_scheme

from .forms import ProductAdminForm
from .models import Brand, Category, Product, ProductPhoto
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
    list_display = ("product_card", "category", "price", "stock", "visibility", "edit_link")
    list_display_links = ("product_card",)
    list_filter = ("category", "brand", "is_active")
    list_editable = ("price", "stock")
    search_fields = ("title", "english_name", "slug", "shade")
    autocomplete_fields = ("category", "brand")
    prepopulated_fields = {"slug": ("english_name",)}
    list_per_page = 25
    fieldsets = (
        ("هویت و دسته‌بندی", {"fields": ("title", "english_name", "slug", "category", "brand", "product_type", "model")}),
        ("قیمت و موجودی", {"fields": ("price", "old_price", "stock", "is_active")}),
        ("تصویر محصول", {"fields": ("photo", "remove_photo", "image", "photo_preview")}),
        ("رنگ و نسخه", {"fields": ("family", "shade", "color", "undertone", "shade_note")}),
        ("محتوای صفحه", {"fields": ("description", "suitability", "usage", "ingredients", "source_url", "extra", "faq")}),
    )
    readonly_fields = ("photo_preview",)

    def get_list_display(self, request):
        if self.has_change_permission(request):
            return self.list_display
        return tuple("visibility_readonly" if column == "visibility" else column for column in self.list_display)

    @admin.display(description="نمایش در فروشگاه", boolean=True)
    def visibility_readonly(self, obj):
        return obj.is_active

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "category", "brand", "uploaded_photo",
        ).defer("uploaded_photo__data")

    def thumbnail(self, obj):
        photo = getattr(obj, "uploaded_photo", None)
        src = photo.url() if photo else obj.image
        if src and src.startswith("/images/"):
            if settings.STATICFILES_DIRS:
                src = static("storefront/" + src.removeprefix("/images/"))
            else:
                origin = next(iter(settings.CORS_ALLOWED_ORIGINS), "http://localhost:3000")
                src = f"{origin}{src}"
        if src:
            return format_html('<img class="arena-thumbnail" src="{}" alt="" loading="lazy">', src)
        return format_html('<span class="arena-thumbnail arena-thumbnail-empty">{}</span>', "بدون عکس")

    @admin.display(description="محصول", ordering="title")
    def product_card(self, obj):
        return format_html('<span class="arena-product-cell">{}<span><strong>{}</strong><small>{}</small></span></span>',
                           self.thumbnail(obj), obj.title, obj.brand)

    @admin.display(description="تصویر فعلی")
    def photo_preview(self, obj):
        return self.thumbnail(obj) if obj and obj.pk else "—"

    @admin.display(description="نمایش در فروشگاه")
    def visibility(self, obj):
        state = "active" if obj.is_active else "inactive"
        label = "فعال — برای غیرفعال‌کردن بزنید" if obj.is_active else "غیرفعال — برای فعال‌کردن بزنید"
        return format_html(
            '<button class="arena-toggle {}" type="submit" form="arena-toggle-{}" title="{}" aria-label="{}">'
            '<span aria-hidden="true"></span></button>', state, obj.pk, label, label,
        )

    @admin.display(description="ویرایش")
    def edit_link(self, obj):
        return format_html(
            '<a class="arena-edit" href="{}" title="ویرایش محصول" aria-label="ویرایش {}">'
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">'
            '<path d="m15 6 3 3M5 19l4-.8L20 7a2 2 0 0 0-3-3L6 15z"/></svg></a>',
            reverse("admin:catalog_product_change", args=[obj.pk]), obj.title,
        )

    def changelist_view(self, request, extra_context=None):
        return super().changelist_view(request, {
            **(extra_context or {}),
            "can_toggle": self.has_change_permission(request),
            "can_import": self.has_add_permission(request),
        })

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if photo := form.cleaned_data.get("photo"):
            ProductPhoto.objects.update_or_create(product=obj, defaults=photo)
        elif form.cleaned_data.get("remove_photo"):
            ProductPhoto.objects.filter(product=obj).delete()

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
