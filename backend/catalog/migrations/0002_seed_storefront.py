from django.db import migrations

from catalog.seed_catalog import import_catalog


def seed_storefront(apps, schema_editor):
    import_catalog(apps, schema_editor.connection)


class Migration(migrations.Migration):
    dependencies = [("catalog", "0001_initial")]
    operations = [migrations.RunPython(seed_storefront, reverse_code=migrations.RunPython.noop)]
