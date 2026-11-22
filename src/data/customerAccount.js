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

function readOrders() {
  return JSON.parse(localStorage.getItem(ordersKey) || '[]');
}

export function readCustomerOrders(phone) {
  return readOrders().filter(order => order.phone === phone).reverse();
}

function updateOrders(update) {
  const save = () => {
    const orders = readOrders();
    const result = update(orders);
    localStorage.setItem(ordersKey, JSON.stringify(orders));
    return result;
  };
  return navigator.locks ? navigator.locks.request(ordersKey, save) : save();
}

export async function createCustomerOrder(phone, cart) {
  return updateOrders(orders => {
    const used = new Set(orders.map(order => order.id));
    let id = 1000;
    while (used.has(id)) id++;
    if (id > 9999) throw new Error('order-id-capacity');
    const items = cart.map(({ id, title, price, quantity }) => ({ id, title, price, quantity }));
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const shipping = shippingCost(subtotal);
    orders.push({
      id, phone, items, subtotal, shipping, total: subtotal + shipping,
      status: 'pending', createdAt: new Date().toISOString(),
    });
    return id;
  });
}

export async function resolveCustomerOrder(phone, id, status) {
  if (!['successful', 'failed', 'cancelled'].includes(status)) return;
  await updateOrders(orders => {
    const order = orders.find(item => item.phone === phone && item.id === id);
    if (order?.status === 'pending') order.status = status;
  });
}

export function readCustomerProfile(phone) {
  return JSON.parse(localStorage.getItem('arena-demo-profile:' + phone) || '{}');
}

export function saveCustomerProfile(phone, profile) {
  localStorage.setItem('arena-demo-profile:' + phone, JSON.stringify(profile));
}

export function readCustomerFavorites(phone) {
  try {
    return JSON.parse(localStorage.getItem('arena-demo-favorites:' + phone)) || [];
  } catch {
    return [];
  }
}

export function saveCustomerFavorites(phone, favorites) {
  localStorage.setItem('arena-demo-favorites:' + phone, JSON.stringify(favorites));
}
