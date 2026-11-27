import re
from functools import lru_cache

from django import forms
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.middleware.csrf import get_token, rotate_token
from django.utils.crypto import constant_time_compare, get_random_string, salted_hmac
from django.views.csrf import csrf_failure as default_csrf_failure
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_http_methods

from .auth_limits import take_attempt
from .models import CustomerAccount


SESSION_KEY = "arena_customer"
DIGITS = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")


def normalize_phone(value):
    value = re.sub(r"[\s-]", "", value.translate(DIGITS))
    return re.sub(r"^(?:\+98|0098)", "0", value)


def session_signature(account):
    return salted_hmac("arena.customer.session", account.password, algorithm="sha256").hexdigest()


@lru_cache(maxsize=1)
def dummy_hash():
    return make_password(get_random_string(32))


def current_customer(request):
    stored = request.session.get(SESSION_KEY)
    if not stored:
        return None
    account = CustomerAccount.objects.filter(pk=stored["id"], is_active=True).first()
    if account and constant_time_compare(stored["signature"], session_signature(account)):
        return account
    request.session.pop(SESSION_KEY, None)
    return None


def session_response(request, account):
    return JsonResponse({
        "account": {"id": str(account.pk), "phone": account.phone} if account else None,
        "csrf": get_token(request),
    })


@never_cache
def csrf_failure(request, reason=""):
    if request.path.startswith(("/api/v1/account/", "/api/management/")):
        return JsonResponse({
            "error": "نشست یا مبدأ این درخواست تأیید نشد. صفحه را تازه کنید و دوباره تلاش کنید.",
            "code": "csrf_rejected",
        }, status=403)
    return default_csrf_failure(request, reason=reason)


@never_cache
@require_http_methods(["GET", "POST"])
def customer_session(request):
    if request.method == "GET":
        return session_response(request, current_customer(request))

    action = request.POST.get("action")
    if action == "logout":
        request.session.pop(SESSION_KEY, None)
        request.session.cycle_key()
        rotate_token(request)
        return session_response(request, None)
    if action not in ("register", "login"):
        return JsonResponse({"error": "درخواست نامعتبر است."}, status=400)
    phone = normalize_phone(request.POST.get("phone", "")[:40])
    password = request.POST.get("password", "")
    if not re.fullmatch(r"09[0-9]{9}", phone) or not 1 <= len(password) <= 128:
        return JsonResponse({"error": "شماره موبایل یا رمز عبور معتبر نیست."}, status=400)
    if not take_attempt(f"customer-{action}", phone, 5 if action == "register" else 8):
        return JsonResponse({"error": "تعداد تلاش‌ها زیاد است. چند دقیقه دیگر دوباره امتحان کنید."}, status=429,
                            headers={"Retry-After": "900"})
    if action == "register":
        try:
            if len(password) < 12:
                raise ValidationError("رمز عبور باید حداقل ۱۲ نویسه داشته باشد.")
            validate_password(password)
        except ValidationError:
            return JsonResponse({"error": "رمز حداقل ۱۲ نویسه و غیرمتداول انتخاب کنید که فقط عدد نباشد."}, status=400)
        CustomerAccount.objects.get_or_create(phone=phone, defaults={"password": make_password(password)})
        return JsonResponse({"accepted": True}, status=202)

    account = CustomerAccount.objects.filter(phone=phone, is_active=True).first()
    valid = check_password(password, account.password if account else dummy_hash())
    if not account or not valid:
        return JsonResponse({"error": "شماره موبایل یا رمز عبور درست نیست."}, status=401)
    request.session.cycle_key()
    request.session[SESSION_KEY] = {"id": str(account.pk), "signature": session_signature(account)}
    rotate_token(request)
    return session_response(request, account)


class CustomerProfileForm(forms.Form):
    firstName = forms.CharField(max_length=100)
    lastName = forms.CharField(max_length=100)
    email = forms.EmailField(max_length=100, required=False)
    province = forms.CharField(max_length=100)
    city = forms.CharField(max_length=100)
    postalCode = forms.RegexField(r"^[0-9۰-۹٠-٩]{10}$", max_length=10)
    address = forms.CharField(max_length=300)


@never_cache
@require_http_methods(["GET", "POST"])
def customer_profile(request):
    account = current_customer(request)
    if not account:
        return JsonResponse({"error": "برای دسترسی به مشخصات دوباره وارد شوید."}, status=401)
    if request.method == "POST":
        form = CustomerProfileForm(request.POST)
        if not form.is_valid():
            return JsonResponse({"error": "مشخصات، نشانی و کد پستی را بررسی کنید."}, status=400)
        CustomerAccount.objects.filter(pk=account.pk).update(profile=form.cleaned_data)
        account.profile = form.cleaned_data
    return JsonResponse({"profile": account.profile})
