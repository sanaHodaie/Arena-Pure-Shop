from django.contrib import admin

from .models import Brand, Category, Product


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
    list_display = ("title", "category", "brand", "price", "stock")
    list_filter = ("category", "brand")
    list_select_related = ("category", "brand")
    list_editable = ("price", "stock")
    search_fields = ("title", "english_name", "slug", "shade")
    autocomplete_fields = ("category", "brand")
    prepopulated_fields = {"slug": ("english_name",)}
