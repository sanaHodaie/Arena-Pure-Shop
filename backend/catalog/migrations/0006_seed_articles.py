import json
from pathlib import Path

from django.core.management.color import no_style
from django.db import migrations


def load_articles(apps, schema_editor):
    Article = apps.get_model("catalog", "Article")
    Category = apps.get_model("catalog", "Category")
    alias = schema_editor.connection.alias
    rows = json.loads(Path(__file__).with_name("article_seed.json").read_text(encoding="utf-8"))
    for row in rows:
        category = row.pop("category")
        row["related_category_id"] = Category.objects.using(alias).filter(slug=category).values_list("pk", flat=True).first()
        Article.objects.using(alias).get_or_create(pk=row.pop("id"), defaults=row)
    for sql in schema_editor.connection.ops.sequence_reset_sql(no_style(), [Article]):
        schema_editor.execute(sql)


class Migration(migrations.Migration):
    dependencies = [("catalog", "0005_article_review_and_admin_login")]
    operations = [migrations.RunPython(load_articles, migrations.RunPython.noop)]
