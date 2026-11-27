from catalog import order_views
from django.urls import path, re_path
from django.views.generic import TemplateView

from catalog import customer_views, content_views, panel_views, sales_reports, views

urlpatterns = [
    path("api/v1/account/orders/", order_views.customer_orders),
    path("api/management/orders/", order_views.management_orders),
    path("", TemplateView.as_view(template_name="catalog/index.html"), name="index"),
    re_path(r"^api/management/session/?$", panel_views.session),
    path("api/management/articles/", content_views.articles),
    path("api/management/articles/new/", content_views.save_article),
    path("api/management/articles/<int:pk>/", content_views.save_article),
    path("api/management/articles/<int:pk>/visibility/", content_views.article_visibility),
    path("api/management/articles/<int:pk>/delete/", content_views.delete_article),
    path("media/articles/<int:pk>/<str:digest>/", content_views.article_photo, name="article-photo"),
    path("api/management/reviews/", content_views.reviews),
    path("api/management/reviews/<int:pk>/", content_views.moderate_review),
    path("api/management/sales/", sales_reports.sales_report),
    path("api/management/sales/export/", sales_reports.sales_report, {"export": True}),
    path("api/management/login-logs/", content_views.login_logs),
    re_path(r"^api/v1/account/session/?$", customer_views.customer_session),
    re_path(r"^api/v1/account/profile/?$", customer_views.customer_profile),
    path("api/v1/articles/", content_views.public_articles),
    path("api/v1/products/<slug:slug>/reviews/", content_views.public_reviews),
    path("api/management/catalog/", panel_views.catalog),
    path("api/management/products/new/", panel_views.product_editor),
    path("api/management/products/<int:pk>/", panel_views.product_editor),
    path("api/management/products/<int:pk>/action/", panel_views.product_action),
    path("api/management/workbook/", panel_views.workbook),
    path("media/products/<int:product_id>/<str:digest>/", views.product_photo, name="product-photo"),
    path("api/management/health/", views.health),
    path("healthz/", views.health, name="health"),
    path("api/v1/catalog/", views.storefront, name="catalog"),
    path("api/v1/categories/", views.Categories.as_view(), name="categories"),
    path("api/v1/categories/<slug:slug>/", views.CategoryDetail.as_view(), name="category"),
    path("api/v1/products/", views.Products.as_view(), name="products"),
    path("api/v1/products/<slug:slug>/", views.ProductDetail.as_view(), name="product"),
]
