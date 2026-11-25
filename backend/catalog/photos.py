from django.conf import settings
from django.templatetags.static import static

from .models import ProductPhoto


def product_image_url(product):
    photo = getattr(product, "uploaded_photo", None)
    if photo:
        return photo.url()
    src = product.image
    if src.startswith("/images/"):
        if settings.DEBUG and (settings.BASE_DIR.parent / "public" / "images").is_dir():
            return static("storefront/" + src.removeprefix("/images/"))
        origin = next(iter(settings.CORS_ALLOWED_ORIGINS), "http://localhost:3000")
        return f"{origin}{src}"
    return src


def save_product_photo(product, form):
    if photo := form.cleaned_data.get("photo"):
        ProductPhoto.objects.update_or_create(product=product, defaults=photo)
    elif form.cleaned_data.get("remove_photo"):
        ProductPhoto.objects.filter(product=product).delete()
