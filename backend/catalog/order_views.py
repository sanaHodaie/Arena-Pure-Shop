import json
from uuid import uuid4
from django.http import JsonResponse
from django.db import transaction
from django.views.decorators.http import require_http_methods
from .models import CustomerOrder, Product
from .customer_views import current_customer
from .panel_views import staff_api

def serialize(order):
 return {**order.snapshot,'id':order.pk,'status':order.status,'createdAt':order.created_at.isoformat()}

@require_http_methods(['GET','POST'])
def customer_orders(request):
 customer = current_customer(request)
 if not customer: return JsonResponse({'error':'ابتدا وارد حساب شوید.'},status=401)
 if request.method == 'GET':
  return JsonResponse({'orders':[serialize(o) for o in CustomerOrder.objects.filter(customer=customer).order_by('-id')]})
 try:
  payload=json.loads(request.POST.get('payload','{}'))
  with transaction.atomic():
   if 'orderId' in payload:
    order=CustomerOrder.objects.select_for_update().get(pk=payload['orderId'],customer=customer)
    status=payload.get('status')
    if status not in ['successful','failed','cancelled']: raise ValueError()
    if order.status == 'pending': order.status=status; order.save(update_fields=['status'])
    return JsonResponse({'order':serialize(order)})
   cart=payload['items']
   if not isinstance(cart,list) or not 1<=len(cart)<=100: raise ValueError()
   items=[]; seen=set()
   for row in cart:
    quantity=row['quantity']
    if type(quantity) is not int or not 1<=quantity<=99 or row['id'] in seen: raise ValueError()
    seen.add(row['id'])
    product=Product.objects.get(pk=row['id'],is_active=True)
    if quantity>product.stock: raise ValueError()
    items.append({'id':product.pk,'title':product.title,'price':product.price,'quantity':quantity})
   subtotal=sum(i['price']*i['quantity'] for i in items)
   shipping=0 if subtotal>=500000 else 35000
   order=CustomerOrder.objects.create(customer=customer,snapshot={
    'phone':customer.phone,'buyer':customer.profile,'seller':'آرنا پیور','items':items,
    'subtotal':subtotal,'shipping':shipping,'discount':0,'tax':0,'total':subtotal+shipping,
    'currency':'تومان','isDemo':True,'reference':'TEST-'+uuid4().hex[:12].upper()})
   return JsonResponse({'order':serialize(order)},status=201)
 except (ValueError,KeyError,TypeError,Product.DoesNotExist,CustomerOrder.DoesNotExist):
  return JsonResponse({'error':'اطلاعات سفارش یا موجودی محصول معتبر نیست.'},status=400)

@staff_api
@require_http_methods(['GET'])
def management_orders(request):
 if not request.user.is_superuser and not request.user.has_perm('catalog.view_customerorder'):
  return JsonResponse({'error':'دسترسی مشاهده سفارش ندارید.'},status=403)
 return JsonResponse({'orders':[serialize(o) for o in CustomerOrder.objects.select_related('customer').order_by('-id')[:200]]})
