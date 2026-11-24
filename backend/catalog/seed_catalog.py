import json
from pathlib import Path

from django.core.management.color import no_style


def import_catalog(apps, connection):
    Category = apps.get_model("catalog", "Category")
    Brand = apps.get_model("catalog", "Brand")
    Product = apps.get_model("catalog", "Product")
    categories_query = Category.objects.using(connection.alias)
    brands_query = Brand.objects.using(connection.alias)
    products_query = Product.objects.using(connection.alias)
    source_file = Path(__file__).resolve().parent / "seed" / "storefront.json"
    data = json.loads(source_file.read_text(encoding="utf-8"))
    categories = {}
    for source in data["categories"]:
        slug = source["slug"]
        categories[slug], _ = categories_query.get_or_create(
            slug=slug, defaults={key: value for key, value in source.items() if key != "slug"},
        )

    existing_ids = set(products_query.values_list("id", flat=True))
    existing_slugs = set(products_query.values_list("slug", flat=True))
    new_products = []
    brands = {}
    for item in data["products"]:
        if item["id"] in existing_ids or item["slug"] in existing_slugs:
            continue
        name = item["brand"]
        if name not in brands:
            brands[name], _ = brands_query.get_or_create(name=name)
        new_products.append(Product(
            id=item["id"], slug=item["slug"], category=categories[item["category"]],
            brand=brands[name], title=item["title"], english_name=item.get("englishName") or "",
            product_type=item.get("type") or "", model=item.get("model") or "",
            family=item.get("family") or "", shade=item.get("shade") or "",
            color=item.get("color") or "", undertone=item.get("undertone") or "",
            shade_note=item.get("shadeNote") or "", price=item["price"], old_price=item.get("oldPrice"),
            stock=int(bool(item.get("inStock"))), image=item.get("image") or "",
            source_url=item.get("sourceUrl") or "", description=item.get("description") or "",
            suitability=item.get("suitability") or "", extra=item.get("extra") or [],
        ))

    if new_products:
        products_query.bulk_create(new_products)
        with connection.cursor() as cursor:
            for statement in connection.ops.sequence_reset_sql(no_style(), [Product]):
                cursor.execute(statement)
    return len(new_products)
