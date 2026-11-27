from django.db import migrations, models
import django.db.models.deletion
class Migration(migrations.Migration):
 dependencies = [('catalog', '0008_customer_access_and_review_protection')]
 operations = [migrations.CreateModel(name='CustomerOrder', fields=[
 ('id',models.BigAutoField(auto_created=True,primary_key=True,serialize=False,verbose_name="ID")),
 ('snapshot',models.JSONField(default=dict)),('status',models.CharField(default='pending',max_length=20)),
 ('created_at',models.DateTimeField(auto_now_add=True)),
 ('customer',models.ForeignKey(on_delete=django.db.models.deletion.PROTECT,to='catalog.customeraccount'))])]
