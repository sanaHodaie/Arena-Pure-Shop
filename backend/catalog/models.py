from django.core.exceptions import ValidationError
from django.db import models
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
        verbose_name_plural = "categories"

    def __str__(self):
        return self.title


class Brand(models.Model):
    name = models.CharField(max_length=120, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    slug = models.SlugField(max_length=160, unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name="products")
    title = models.CharField(max_length=240)
    english_name = models.CharField(max_length=240, blank=True)
    product_type = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=160, blank=True)
    family = models.SlugField(blank=True, db_index=True)
    shade = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=7, blank=True)
    undertone = models.CharField(max_length=120, blank=True)
    shade_note = models.TextField(blank=True)
    price = models.PositiveIntegerField(help_text="Toman")
    old_price = models.PositiveIntegerField(null=True, blank=True, help_text="Toman")
    stock = models.PositiveIntegerField(default=0)
    image = models.CharField(max_length=500, blank=True, validators=[validate_image_path])
    source_url = models.URLField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    suitability = models.TextField(blank=True)
    extra = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["id"]
        indexes = [models.Index(fields=["category", "id"])]

    def __str__(self):
        return self.title
