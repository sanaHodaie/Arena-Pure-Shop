import {getOrders,writeOrder} from './customerSession.js';
const ordersKey = 'arena-demo-orders';

export const orderStatuses = {
  pending: 'در انتظار پرداخت',
  successful: 'موفق',
  failed: 'ناموفق',
  cancelled: 'لغوشده',
};

export const freeShippingThreshold = 500_000;

export function shippingCost(subtotal) {
  return subtotal >= freeShippingThreshold ? 0 : 35_000;
}

export async function readCustomerOrders() { return (await getOrders()).orders; }
export async function createCustomerOrder(phone,cart) { return (await writeOrder({items:cart.map(({id,quantity})=>({id,quantity}))})).order.id; }
export async function resolveCustomerOrder(phone,id,status) { await writeOrder({orderId:id,status}); }

export function readCustomerFavorites(phone) {
  try {
    return JSON.parse(localStorage.getItem('arena-demo-favorites:' + (phone ?? 'guest'))) || [];
  } catch {
    return [];
  }
}

export function saveCustomerFavorites(phone, favorites) {
  localStorage.setItem('arena-demo-favorites:' + (phone ?? 'guest'), JSON.stringify(favorites));
}
