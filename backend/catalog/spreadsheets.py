from io import BytesIO
from zipfile import BadZipFile, ZipFile

from django.core.exceptions import ValidationError
from django.db import transaction
from openpyxl import Workbook, load_workbook
from openpyxl.utils.exceptions import InvalidFileException

from .forms import ProductContentForm
from .models import Brand, Category, Product


MAX_UPLOAD = 2 * 1024 * 1024
MAX_ROWS = 1000
REQUIRED = ("slug", "title", "category", "brand", "price")
OPTIONAL = ("stock", "is_active", "english_name", "product_type", "model", "shade", "color", "family",
            "undertone", "shade_note", "old_price", "image", "source_url", "description", "suitability",
            "usage", "ingredients", "extra", "faq")
COLUMNS = REQUIRED + OPTIONAL


class ProductSpreadsheetForm(ProductContentForm):
    class Meta(ProductContentForm.Meta):
        exclude = ("category", "brand")

    def validate_unique(self):
        # Slugs are checked together before insertion and constrained by PostgreSQL.
        pass


def sample_workbook():
    book = Workbook()
    sheet = book.active
    sheet.title = "Products"
    sheet.append(COLUMNS)
    sheet.append(("example-moisturizer", "مرطوب‌کننده نمونه", "skincare", "Arena Pure", 500000, 4, True))
    output = BytesIO()
    book.save(output)
    return output.getvalue()


def parse_rows(upload):
    if not upload.name.lower().endswith(".xlsx") or upload.size > MAX_UPLOAD:
        raise ValidationError("فایل باید XLSX و حداکثر ۲ مگابایت باشد.")
    content = BytesIO(upload.read(MAX_UPLOAD + 1))
    try:
        with ZipFile(content) as archive:
            files = archive.infolist()
            if len(files) > 150 or sum(file.file_size for file in files) > 24 * 1024 * 1024:
                raise ValidationError("محتوای بازشدهٔ فایل بیش از حد بزرگ است.")
        content.seek(0)
        book = load_workbook(content, read_only=True, keep_links=False)
        try:
            sheet = book.worksheets[0]
            if sheet.max_column is not None and sheet.max_column > len(COLUMNS):
                raise ValidationError("تعداد ستون‌های فایل بیشتر از قالب نمونه است.")
            sheet.reset_dimensions()
            rows = sheet.iter_rows(max_col=len(COLUMNS) + 1)
            header = [str(cell.value).strip() if cell.value is not None else ""
                      for cell in next(rows, ())]
            while header and not header[-1]:
                header.pop()
            if (not set(REQUIRED).issubset(header) or not set(header).issubset(COLUMNS)
                    or len(header) != len(set(header))):
                raise ValidationError("نام ستون‌ها را مطابق فایل نمونه وارد کنید.")
            result = []
            for number, row in enumerate(rows, start=2):
                if number > MAX_ROWS + 1:
                    raise ValidationError("حداکثر ۱۰۰۰ ردیف محصول در هر فایل پذیرفته می‌شود.")
                if not any(cell.value is not None for cell in row):
                    continue
                if any(cell.data_type in ("f", "e") for cell in row) or any(
                    cell.value is not None for cell in row[len(header):]
                ):
                    raise ValidationError(f"ردیف {number}: فرمول، خطای اکسل یا ستون بدون عنوان پذیرفته نمی‌شود.")
                values = {key: cell.value.strip() if isinstance(cell.value, str) else cell.value
                          for key, cell in zip(header, row) if cell.value is not None}
                result.append((number, values))
            if not result:
                raise ValidationError("فایل هیچ ردیف محصولی ندارد.")
            return result
        finally:
            book.close()
    except (BadZipFile, InvalidFileException, KeyError, ValueError, OSError, IndexError, SyntaxError) as exc:
        raise ValidationError("محتوای فایل اکسل معتبر نیست.") from exc


@transaction.atomic
def import_products(upload):
    rows = parse_rows(upload)
    categories = dict(Category.objects.values_list("slug", "pk"))
    slugs = [values.get("slug") for _, values in rows if isinstance(values.get("slug"), str)]
    existing = set(Product.objects.filter(slug__in=slugs).values_list("slug", flat=True))
    names = set()
    pending = []
    for number, values in rows:
        slug = values.get("slug")
        if not isinstance(slug, str) or not slug:
            raise ValidationError(f"ردیف {number}: اسلاگ محصول را وارد کنید.")
        if slug in existing:
            raise ValidationError(f"ردیف {number}: اسلاگ تکراری است. برای ویرایش از پنل استفاده کنید.")
        existing.add(slug)
        category = categories.get(values.get("category"))
        name = values.get("brand")
        if not category or not isinstance(name, str) or not name or len(name) > 120:
            raise ValidationError(f"ردیف {number}: اسلاگ دسته و نام برند معتبر وارد کنید.")
        values.setdefault("stock", 0)
        active = str(values.get("is_active", True)).lower()
        if active not in {"true", "false", "1", "0"}:
            raise ValidationError(f"ردیف {number}: مقدار is_active باید true یا false باشد.")
        values["is_active"] = active in {"true", "1"}
        form = ProductSpreadsheetForm(data=values)
        if not form.is_valid():
            detail = "؛ ".join(f"{key}: {' '.join(errors)}" for key, errors in form.errors.items())
            raise ValidationError(f"ردیف {number}: {detail}")
        product = form.save(commit=False)
        product.category_id = category
        names.add(name)
        pending.append((product, name))
    known_brands = set(Brand.objects.filter(name__in=names).values_list("name", flat=True))
    Brand.objects.bulk_create([Brand(name=name) for name in sorted(names - known_brands)], ignore_conflicts=True)
    brands = dict(Brand.objects.filter(name__in=names).values_list("name", "pk"))
    for product, name in pending:
        product.brand_id = brands[name]
    Product.objects.bulk_create([product for product, _ in pending])
    return len(pending)
