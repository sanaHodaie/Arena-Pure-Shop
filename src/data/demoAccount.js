const accountsPrefix = 'arena-demo-account:';
const sessionKey = 'arena-demo-session';

export function normalizePhone(value) {
  return value.trim()
    .replace(/[۰-۹]/g, digit => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 1632))
    .replace(/[\s-]/g, '')
    .replace(/^(?:\+98|0098)/, '0');
}

async function passwordVerifier(password, salt) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 600_000 }, key, 256,
  );
  return Array.from(new Uint8Array(bits)).join('.');
}

export async function registerDemoAccount(phone, password) {
  const key = accountsPrefix + phone;
  if (localStorage.getItem(key)) return false;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const verifier = await passwordVerifier(password, salt);
  if (localStorage.getItem(key)) return false;
  localStorage.setItem(key, JSON.stringify({ salt: Array.from(salt), verifier }));
  return true;
}

export async function signInToDemoAccount(phone, password) {
  const account = JSON.parse(localStorage.getItem(accountsPrefix + phone));
  if (!account) return false;
  const verifier = await passwordVerifier(password, Uint8Array.from(account.salt));
  return verifier === account.verifier;
}

export function readDemoSession() {
  try {
    const phone = sessionStorage.getItem(sessionKey);
    return phone && localStorage.getItem(accountsPrefix + phone) ? phone : null;
  } catch {
    return null;
  }
}

export function writeDemoSession(phone) {
  try {
    if (phone) sessionStorage.setItem(sessionKey, phone);
    else sessionStorage.removeItem(sessionKey);
  } catch {
    // The current page can still use its in-memory session.
  }
}
