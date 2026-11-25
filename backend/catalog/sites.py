from django.contrib.admin import AdminSite
from django.db.models import Count, Q

from .models import Category, Product


class ArenaAdminSite(AdminSite):
    site_header = "آرنا پیور"
    site_title = "مدیریت آرنا پیور"
    index_title = "داشبورد فروشگاه"
    index_template = "catalog/admin/dashboard.html"
    login_template = "catalog/admin/login.html"

    def index(self, request, extra_context=None):
        metrics = {}
        category_summary = []
        if request.user.has_perm("catalog.view_product") or request.user.has_perm("catalog.change_product"):
            metrics = Product.objects.aggregate(
                total=Count("id"),
                active=Count("id", filter=Q(is_active=True)),
                out_of_stock=Count("id", filter=Q(stock=0)),
            )
            if request.user.has_perm("catalog.view_category"):
                category_summary = list(Category.objects.annotate(active_products=Count(
                    "products", filter=Q(products__is_active=True),
                )).values("pk", "title", "active_products"))
        return super().index(request, {
            **(extra_context or {}),
            "metrics": metrics,
            "category_summary": category_summary,
            "category_count": Category.objects.count() if request.user.has_perm("catalog.view_category") else None,
        })
