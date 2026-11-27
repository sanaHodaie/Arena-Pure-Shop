export const config = { api: { bodyParser: false } };
export default async function managementProxy(request, response) {
 response.setHeader('Cache-Control', 'private, no-store');
 const incoming = new URL(request.url, 'https://local.invalid');
 const path = incoming.searchParams.get('path') || '';
 incoming.searchParams.delete('path');
 if (!/^[a-zA-Z0-9_/-]+$/.test(path) || path.includes('..')) return response.status(400).json({error:'Invalid management path'});
 const headers = new Headers({Accept:'application/json'});
 for (const name of ['cookie','origin','referer','x-csrftoken','content-type']) {
  if (typeof request.headers[name] === 'string') headers.set(name, request.headers[name]);
 }
 let upstream;
 try {
  const chunks = []; let size = 0;
  for await (const chunk of request) { size += chunk.length; if(size > 4 * 1024 * 1024) return response.status(413).json({error:'Upload exceeds 4 MB'}); chunks.push(chunk); }
  upstream = await fetch('https://arena-pure-catalog.onrender.com/api/management/' + path + incoming.search, {
   method:request.method, headers, body:['GET','HEAD'].includes(request.method) ? undefined : Buffer.concat(chunks), redirect:'manual', signal:AbortSignal.timeout(45000)
  });
 } catch { return response.status(503).json({error:'Management backend unavailable. Please retry.'}); }
 const cookies = upstream.headers.getSetCookie();
 if(cookies.length) response.setHeader('Set-Cookie',cookies);
 for(const name of ['content-type','content-disposition']) { const value=upstream.headers.get(name); if(value) response.setHeader(name,value); }
 return response.status(upstream.status).send(Buffer.from(await upstream.arrayBuffer()));
}
