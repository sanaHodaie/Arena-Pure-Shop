let csrf;

export async function request(path, data) {
  const response = await fetch('/api/management/' + path, data ? {
    method: 'POST',
    headers: { 'X-CSRFToken': csrf || '' },
    body: data,
  } : {});
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || 'ارتباط با پنل برقرار نشد. دوباره تلاش کنید.');
    error.fields = payload.errors;
    error.status = response.status;
    throw error;
  }
  if (payload.csrf) csrf = payload.csrf;
  return payload;
}

export function post(path, values) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return request(path, data);
}
