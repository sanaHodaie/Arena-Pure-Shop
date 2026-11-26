from django.db import connection
from django.db.utils import OperationalError
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_safe
from rest_framework import filters, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Category, Product, ProductPhoto
from .serializers import CategorySerializer, ProductSerializer


def product_query():
    return Product.objects.filter(is_active=True).select_related(
        "category", "brand", "uploaded_photo",
    ).defer("uploaded_photo__data")


@api_view(["GET"])
def storefront(request):
    return Response({
        "categories": CategorySerializer(Category.objects.all(), many=True).data,
        "products": ProductSerializer(product_query(), many=True, context={"request": request}).data,
    }, headers={"Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=120"})


class Categories(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None


class CategoryDetail(generics.RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"


class Products(generics.ListAPIView):
    serializer_class = ProductSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = ("title", "english_name", "brand__name", "shade")
    ordering_fields = ("price", "title", "id")
    ordering = ("id",)

    def get_queryset(self):
        queryset = product_query()
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset


class ProductDetail(generics.RetrieveAPIView):
    queryset = product_query()
    serializer_class = ProductSerializer
    lookup_field = "slug"


def health(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except OperationalError:
        return JsonResponse({"status": "unavailable"}, status=503)
    return JsonResponse({"status": "ok"})

@require_safe
def product_photo(request, product_id, digest):
    queryset = ProductPhoto.objects.select_related("product")
    if not request.user.is_staff or not (
        request.user.has_perm("catalog.view_product") or request.user.has_perm("catalog.change_product")
    ):
        queryset = queryset.filter(product__is_active=True)
    photo = get_object_or_404(queryset, product_id=product_id, digest=digest)
    response = HttpResponse(photo.data, content_type=photo.content_type)
    response["Cache-Control"] = "public, max-age=3600" if photo.product.is_active else "private, no-store"
    return response
