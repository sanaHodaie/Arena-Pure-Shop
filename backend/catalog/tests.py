from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings
from django.urls import reverse

from openpyxl import Workbook, load_workbook
from PIL import Image

from .forms import IMAGE_LIMIT
from .models import Category, Product, ProductPhoto


@override_settings(SECURE_SSL_REDIRECT=False, CORS_ALLOWED_ORIGINS=["https://shop.example.com"])
class CatalogTests(TestCase):
    slug = "maybelline-vinyl-ink-35-cheeky"

    def test_backend_home_links_to_health_catalog_and_admin(self):
        response = self.client.get(reverse("index"))
        for name in ("health", "catalog", "admin:index"):
            self.assertContains(response, f'href="{reverse(name)}"')

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
            "stock": 0, "is_active": "on", "image": product.image, "extra": "[]", "_save": "Save",
        })
        self.assertEqual(response.status_code, 302)
        call_command("seed_catalog", verbosity=0)
        data = self.client.get(reverse("product", args=[self.slug])).json()
        self.assertEqual(data["price"], 123456)
        self.assertFalse(data["inStock"])
        self.assertEqual(Product.objects.count(), 70)

    def test_admin_list_login_and_visibility(self):
        self.assertContains(self.client.get(reverse("admin:login")), "ورود به مدیریت آرنا پیور")
        admin = get_user_model().objects.create_superuser("visibility-admin", password="temporary-test-password")
        self.client.force_login(admin)
        index = self.client.get(reverse("admin:index"))
        self.assertContains(index, "فعال در فروشگاه")
        product = Product.objects.get(slug=self.slug)
        category_filter = f"?category__id__exact={product.category_id}"
        listing = self.client.get(reverse("admin:catalog_product_changelist") + category_filter)
        self.assertContains(listing, "arena-thumbnail")
        self.assertContains(listing, f'id="arena-toggle-{product.pk}"')
        self.assertContains(listing, reverse("admin:catalog_product_import"))
        url = reverse("admin:catalog_product_visibility", args=[product.pk])
        self.assertEqual(self.client.get(url).status_code, 405)
        result = self.client.post(url, {"is_active": "false", "return_to": listing.wsgi_request.get_full_path()})
        self.assertTrue(result["Location"].endswith(category_filter))
        self.assertEqual(self.client.get(reverse("product", args=[self.slug])).status_code, 404)
        self.assertEqual(len(self.client.get(reverse("catalog")).json()["products"]), 69)
        self.client.post(url, {"is_active": "true"})
        self.assertEqual(self.client.get(reverse("product", args=[self.slug])).status_code, 200)

    def test_excel_sample_import_and_rollback(self):
        admin = get_user_model().objects.create_superuser("import-admin", password="temporary-test-password")
        path = reverse("admin:catalog_product_import")
        self.assertEqual(self.client.get(path).status_code, 302)
        self.client.force_login(admin)
        sample = self.client.get(reverse("admin:catalog_product_sample"))
        self.assertEqual(next(load_workbook(BytesIO(sample.content)).active.values)[:5],
                         ("slug", "title", "category", "brand", "price"))

        def post_rows(rows):
            book = Workbook()
            sheet = book.active
            sheet.append(("slug", "title", "category", "brand", "price", "stock", "is_active"))
            for row in rows:
                sheet.append(row)
            output = BytesIO()
            book.save(output)
            return self.client.post(path, {"workbook": SimpleUploadedFile("products.xlsx", output.getvalue())})

        product = ("example-test", "Test", "skincare", "Import brand", 85000, 3, False)
        error = post_rows([product, ("bad-item", "Malformed", "skincare", "Other", "=2+2")])
        self.assertContains(error, "فرمول")
        self.assertFalse(Product.objects.filter(slug=product[0]).exists())
        self.assertEqual(post_rows([product]).status_code, 302)
        self.assertFalse(Product.objects.get(slug=product[0]).is_active)
        self.assertContains(post_rows([product]), "اسلاگ تکراری")
        self.assertContains(self.client.post(path, {"workbook": SimpleUploadedFile("broken.xlsx", b"not a ZIP")}),
                            "محتوای فایل اکسل معتبر نیست")

    def test_photo_upload_check_and_persistence(self):
        admin = get_user_model().objects.create_superuser("photo-admin", password="temporary-test-password")
        self.client.force_login(admin)
        product = Product.objects.get(slug=self.slug)
        path = reverse("admin:catalog_product_change", args=[product.pk])
        fields = {
            "slug": product.slug, "category": product.category_id, "brand": product.brand_id,
            "title": product.title, "english_name": product.english_name, "price": product.price,
            "stock": product.stock, "is_active": "on", "image": product.image, "extra": "[]",
            "faq": '[{"question":"How?","answer":"Like this."}]', "usage": "روش مصرف نمونه", "_save": "Save",
        }
        for filename, content in (("wrong.png", b"not an image"), ("large.png", b"x" * (IMAGE_LIMIT + 1))):
            response = self.client.post(path, {**fields, "photo": SimpleUploadedFile(filename, content)})
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.context["adminform"].form.errors["photo"])
            self.assertFalse(ProductPhoto.objects.exists())
        output = BytesIO()
        Image.new("RGB", (20, 20), "purple").save(output, "PNG")
        wrong_extension = self.client.post(path, {**fields, "photo": SimpleUploadedFile("wrong.jpg", output.getvalue())})
        self.assertContains(wrong_extension, "پسوند فایل")
        self.assertEqual(self.client.post(path, {**fields, "photo": SimpleUploadedFile("good.png", output.getvalue())}).status_code, 302)
        photo = ProductPhoto.objects.get(product=product)
        self.client.logout()
        data = self.client.get(reverse("product", args=[self.slug])).json()
        self.assertTrue(data["image"].endswith(photo.url()))
        self.assertEqual(data["usage"], "روش مصرف نمونه")
        self.assertEqual(data["faq"][0]["question"], "How?")
        self.assertEqual(self.client.get(photo.url())["Content-Type"], "image/webp")
