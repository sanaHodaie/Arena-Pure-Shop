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

Alternatively put `VITE_API_BASE_URL=http://127.0.0.1:8000` in `.env.local` at the repository root and run `npm run dev`. Open the storefront at `http://localhost:3000` and Django Admin at `http://127.0.0.1:8000/admin/`. Change a product price in Django Admin, then reload its storefront page to see the new price. With no API environment variable, the storefront uses the original bundled catalog for standalone frontend development.

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

## Render and Vercel

1. In Render, create a **Blueprint** from the GitHub repository on `main`. The root [render.yaml](../render.yaml) provisions a Python web service and PostgreSQL. The selected Starter web and Basic PostgreSQL plans are paid. Review pricing in Render before applying the Blueprint.
2. Set the Render Blueprint's `CORS_ALLOWED_ORIGINS` to the exact storefront origin such as `https://your-project.vercel.app`, without a trailing slash. Separate multiple explicit origins with commas.
3. Once Render shows a healthy deployment, verify `https://<render-service>.onrender.com/healthz/` and `/api/v1/catalog/`. The build collects Admin static files and the pre-deploy command applies schema and initial catalog migrations.
4. Open the Render web service Shell and run `python manage.py createsuperuser`. Open `/admin/` on the Render service to manage products.
5. In Vercel, set `VITE_API_BASE_URL` to the Render service origin such as `https://<render-service>.onrender.com` without an API path. Redeploy the frontend so the Vite build picks up the variable. Direct product and category URLs use the repository's SPA rewrite. Change a price in Render Admin and reload its product on Vercel to verify the connection.

## Checks

Run `python manage.py test` inside `backend` with the environment from local setup. From the repository root run `npm run build`, `npm run lint`, and `node --test tests/*.test.js`.
