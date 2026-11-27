let csrf;

function connectionMessage(status) {
  if (status === 404) return 'مسیر API پیدا نشد. نسخهٔ بک‌اند و تنظیمات اتصال پنل را بررسی کنید.';
  if (status >= 500) return `بک‌اند پاسخ معتبر نداد (خطای ${status}). لاگ Django یا Render را بررسی کنید.`;
  return `درخواست پنل انجام نشد (خطای ${status}). دوباره تلاش کنید.`;
}

function send(path, data) {
  const target = import.meta.env.PROD
    ? '/api/admin-panel?' + new URLSearchParams({ path })
    : '/api/management/' + path;
  return fetch(target, {
    credentials: 'same-origin',
    cache: 'no-store',
    ...(data && {
    method: 'POST',
    headers: { 'X-CSRFToken': csrf || '' },
    body: data,
    }),
  });
}

let sessionCheck;

function verifySession() {
  sessionCheck ??= send('session/').then(async (response) => {
    if (!response.ok) throw new Error(connectionMessage(response.status));
    const data = await response.json();
    if (!('account' in data) || !data.csrf) throw new Error('پاسخ بررسی نشست معتبر نیست.');
    csrf = data.csrf;
    if (!data.account) window.dispatchEvent(new Event('arena:admin-session-expired'));
    return Boolean(data.account);
  }).finally(() => { sessionCheck = undefined; });
  return sessionCheck;
}

export async function request(path, data) {
  let response = await send(path, data);
  if (response.status === 401 && path !== 'session/') {
    if (await verifySession()) {
      // Retry reads only. The user can explicitly retry writes after checking their session.
      if (!data) response = await send(path);
      if (response.status === 401) {
        throw new Error('نشست مدیر فعال است، اما این مسیر آن را دریافت نمی‌کند. تنظیمات اتصال پنل به بک‌اند را بررسی کنید.');
      }
    }
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(payload?.error || connectionMessage(response.status));
    error.fields = payload?.errors;
    error.status = response.status;
    throw error;
  }
  if (!payload || typeof payload !== 'object') {
    throw new Error('به‌جای پاسخ API، پاسخ دیگری دریافت شد. مسیر اتصال پنل به Django را بررسی کنید.');
  }
  if (payload.csrf) csrf = payload.csrf;
  return payload;
}

export function post(path, values) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return request(path, data);
}
