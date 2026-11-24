from django.contrib import admin
from django.urls import path

from catalog import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("healthz/", views.health, name="health"),
    path("api/v1/catalog/", views.storefront, name="catalog"),
    path("api/v1/categories/", views.Categories.as_view(), name="categories"),
    path("api/v1/categories/<slug:slug>/", views.CategoryDetail.as_view(), name="category"),
    path("api/v1/products/", views.Products.as_view(), name="products"),
    path("api/v1/products/<slug:slug>/", views.ProductDetail.as_view(), name="product"),
]
