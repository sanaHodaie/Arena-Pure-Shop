from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

from catalog import panel_views, views

urlpatterns = [
    path("", TemplateView.as_view(template_name="catalog/index.html"), name="index"),
    path("admin/", panel_views.panel, name="management"),
    path("admin/api/session/", panel_views.session),
    path("admin/api/catalog/", panel_views.catalog),
    path("admin/api/products/new/", panel_views.product_editor),
    path("admin/api/products/<int:pk>/", panel_views.product_editor),
    path("admin/api/products/<int:pk>/action/", panel_views.product_action),
    path("admin/api/workbook/", panel_views.workbook),
    path("django-admin/", admin.site.urls),
    path("media/products/<int:product_id>/<str:digest>/", views.product_photo, name="product-photo"),
    path("healthz/", views.health, name="health"),
    path("api/v1/catalog/", views.storefront, name="catalog"),
    path("api/v1/categories/", views.Categories.as_view(), name="categories"),
    path("api/v1/categories/<slug:slug>/", views.CategoryDetail.as_view(), name="category"),
    path("api/v1/products/", views.Products.as_view(), name="products"),
    path("api/v1/products/<slug:slug>/", views.ProductDetail.as_view(), name="product"),
]
