from .models import ProductPhoto


def save_product_photo(product, form):
    if photo := form.cleaned_data.get("photo"):
        ProductPhoto.objects.update_or_create(product=product, defaults=photo)
    elif form.cleaned_data.get("remove_photo"):
        ProductPhoto.objects.filter(product=product).delete()
