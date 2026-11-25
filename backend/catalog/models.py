from django.core.exceptions import ValidationError
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


def validate_image_path(value):
    if not (value.startswith("/images/") or value.startswith("https://")):
        raise ValidationError(_("Use a storefront /images/ path or an HTTPS image URL."))


class Category(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=120)
    eyebrow = models.CharField(max_length=140, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["id"]
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"

    def __str__(self):
        return self.title


class Brand(models.Model):
    name = models.CharField(max_length=120, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "برند"
        verbose_name_plural = "برندها"

    def __str__(self):
        return self.name


class Product(models.Model):
    slug = models.SlugField(max_length=160, unique=True)
    category = models.ForeignKey(Category, verbose_name="دسته‌بندی", on_delete=models.PROTECT, related_name="products")
    brand = models.ForeignKey(Brand, verbose_name="برند", on_delete=models.PROTECT, related_name="products")
    title = models.CharField(max_length=240)
    english_name = models.CharField(max_length=240, blank=True)
    product_type = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=160, blank=True)
    family = models.SlugField(blank=True, db_index=True)
    shade = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=7, blank=True)
    undertone = models.CharField(max_length=120, blank=True)
    shade_note = models.TextField(blank=True)
    price = models.PositiveIntegerField("قیمت", help_text="Toman")
    old_price = models.PositiveIntegerField(null=True, blank=True, help_text="Toman")
    stock = models.PositiveIntegerField("موجودی", default=0)
    is_active = models.BooleanField("نمایش در فروشگاه", default=True, db_index=True)
    image = models.CharField(max_length=500, blank=True, validators=[validate_image_path])
    source_url = models.URLField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    suitability = models.TextField(blank=True)
    usage = models.TextField(blank=True)
    ingredients = models.TextField(blank=True)
    faq = models.JSONField(default=list, blank=True)
    extra = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["id"]
        indexes = [models.Index(fields=["category", "id"])]
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"

    def __str__(self):
        return self.title


class ProductPhoto(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="uploaded_photo")
    data = models.BinaryField()
    content_type = models.CharField(max_length=32)
    digest = models.CharField(max_length=64)

    def url(self):
        return reverse("product-photo", args=[self.product_id, self.digest])
