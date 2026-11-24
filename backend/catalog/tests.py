from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import Category, Product


@override_settings(SECURE_SSL_REDIRECT=False, CORS_ALLOWED_ORIGINS=["https://shop.example.com"])
class CatalogTests(TestCase):
    slug = "maybelline-vinyl-ink-35-cheeky"

    def test_catalog_and_stable_storefront_paths(self):
        self.assertEqual(Category.objects.count(), 7)
        self.assertEqual(Product.objects.count(), 70)
        response = self.client.get(reverse("catalog"), headers={"Origin": "https://shop.example.com"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["access-control-allow-origin"], "https://shop.example.com")
        catalog = response.json()
        self.assertEqual(len(catalog["products"]), 70)
        self.assertEqual(len(catalog["categories"]), 7)
        self.assertEqual({item["storefrontPath"] for item in catalog["products"]},
                         {"/products/" + slug for slug in Product.objects.values_list("slug", flat=True)})
        self.assertTrue(all(item["suitability"] for item in catalog["products"]))

    def test_listing_filters_pagination_and_missing_detail(self):
        data = self.client.get(reverse("products")).json()
        self.assertEqual((data["count"], len(data["results"])), (70, 24))
        selected = self.client.get(reverse("products"), {"category": "cosmetics", "search": "Vinyl Ink"}).json()
        self.assertEqual(selected["count"], 2)
        self.assertEqual(self.client.get(reverse("category", args=["skincare"])).json()["storefrontPath"], "/categories/skincare")
        self.assertEqual(self.client.get(reverse("product", args=["missing"])).status_code, 404)
        self.assertEqual(self.client.post(reverse("products"), {}).status_code, 405)

    def test_admin_changes_are_read_by_api_and_preserved_on_reimport(self):
        user = get_user_model().objects.create_superuser("test-admin", password="temporary-test-password")
        self.client.force_login(user)
        product = Product.objects.select_related("category", "brand").get(slug=self.slug)
        response = self.client.post(reverse("admin:catalog_product_change", args=[product.pk]), {
            "slug": product.slug, "category": product.category_id, "brand": product.brand_id,
            "title": product.title, "english_name": product.english_name, "price": 123456,
            "stock": 0, "image": product.image, "extra": "[]", "_save": "Save",
        })
        self.assertEqual(response.status_code, 302)
        call_command("seed_catalog", verbosity=0)
        data = self.client.get(reverse("product", args=[self.slug])).json()
        self.assertEqual(data["price"], 123456)
        self.assertFalse(data["inStock"])
        self.assertEqual(Product.objects.count(), 70)
