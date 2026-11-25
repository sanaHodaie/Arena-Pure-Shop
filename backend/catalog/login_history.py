from datetime import timedelta

from django.utils import timezone

from .models import AdminLogin


def recent_logins():
    cutoff = timezone.now() - timedelta(days=10)
    AdminLogin.objects.filter(created_at__lt=cutoff).delete()
    return AdminLogin.objects.filter(created_at__gte=cutoff)
