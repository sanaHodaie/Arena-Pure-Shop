import test from 'node:test';
import assert from 'node:assert/strict';
import customerAccount from '../api/customer-account.js';

function responseRecorder() {
  return {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.code = code; return this; },
    json(data) { this.data = data; },
  };
}

test('forwards customer form, origin and CSRF and returns both backend cookies', async (context) => {
  const origin = 'https://arena-pure-shop.vercel.app';
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://arena-pure-catalog.onrender.com/api/v1/account/session/');
    assert.equal(options.redirect, 'manual');
    assert.equal(options.headers.get('origin'), origin);
    assert.equal(options.headers.get('x-csrftoken'), 'token');
    assert.equal(options.headers.get('cookie'), 'csrftoken=known');
    assert.equal(new URLSearchParams(options.body).get('action'), 'register');
    return new Response('{"accepted":true}', {
      status: 202, headers: [
        ['Content-Type', 'application/json'],
        ['Set-Cookie', 'csrftoken=a; Secure'],
        ['Set-Cookie', 'sessionid=b; Secure; HttpOnly'],
      ],
    });
  });
  const result = responseRecorder();
  await customerAccount({
    method: 'POST', url: '/api/customer-account?endpoint=session',
    headers: { origin, cookie: 'csrftoken=known; other=private', 'x-csrftoken': 'token', 'content-type': 'application/x-www-form-urlencoded' },
    body: { action: 'register' },
  }, result);
  assert.equal(result.code, 202);
  assert.equal(result.headers['Set-Cookie'].length, 2);
  assert.equal(result.headers['Cache-Control'], 'private, no-store');
});

test('turns an HTML backend response into an actionable JSON error', async (context) => {
  context.mock.method(globalThis, 'fetch', async () => new Response('<html>Not Found</html>', {
    status: 404, headers: { 'Content-Type': 'text/html' },
  }));
  const result = responseRecorder();
  await customerAccount({ method: 'GET', url: '/api/customer-account?endpoint=session', headers: {} }, result);
  assert.equal(result.code, 404);
  assert.match(result.data.error, /Render/);
});
