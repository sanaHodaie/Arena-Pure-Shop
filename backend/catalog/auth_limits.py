from datetime import datetime, timedelta, timezone

from django.db.models import F
from django.utils.crypto import salted_hmac

from .models import AuthAttempt


def take_attempt(scope, identifier, limit):
    now = datetime.now(timezone.utc)
    bucket = int(now.timestamp()) // 900
    expires = datetime.fromtimestamp((bucket + 1) * 900, timezone.utc)
    key = salted_hmac("arena.auth.limit", f"{scope}:{bucket}:{identifier}", algorithm="sha256").hexdigest()
    AuthAttempt.objects.filter(expires_at__lt=now - timedelta(hours=1)).delete()
    AuthAttempt.objects.get_or_create(key=key, defaults={"expires_at": expires})
    return bool(AuthAttempt.objects.filter(key=key, count__lt=limit).update(count=F("count") + 1))
