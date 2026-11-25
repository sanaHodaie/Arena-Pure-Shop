# Arena Pure catalog backend

Django 5.2, Django REST Framework, and PostgreSQL. The first migration of the data loads the seven storefront categories and all 70 existing products. Product IDs, slugs, variant families, and storefront routes are preserved. The imported availability flags initialize stock to one for available products and zero for unavailable products. Set the real stock counts and prices in Django Admin before using the catalog for live sales.

## Local setup

Run from the repository root. Use Python 3.12 and the Node version supported by this repository. For a PostgreSQL instance dedicated to local development, start the following container once.

```bash
docker run --name arena-pure-db -d -p 127.0.0.1:5432:5432 \
  -e POSTGRES_DB=arena_pure -e POSTGRES_USER=arena \
  -e POSTGRES_PASSWORD=arena_local_dev \
  -v arena-pure-db:/var/lib/postgresql/data postgres:17-alpine
```

If the container already exists and is stopped, use `docker start arena-pure-db`. To use an existing PostgreSQL database, supply its connection URL in the next block.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
export DJANGO_DEBUG=1
export DATABASE_URL=postgresql://arena:arena_local_dev@127.0.0.1:5432/arena_pure
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

On Windows PowerShell, activate with `.\.venv\Scripts\Activate.ps1` and set variables with `$env:DJANGO_DEBUG = "1"` and `$env:DATABASE_URL = "…"`. With debug enabled and no `DATABASE_URL`, Django uses a local SQLite database for quick development.

In a separate terminal at the repository root, install the frontend dependencies and point Vite at Django.

```bash
npm ci
VITE_API_BASE_URL=http://127.0.0.1:8000 npm run dev
```

Alternatively put `VITE_API_BASE_URL=http://127.0.0.1:8000` in `.env.local` at the repository root and run `npm run dev`. Open the storefront at `http://localhost:3000` and the React management panel at `http://localhost:3000/admin`. Change a product price in the management panel, then reload its storefront page to see the new price. With no API environment variable, the storefront uses the original bundled catalog for standalone frontend development.

## مدیریت کاتالوگ

Django را روی پورت ۸۰۰۰ اجرا کنید. سپس از ریشهٔ مخزن `npm ci` و `npm run dev` را اجرا کنید و با همان حساب مدیر Django وارد `http://localhost:3000/admin` شوید. اگر Django روی پورت دیگری اجرا می‌شود، متغیر `API_PROXY_TARGET` را به مبدأ آن تنظیم کنید. Vite صفحهٔ پنل و فروشگاه را روی یک دامنه سرو می‌کند.

در پنل `/admin/` وارد «محصولات» شوید. فیلتر دسته و برند در فهرست قرار دارد. با مداد فرم کامل محصول باز می‌شود. کلید نمایش محصول را بدون تغییر موجودی از کاتالوگ عمومی پنهان یا دوباره منتشر می‌کند.

- **عکس محصول** — یک تصویر ثابت JPG، PNG یا WebP تا ۵ مگابایت و حداکثر ۴۰۹۶ پیکسل در هر ضلع بارگذاری کنید. سرور محتوای فایل را بررسی و تصویر را به WebP با ضلع حداکثر ۱۶۰۰ پیکسل تبدیل می‌کند. عکس در دیتابیس می‌ماند و با بازسازی Render پاک نمی‌شود. برای عکس خارجی از آدرس HTTPS استفاده کنید.
- **ورود از اکسل** — قالب XLSX را از صفحهٔ ورود محصولات دانلود کنید. ستون‌های `slug`، `title`، `category`، `brand` و `price` ضروری‌اند. دسته را با اسلاگ و قیمت را به تومان وارد کنید. فایل حداکثر ۲ مگابایت و ۱۰۰۰ ردیف محصول است. اسلاگ تکراری یا ردیف نامعتبر کل ورود را متوقف می‌کند. برای ویرایش محصولات موجود از پنل استفاده کنید.
- **به‌روزرسانی لوکال** — با همان تنظیمات PostgreSQL محلی، وابستگی‌ها را دوباره از `requirements.txt` نصب کنید و `python manage.py migrate` را اجرا کنید. Render این مهاجرت‌ها را هنگام شروع سرویس اعمال می‌کند.

## API routes

| Route | Response |
| --- | --- |
| `GET /healthz/` | Database health |
| `GET /api/v1/catalog/` | Storefront bootstrap with categories and products |
| `GET /api/v1/categories/` | List of categories |
| `GET /api/v1/categories/<slug>/` | A category and its storefront path |
| `GET /api/v1/products/?category=skincare&search=serum&ordering=price&page=1` | Paginated, searchable product list |
| `GET /api/v1/products/<slug>/` | Product, current price, availability, shade and storefront path |

Product image paths beginning with `/images/` resolve on the storefront origin. Use an HTTPS image URL in Admin for an image hosted outside the storefront. Account, checkout and payment flows are still the frontend demos.

## Neon, Render and Vercel

1. In **Neon**, create a PostgreSQL project and select a region near your Render service. In the Neon **Connect** dialog, select the database and role, turn connection pooling off, and copy the **direct** connection string. Keep the SSL parameters Neon supplies.
2. In **Render**, create a **Blueprint** from this GitHub repository on `main`. The root [render.yaml](../render.yaml) defines a Free Python web service. Set its secret `DATABASE_URL` to the Neon string and set `CORS_ALLOWED_ORIGINS` to the exact Vercel origin such as `https://your-project.vercel.app`, with no trailing slash. Separate multiple origins with commas. Render generates `DJANGO_SECRET_KEY`.
3. Once the Render service is healthy, check `https://<render-service>.onrender.com/healthz/` and `/api/v1/catalog/`. The Render service builds the Django backend from Root Directory `backend`. Vercel builds the storefront and React management entry together and forwards `/api/management/*` and product media to Render. The start command applies migrations before launching Gunicorn, since Render Free does not offer a separate pre-deploy command. The catalog is seeded once by a data migration and later restarts keep Admin edits in Neon.
4. To create the first administrator, use the backend's activated local Python environment after Render has applied migrations. Render Free does not provide a service Shell. Run the following from `backend` in Bash and paste the Neon connection string at the hidden prompt.

   ```bash
   read -rsp 'Neon database URL: ' arena_neon_url
   printf '\n'
   DJANGO_DEBUG=1 DATABASE_URL="$arena_neon_url" python manage.py createsuperuser
   unset arena_neon_url
   ```

   Sign in at `/admin` on the Vercel storefront domain. Include that exact HTTPS origin in Render’s `CORS_ALLOWED_ORIGINS` or `ADMIN_FRONTEND_ORIGINS` to allow CSRF-protected sign-in through the proxy. Keep the connection string out of the repository and chat.
5. In **Vercel**, set `VITE_API_BASE_URL` to the Render service origin such as `https://<render-service>.onrender.com` without an API path, then redeploy. For the production service at `arena-pure-catalog.onrender.com`, Vercel forwards `/_catalog` to Render on behalf of the storefront. If changing the production backend hostname, update the rewrite and its matching origin in `src/main.jsx`. If the live catalog is unavailable, the storefront labels its bundled demo catalog and blocks order submission. Change a product price in Render Admin and reload its product page on Vercel to verify the connection.

Render and Neon may suspend idle compute on their Free plans, so the first request after inactivity can take longer. PostgreSQL data lives in Neon and is independent of Render restarts.

## Checks

Run `python manage.py test` inside `backend` with the environment from local setup. From the repository root run `npm run build`, `npm run lint`, and `node --test tests/*.test.js`.
