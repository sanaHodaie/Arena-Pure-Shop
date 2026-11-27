export function normalizePhone(value) {
  return value.trim()
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632))
    .replace(/[\s-]/g, '')
    .replace(/^(?:\+98|0098)/, '0');
}

async function accountRequest(endpoint, options) {
  const response = await fetch(`/api/v1/account/${endpoint}/`, {
    cache: 'no-store',
    credentials: 'same-origin',
    ...options,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error(data?.error || 'ارتباط با حساب کاربری برقرار نشد. دوباره تلاش کنید.');
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
