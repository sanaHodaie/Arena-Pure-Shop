from django.test import TestCase, override_settings
from django.contrib.auth.hashers import make_password
from .models import CustomerAccount, CustomerOrder, Product
from .customer_views import SESSION_KEY, session_signature
import json
@override_settings(SECURE_SSL_REDIRECT=False)
class OrdersTests(TestCase):
 def setUp(self):
  self.customer=CustomerAccount.objects.create(phone='09121234567',password=make_password('test-secret'))
  session=self.client.session
  session[SESSION_KEY]={'id':str(self.customer.pk),'signature':session_signature(self.customer)}
  session.save()
 def test_server_price_and_customer_isolation(self):
  p=Product.objects.filter(stock__gt=0,is_active=True).first()
  self.assertIsNotNone(p)
  result=self.client.post('/api/v1/account/orders/',{'payload':json.dumps({'items':[{'id':p.pk,'quantity':1,'price':1}]})})
  self.assertEqual(result.status_code,201)
  order=result.json()['order']
  self.assertEqual(order['subtotal'],p.price)
  self.client.logout()
  self.assertEqual(self.client.get('/api/v1/account/orders/').status_code,401)
 def test_payment_is_demo_and_cannot_be_reversed(self):
  p=Product.objects.filter(stock__gt=0,is_active=True).first()
  order=self.client.post('/api/v1/account/orders/',{'payload':json.dumps({'items':[{'id':p.pk,'quantity':1}]})}).json()['order']
  self.client.post('/api/v1/account/orders/',{'payload':json.dumps({'orderId':order['id'],'status':'successful'})})
  result=self.client.post('/api/v1/account/orders/',{'payload':json.dumps({'orderId':order['id'],'status':'failed'})}).json()['order']
  self.assertEqual(result['status'],'successful')
  self.assertTrue(result['isDemo'])
