from django.core.management.base import BaseCommand

from catalog.login_history import recent_logins


class Command(BaseCommand):
    help = "Delete admin login records older than 10 days."

    def handle(self, *args, **options):
        recent_logins()
