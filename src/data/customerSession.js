export function normalizePhone(value) {
  return value.trim()
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632))
    .replace(/[\s-]/g, '')
    .replace(/^(?:\+98|0098)/, '0');
}

function accountError(status) {
  if (status === 404) return 'مسیر حساب روی بک‌اند پیدا نشد. نسخهٔ Render را بررسی کنید.';
  if (status === 403) return 'درخواست حساب تأیید نشد. صفحه را تازه کنید و دوباره تلاش کنید.';
  if (status >= 500) return `سرویس حساب در دسترس نیست (خطای ${status}). کمی بعد دوباره تلاش کنید.`;
  return 'اتصال به حساب کاربری کامل نشد. دوباره تلاش کنید.';
}

async function accountRequest(endpoint, options) {
  const path = import.meta.env.PROD
    ? '/api/customer-account?' + new URLSearchParams({ endpoint })
    : `/api/v1/account/${endpoint}/`;
  let response;
  try {
    response = await fetch(path, {
      cache: 'no-store',
      credentials: 'same-origin',
      ...options,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('ارتباط شبکه با سرویس حساب برقرار نشد. دوباره تلاش کنید.');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || accountError(response.status));
  if (!data || typeof data !== 'object') {
    throw new Error('مسیر حساب پاسخ API دریافت نکرد. اتصال Vercel به Render را بررسی کنید.');
  }
  return data;
}

export function getCustomerSession(signal) {
  return accountRequest('session', { signal });
}

async function writeAccount(endpoint, fields, signal) {
  const { csrf } = await getCustomerSession(signal);
  if (!csrf) throw new Error('بررسی نشست انجام نشد. دوباره تلاش کنید.');
  return accountRequest(endpoint, {
    method: 'POST', body: new URLSearchParams(fields), signal, headers: { 'X-CSRFToken': csrf },
  });
}

export const registerCustomer = (phone, password, signal) => writeAccount('session', { action: 'register', phone, password }, signal);
export const loginCustomer = (phone, password, signal) => writeAccount('session', { action: 'login', phone, password }, signal);
export const logoutCustomer = () => writeAccount('session', { action: 'logout' });
export const getCustomerProfile = (signal) => accountRequest('profile', { signal });
export const saveCustomerProfile = (fields, signal) => writeAccount('profile', fields, signal);

export const getOrders = () => accountRequest('orders', {});
export const writeOrder = payload => writeAccount('orders', {payload:JSON.stringify(payload)});
