from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    storefrontPath = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ("slug", "title", "eyebrow", "description", "storefrontPath")

    def get_storefrontPath(self, category):
        return f"/categories/{category.slug}"


class ProductSerializer(serializers.ModelSerializer):
    brand = serializers.CharField(source="brand.name")
    category = serializers.CharField(source="category.slug")
    englishName = serializers.CharField(source="english_name")
    type = serializers.CharField(source="product_type")
    shadeNote = serializers.CharField(source="shade_note")
    oldPrice = serializers.IntegerField(source="old_price")
    sourceUrl = serializers.CharField(source="source_url")
    discountPercent = serializers.SerializerMethodField()
    inStock = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    storefrontPath = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id", "slug", "title", "englishName", "category", "brand", "type", "model",
            "family", "shade", "color", "undertone", "shadeNote", "price", "oldPrice",
            "discountPercent", "inStock", "image", "sourceUrl", "description",
            "suitability", "usage", "ingredients", "faq", "extra", "storefrontPath",
        )

    def get_discountPercent(self, product):
        if product.old_price and product.old_price > product.price:
            return round((product.old_price - product.price) * 100 / product.old_price)
        return 0

    def get_inStock(self, product):
        return product.stock > 0

    def get_image(self, product):
        photo = getattr(product, "uploaded_photo", None)
        if photo:
            return self.context["request"].build_absolute_uri(photo.url())
        return product.image

    def get_storefrontPath(self, product):
        return f"/products/{product.slug}"
