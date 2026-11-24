from django.db import connection
from django.db.utils import OperationalError
from django.http import JsonResponse
from rest_framework import filters, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


def product_query():
    return Product.objects.select_related("category", "brand")


@api_view(["GET"])
def storefront(request):
    return Response({
        "categories": CategorySerializer(Category.objects.all(), many=True).data,
        "products": ProductSerializer(product_query(), many=True).data,
    })


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
