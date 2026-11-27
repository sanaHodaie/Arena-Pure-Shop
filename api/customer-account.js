const upstreamOrigin = 'https://arena-pure-catalog.onrender.com';
const endpoints = new Set(['session', 'profile']);

export default async function customerAccount(request, response) {
  response.setHeader('Cache-Control', 'private, no-store');
  const endpoint = new URL(request.url, 'http://localhost').searchParams.get('endpoint');
  if (!endpoints.has(endpoint)) {
    return response.status(404).json({ error: 'مسیر حساب پیدا نشد.' });
  }
  if (!['GET', 'POST'].includes(request.method)) {
    response.setHeader('Allow', 'GET, POST');
    return response.status(405).json({ error: 'روش درخواست معتبر نیست.' });
  }

  const headers = new Headers({ Accept: 'application/json' });
  for (const name of ['origin', 'referer', 'x-csrftoken']) {
    const value = request.headers[name];
    if (typeof value === 'string') headers.set(name, value);
  }

  const cookiesForDjango = request.headers.cookie?.split(';').map(cookie => cookie.trim())
    .filter(cookie => /^(?:sessionid|csrftoken)=/.test(cookie));
  if (cookiesForDjango?.length) headers.set('Cookie', cookiesForDjango.join('; '));

  let body;
  if (request.method === 'POST') {
    const type = request.headers['content-type']?.split(';')[0];
    if (type !== 'application/x-www-form-urlencoded') {
      return response.status(415).json({ error: 'فرمت درخواست حساب معتبر نیست.' });
    }
    const parsed = request.body;
    if (typeof parsed === 'string' || Buffer.isBuffer(parsed)) body = parsed.toString();
    else if (parsed && typeof parsed === 'object') {
      body = new URLSearchParams(Object.entries(parsed).filter(([, value]) => typeof value === 'string')).toString();
    }
    if (body === undefined || Buffer.byteLength(body) > 4096) {
      return response.status(400).json({ error: 'اطلاعات حساب معتبر نیست.' });
    }
    headers.set('Content-Type', 'application/x-www-form-urlencoded');
  }

  let upstream;
  try {
    upstream = await fetch(`${upstreamOrigin}/api/v1/account/${endpoint}/`, {
      method: request.method, headers, body, redirect: 'manual', signal: AbortSignal.timeout(45_000),
    });
  } catch {
    return response.status(503).json({ error: 'سرویس حساب روی Render پاسخ نمی‌دهد. کمی بعد دوباره تلاش کنید.' });
  }
  if (!upstream.headers.get('content-type')?.includes('application/json')) {
    const error = upstream.status === 404
      ? 'نسخهٔ فعال Render مسیر حساب را ندارد. آخرین دیپلوی بک‌اند را بررسی کنید.'
      : `سرویس حساب روی Render پاسخ معتبر نداد (کد ${upstream.status}).`;
    return response.status(upstream.status === 404 ? 404 : 502).json({ error });
  }
  const data = await upstream.json().catch(() => null);
  if (!data) return response.status(502).json({ error: 'پاسخ سرویس حساب ناقص بود.' });
  const cookies = upstream.headers.getSetCookie();
  if (cookies.length) response.setHeader('Set-Cookie', cookies);
  return response.status(upstream.status).json(data);
}
