let csrf;

function connectionMessage(status) {
  if (status === 404) return 'مسیر API پیدا نشد. نسخهٔ بک‌اند و تنظیمات اتصال پنل را بررسی کنید.';
  if (status >= 500) return `بک‌اند پاسخ معتبر نداد (خطای ${status}). لاگ Django یا Render را بررسی کنید.`;
  return `درخواست پنل انجام نشد (خطای ${status}). دوباره تلاش کنید.`;
}

export async function request(path, data) {
  const response = await fetch('/api/management/' + path, data ? {
    method: 'POST',
    headers: { 'X-CSRFToken': csrf || '' },
    body: data,
  } : {});
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
