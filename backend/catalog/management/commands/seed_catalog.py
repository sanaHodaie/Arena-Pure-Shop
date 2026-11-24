from django.apps import apps
from django.core.management.base import BaseCommand
from django.db import connection, transaction

from catalog.seed_catalog import import_catalog


class Command(BaseCommand):
    help = "Import missing items from the original catalog; existing products remain unchanged."

    @transaction.atomic
    def handle(self, *args, **options):
        count = import_catalog(apps, connection)
        self.stdout.write(self.style.SUCCESS(f"Imported {count} products."))
