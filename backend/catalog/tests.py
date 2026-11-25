from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import Client, TestCase, override_settings
from django.urls import reverse

from openpyxl import Workbook, load_workbook
from PIL import Image

from .forms import IMAGE_LIMIT
from .models import Category, Product, ProductPhoto


@override_settings(SECURE_SSL_REDIRECT=False, CORS_ALLOWED_ORIGINS=["https://shop.example.com"])
class CatalogTests(TestCase):
    slug = "maybelline-vinyl-ink-35-cheeky"

    def test_backend_home_links_to_health_and_catalog(self):
        response = self.client.get(reverse("index"))
        for name in ("health", "catalog"):
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
        response = self.client.post(f"/api/management/products/{product.pk}/", {
            "slug": product.slug, "category": product.category_id, "brand": product.brand_id,
            "title": product.title, "english_name": product.english_name, "price": 123456,
            "stock": 0, "is_active": "on", "image": product.image, "extra": "[]", "_save": "Save",
        })
        self.assertEqual(response.status_code, 200)
        call_command("seed_catalog", verbosity=0)
        data = self.client.get(reverse("product", args=[self.slug])).json()
        self.assertEqual(data["price"], 123456)
        self.assertFalse(data["inStock"])
        self.assertEqual(Product.objects.count(), 70)

    def test_django_has_no_management_ui_routes(self):
        for url in ("/admin/", "/django-admin/"):
            self.assertEqual(self.client.get(url).status_code, 404)

    def test_excel_sample_import_and_rollback(self):
        admin = get_user_model().objects.create_superuser("import-admin", password="temporary-test-password")
        path = "/api/management/workbook/"
        self.assertEqual(self.client.get(path).status_code, 401)
        self.client.force_login(admin)
        sample = self.client.get(path)
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
        self.assertIn("فرمول", error.json()["error"])
        self.assertFalse(Product.objects.filter(slug=product[0]).exists())
        self.assertEqual(post_rows([product]).status_code, 200)
        self.assertFalse(Product.objects.get(slug=product[0]).is_active)
        self.assertIn("اسلاگ تکراری", post_rows([product]).json()["error"])
        self.assertIn("محتوای فایل اکسل معتبر نیست",
                      self.client.post(path, {"workbook": SimpleUploadedFile("broken.xlsx", b"not a ZIP")}).json()["error"])

    def test_photo_upload_check_and_persistence(self):
        admin = get_user_model().objects.create_superuser("photo-admin", password="temporary-test-password")
        self.client.force_login(admin)
        product = Product.objects.get(slug=self.slug)
        path = f"/api/management/products/{product.pk}/"
        fields = {
            "slug": product.slug, "category": product.category_id, "brand": product.brand_id,
            "title": product.title, "english_name": product.english_name, "price": product.price,
            "stock": product.stock, "is_active": "on", "image": product.image, "extra": "[]",
            "faq": '[{"question":"How?","answer":"Like this."}]', "usage": "روش مصرف نمونه", "_save": "Save",
        }
        for filename, content in (("wrong.png", b"not an image"), ("large.png", b"x" * (IMAGE_LIMIT + 1))):
            response = self.client.post(path, {**fields, "photo": SimpleUploadedFile(filename, content)})
            self.assertEqual(response.status_code, 400)
            self.assertTrue(response.json()["errors"]["photo"])
            self.assertFalse(ProductPhoto.objects.exists())
        output = BytesIO()
        Image.new("RGB", (20, 20), "purple").save(output, "PNG")
        wrong_extension = self.client.post(path, {**fields, "photo": SimpleUploadedFile("wrong.jpg", output.getvalue())})
        self.assertIn("پسوند فایل", wrong_extension.json()["errors"]["photo"][0])
        self.assertEqual(self.client.post(path, {**fields, "photo": SimpleUploadedFile("good.png", output.getvalue())}).status_code, 200)
        photo = ProductPhoto.objects.get(product=product)
        self.client.logout()
        data = self.client.get(reverse("product", args=[self.slug])).json()
        self.assertTrue(data["image"].endswith(photo.url()))
        self.assertEqual(data["usage"], "روش مصرف نمونه")
        self.assertEqual(data["faq"][0]["question"], "How?")
        self.assertEqual(self.client.get(photo.url())["Content-Type"], "image/webp")

    def test_react_panel_permissions_and_catalog_mutations(self):
        client = Client(enforce_csrf_checks=True)
        account = get_user_model()
        admin = account.objects.create_superuser("react-admin", password="temporary-test-password")
        account.objects.create_user("customer", password="temporary-test-password")
        staff = account.objects.create_user("staff", is_staff=True)
        session = "/api/management/session/"
        catalog = "/api/management/catalog/"
        self.assertEqual(client.get(catalog).status_code, 401)
        credentials = {"username": "react-admin", "password": "temporary-test-password"}
        self.assertEqual(client.post(session, credentials).status_code, 403)
        headers = {"X-CSRFToken": client.get(session).json()["csrf"]}
        self.assertEqual(client.post(session, {**credentials, "username": "customer"}, headers=headers).status_code, 400)
        client.force_login(staff)
        self.assertEqual(client.get(catalog).status_code, 403)
        client.logout()
        headers["X-CSRFToken"] = client.get(session).json()["csrf"]
        login = client.post(session, credentials, headers=headers).json()
        self.assertEqual(login["account"]["username"], admin.username)
        headers["X-CSRFToken"] = login["csrf"]
        self.assertEqual(len(client.get(catalog).json()["products"]), 70)

        product = Product.objects.get(slug=self.slug)
        editor = f"/api/management/products/{product.pk}/"
        fields = client.get(editor).json()["fields"]
        values = {field["name"]: field["value"] for field in fields if field["value"] is not None}
        values["price"] = 123456
        values["suitability"] = "راهنمای انتخاب به‌روزشده"
        values["is_active"] = "true"
        bad_photo = client.post(editor, {**values, "photo": SimpleUploadedFile("invalid.png", b"not an image")},
                                headers=headers)
        self.assertIn("photo", bad_photo.json()["errors"])
        output = BytesIO()
        Image.new("RGB", (20, 20), "purple").save(output, "PNG")
        saved = client.post(editor, {**values, "photo": SimpleUploadedFile("product.png", output.getvalue())},
                            headers=headers)
        self.assertEqual(saved.status_code, 200, saved.content)
        public = reverse("product", args=[product.slug])
        self.assertEqual(client.get(public).json()["price"], 123456)
        self.assertTrue(client.get(public).json()["image"].endswith(ProductPhoto.objects.get(product=product).url()))
        self.assertEqual(client.post(editor + "action/", {"action": "hide"}, headers=headers).status_code, 200)
        self.assertEqual(client.get(public).status_code, 404)

        workbook = Workbook()
        workbook.active.append(("slug", "title", "category", "brand", "price"))
        workbook.active.append(("react-panel-import", "Imported product", "skincare", "Example", 100000))
        output = BytesIO()
        workbook.save(output)
        response = client.post("/api/management/workbook/", {"workbook": SimpleUploadedFile("products.xlsx", output.getvalue())},
                               headers=headers)
        self.assertEqual(response.json(), {"count": 1})
        self.assertTrue(Product.objects.filter(slug="react-panel-import").exists())
        self.assertIsNone(client.post(session, {"action": "logout"}, headers=headers).json()["account"])
        self.assertEqual(client.get(catalog).status_code, 401)

    def test_article_publish_review_moderation_and_login_history(self):
        from datetime import timedelta

        from django.utils import timezone

        from .models import AdminLogin, Article, ProductReview

        guest = Client(enforce_csrf_checks=True)
        product_url = f"/api/v1/products/{self.slug}/reviews/"
        review_headers = {"X-CSRFToken": guest.get(product_url).json()["csrf"]}
        self.assertEqual(guest.post(product_url, {"name": "مشتری", "body": "تجربهٔ خرید آزمایشی"}, headers=review_headers).status_code, 201)
        review = ProductReview.objects.get()
        self.assertEqual(review.status, ProductReview.Status.PENDING)
        self.assertEqual(guest.get(product_url).json()["count"], 0)
        moderation = f"/api/management/reviews/{review.pk}/"
        self.assertEqual(guest.post(moderation, {"status": "approved"}, headers=review_headers).status_code, 401)

        self.assertEqual(Article.objects.count(), 4)
        older = AdminLogin.objects.create(username="expired")
        AdminLogin.objects.filter(pk=older.pk).update(created_at=timezone.now() - timedelta(days=11))
        get_user_model().objects.create_superuser("article-admin", password="temporary-test-password")
        manager = Client(enforce_csrf_checks=True)
        session_url = "/api/management/session/"
        token = manager.get(session_url).json()["csrf"]
        session = manager.post(session_url, {"username": "article-admin", "password": "temporary-test-password"},
                               headers={"X-CSRFToken": token}).json()
        manager_headers = {"X-CSRFToken": session["csrf"]}
        self.assertEqual([row["username"] for row in manager.get("/api/management/login-logs/").json()["logs"]],
                         ["article-admin"])
        self.assertFalse(AdminLogin.objects.filter(pk=older.pk).exists())
        self.assertEqual(manager.post(moderation, {"status": "approved"}, headers=manager_headers).status_code, 200)
        self.assertEqual(guest.get(product_url).json()["reviews"][0]["name"], "مشتری")
        self.assertEqual(manager.post(moderation, {"status": "rejected"}, headers=manager_headers).status_code, 200)
        self.assertEqual(guest.get(product_url).json()["count"], 0)

        fields = {
            "title": "مقالهٔ تازه", "excerpt": "چکیده", "author": "article-admin", "date_label": "۵ آذر",
            "read_time": "۵ دقیقه", "cover_theme": "matte",
            "topic": "آرایش", "summary": "خلاصه", "body": "## آشنایی\nمتن کامل مقاله",
        }
        article_url = "/api/management/articles/new/"
        broken = manager.post(article_url, {**fields, "photo": SimpleUploadedFile("bad.png", b"bad")}, headers=manager_headers)
        self.assertIn("photo", broken.json()["errors"])
        too_large = manager.post(article_url, {**fields, "photo": SimpleUploadedFile("large.png", b"x" * (3 * 1024 * 1024 + 1))},
                                 headers=manager_headers)
        self.assertIn("photo", too_large.json()["errors"])
        output = BytesIO()
        Image.new("RGB", (32, 24), "purple").save(output, "PNG")
        created = manager.post(article_url, {**fields, "photo": SimpleUploadedFile("poster.png", output.getvalue())},
                               headers=manager_headers)
        self.assertEqual(created.status_code, 201, created.content)
        pk = created.json()["id"]
        self.assertGreater(pk, 4)
        self.assertEqual(guest.get("/api/v1/articles/").json()["articles"][0]["id"], 4)
        media_url = manager.get("/api/management/articles/").json()["articles"][0]["cover"]["image"]
        self.assertEqual(guest.get(media_url).status_code, 404)
        edited = manager.post(f"/api/management/articles/{pk}/", {**fields, "is_published": "on"}, headers=manager_headers)
        self.assertEqual(edited.status_code, 200)
        self.assertEqual(guest.get("/api/v1/articles/").json()["articles"][0]["id"], pk)
        self.assertEqual(guest.get(media_url)["Content-Type"], "image/webp")
        toggle = f"/api/management/articles/{pk}/visibility/"
        self.assertEqual(manager.post(toggle, {"published": "false"}, headers=manager_headers).status_code, 200)
        self.assertEqual(guest.get(media_url).status_code, 404)
        self.assertNotIn(pk, [row["id"] for row in guest.get("/api/v1/articles/").json()["articles"]])

    def test_sales_report_excel_matches_charts_and_demo_can_be_zeroed(self):
        from datetime import date, timedelta

        from django.utils import timezone

        endpoint = "/api/management/sales/"
        end = timezone.localdate()
        start = end - timedelta(days=59)
        query = {"start": start.isoformat(), "end": end.isoformat()}
        self.assertEqual(self.client.get(endpoint, query).status_code, 401)
        manager = get_user_model().objects.create_superuser("sales-admin", password=None)
        self.client.force_login(manager)
        self.assertEqual(self.client.get(endpoint, {"start": "bad"}).status_code, 400)
        self.assertEqual(self.client.get(endpoint, {"start": date(2000, 1, 1), "end": end}).status_code, 400)
        with override_settings(SALES_REPORT_DEMO=True):
            report = self.client.get(endpoint, query).json()
            self.assertTrue(report["demo"])
            self.assertEqual(len(report["days"]), 60)
            self.assertGreater(report["totals"]["revenue"], 0)
            self.assertEqual(sum(row["revenue"] for row in report["series"]), report["totals"]["revenue"])
            file = self.client.get(endpoint + "export/", query)
            self.assertIn("arena-demo-sales", file["Content-Disposition"])
            workbook = load_workbook(BytesIO(file.content))
            self.assertEqual(workbook["خلاصه"]["B4"].value, report["totals"]["revenue"])
            self.assertEqual(workbook["آمار روزانه"].max_row, 61)
            self.assertEqual(len(workbook["نمودارها"]._charts), 2)
        with override_settings(SALES_REPORT_DEMO=False):
            report = self.client.get(endpoint, query).json()
            self.assertFalse(report["demo"])
            self.assertEqual(report["totals"], {"revenue": 0, "orders": 0})
