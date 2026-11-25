from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_GET, require_http_methods, require_POST

from .forms import ArticleForm, ReviewSubmissionForm
from .login_history import recent_logins
from .models import Article, Category, Product, ProductReview
from .panel_views import forbidden, staff_api


def article_data(article):
    return {
        "id": article.pk, "title": article.title, "excerpt": article.excerpt, "author": article.author,
        "date": article.date_label, "readTime": article.read_time, "body": article.body,
        "cover": {"image": article.cover_image, "theme": article.cover_theme,
                  "topic": article.topic, "summary": article.summary},
        "relatedCategory": article.related_category.slug if article.related_category_id else "",
    }


@require_GET
def public_articles(request):
    articles = Article.objects.filter(is_published=True).select_related("related_category")
    return JsonResponse({"articles": [article_data(article) for article in articles]})


@staff_api
@require_GET
def articles(request):
    if not any(request.user.has_perm(f"catalog.{action}_article") for action in ("view", "add", "change")):
        return forbidden()
    rows = Article.objects.select_related("related_category")
    return JsonResponse({
        "articles": [{
            **article_data(article), "published": article.is_published, "categoryId": article.related_category_id,
        } for article in rows],
        "categories": list(Category.objects.values("id", "title")),
    })


@staff_api
@require_POST
def save_article(request, pk=None):
    if not request.user.has_perm(f"catalog.{'change' if pk else 'add'}_article"):
        return forbidden()
    article = get_object_or_404(Article, pk=pk) if pk else None
    form = ArticleForm(request.POST, instance=article)
    if not form.is_valid():
        return JsonResponse({"errors": form.errors}, status=400)
    return JsonResponse({"id": form.save().pk}, status=200 if pk else 201)


def review_data(review):
    return {"id": review.pk, "name": review.name, "body": review.body, "createdAt": review.created_at}


@never_cache
@require_http_methods(["GET", "POST"])
def public_reviews(request, slug):
    product = get_object_or_404(Product, slug=slug, is_active=True)
    if request.method == "POST":
        form = ReviewSubmissionForm(request.POST)
        if not form.is_valid():
            return JsonResponse({"error": "نام و متن دیدگاه معتبر وارد کنید."}, status=400)
        ProductReview.objects.create(product=product, **form.cleaned_data)
        return JsonResponse({"status": "pending"}, status=201)
    approved = product.reviews.filter(status=ProductReview.Status.APPROVED)
    return JsonResponse({"reviews": [review_data(review) for review in approved[:50]],
                         "count": approved.count(), "csrf": get_token(request)})


@staff_api
@require_GET
def reviews(request):
    if not any(request.user.has_perm(f"catalog.{action}_productreview") for action in ("view", "change")):
        return forbidden()
    status = request.GET.get("status", ProductReview.Status.PENDING)
    if status not in ProductReview.Status.values:
        return JsonResponse({"error": "وضعیت دیدگاه معتبر نیست."}, status=400)
    rows = ProductReview.objects.filter(status=status).select_related("product")
    return JsonResponse({"reviews": [{**review_data(review), "product": review.product.title,
                                      "slug": review.product.slug, "status": review.status} for review in rows]})


@staff_api
@require_POST
def moderate_review(request, pk):
    if not request.user.has_perm("catalog.change_productreview"):
        return forbidden()
    status = request.POST.get("status")
    if status not in (ProductReview.Status.APPROVED, ProductReview.Status.REJECTED):
        return JsonResponse({"error": "وضعیت دیدگاه معتبر نیست."}, status=400)
    review = get_object_or_404(ProductReview, pk=pk)
    review.status = status
    review.moderated_by = request.user.get_username()
    review.moderated_at = timezone.now()
    review.save(update_fields=["status", "moderated_by", "moderated_at"])
    return JsonResponse({"status": status})


@staff_api
@require_GET
def login_logs(request):
    if not request.user.has_perm("catalog.view_adminlogin"):
        return forbidden()
    rows = recent_logins().values("username", "created_at")
    return JsonResponse({"logs": list(rows)})
