from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView

from catalog import views

urlpatterns = [
    path("", TemplateView.as_view(template_name="catalog/index.html"), name="index"),
    path("admin/", admin.site.urls),
    path("media/products/<int:product_id>/<str:digest>/", views.product_photo, name="product-photo"),
    path("healthz/", views.health, name="health"),
    path("api/v1/catalog/", views.storefront, name="catalog"),
    path("api/v1/categories/", views.Categories.as_view(), name="categories"),
    path("api/v1/categories/<slug:slug>/", views.CategoryDetail.as_view(), name="category"),
    path("api/v1/products/", views.Products.as_view(), name="products"),
    path("api/v1/products/<slug:slug>/", views.ProductDetail.as_view(), name="product"),
]
