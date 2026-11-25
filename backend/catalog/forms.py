import hashlib
from io import BytesIO

from django import forms
from django.core.exceptions import ValidationError
from PIL import Image, ImageOps, UnidentifiedImageError

from .models import Article, Product


IMAGE_LIMIT = 5 * 1024 * 1024
IMAGE_FORMATS = {"JPEG": {".jpg", ".jpeg"}, "PNG": {".png"}, "WEBP": {".webp"}}


class ProductContentForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = "__all__"
        labels = {
            "title": "نام محصول", "english_name": "نام انگلیسی", "slug": "شناسهٔ آدرس",
            "category": "دسته‌بندی", "brand": "برند", "product_type": "نوع محصول", "model": "مدل",
            "price": "قیمت (تومان)", "old_price": "قیمت قبلی (تومان)", "stock": "تعداد موجودی",
            "is_active": "نمایش در فروشگاه", "image": "آدرس تصویر قبلی یا خارجی",
            "family": "خانوادهٔ رنگ یا مدل", "shade": "نام رنگ", "color": "کد رنگ",
            "undertone": "تناژ", "shade_note": "راهنمای رنگ", "description": "معرفی محصول",
            "suitability": "این محصول برای من مناسبه؟", "usage": "روش مصرف",
            "ingredients": "ترکیبات", "source_url": "آدرس منبع", "extra": "مشخصات تکمیلی",
            "faq": "پرسش‌های متداول",
        }
        help_texts = {
            "extra": 'نمونه: [["حجم", "۳۰ میلی‌لیتر"]]',
            "faq": 'نمونه: [{"question": "یک پرسش", "answer": "پاسخ پرسش"}]',
            "is_active": "محصول غیرفعال از کاتالوگ عمومی پنهان می‌شود و در پنل باقی می‌ماند.",
        }

    def clean_extra(self):
        value = self.cleaned_data["extra"] or []
        if not isinstance(value, list) or any(
            not isinstance(pair, list) or len(pair) != 2 or not all(isinstance(item, str) for item in pair)
            for pair in value
        ):
            raise ValidationError("مشخصات را به صورت آرایهٔ زوج‌های عنوان و مقدار وارد کنید.")
        return value

    def clean_faq(self):
        value = self.cleaned_data["faq"] or []
        if not isinstance(value, list) or any(
            not isinstance(item, dict) or not all(isinstance(item.get(key), str) and item[key].strip()
                                                  for key in ("question", "answer"))
            for item in value
        ):
            raise ValidationError("هر سؤال باید فیلد question و answer داشته باشد.")
        return value

    def clean_color(self):
        value = self.cleaned_data["color"]
        if value and (not value.startswith("#") or len(value) != 7 or
                      any(char not in "0123456789abcdefABCDEF" for char in value[1:])):
            raise ValidationError("کد رنگ را در قالب #a66c71 وارد کنید.")
        return value


class ProductAdminForm(ProductContentForm):
    photo = forms.FileField(
        label="بارگذاری عکس محصول", required=False,
        help_text="JPG، PNG یا WebP، حداکثر ۵ مگابایت و ۴۰۹۶ پیکسل در هر ضلع. بارگذاری عکس جدید، تصویر قبلی را جایگزین می‌کند.",
        widget=forms.ClearableFileInput(attrs={"accept": "image/jpeg,image/png,image/webp"}),
    )
    remove_photo = forms.BooleanField(label="حذف عکس بارگذاری‌شده", required=False)

    def clean_photo(self):
        upload = self.cleaned_data["photo"]
        if not upload:
            return None
        if upload.size > IMAGE_LIMIT:
            raise ValidationError("عکس نباید بیشتر از ۵ مگابایت باشد.")
        suffix = "." + upload.name.rsplit(".", 1)[-1].lower()
        source = BytesIO(upload.read(IMAGE_LIMIT + 1))
        try:
            with Image.open(source, formats=list(IMAGE_FORMATS)) as image:
                if suffix not in IMAGE_FORMATS[image.format]:
                    raise ValidationError("فرمت واقعی تصویر با پسوند فایل مطابقت ندارد.")
                if max(image.size) > 4096 or getattr(image, "is_animated", False):
                    raise ValidationError("عکس باید ثابت و حداکثر ۴۰۹۶ پیکسل در هر ضلع باشد.")
                image.verify()
            source.seek(0)
            with Image.open(source, formats=list(IMAGE_FORMATS)) as image:
                normalized = ImageOps.exif_transpose(image).convert("RGBA")
                normalized.thumbnail((1600, 1600))
                output = BytesIO()
                normalized.save(output, format="WEBP", quality=88)
        except (UnidentifiedImageError, OSError, SyntaxError, ValueError, Image.DecompressionBombError) as exc:
            raise ValidationError("فایل تصویر معتبر JPG، PNG یا WebP نیست.") from exc
        data = output.getvalue()
        return {"data": data, "digest": hashlib.sha256(data).hexdigest(), "content_type": "image/webp"}


class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = "__all__"


class ReviewSubmissionForm(forms.Form):
    name = forms.CharField(max_length=80)
    body = forms.CharField(min_length=5, max_length=1500)
