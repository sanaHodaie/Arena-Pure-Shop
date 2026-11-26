import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { loadStorefrontCatalog, restoreStorefrontCatalog } from './data/catalogApi.js';
import App from './App.jsx';
import './index.css';
import './brand.css';
import './theme.css';

const apiBase = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '');
const hasCachedCatalog = apiBase ? restoreStorefrontCatalog(apiBase) : false;
const renderCatalogOrigin = 'https://arena-pure-catalog.onrender.com';

async function loadCatalog(signal) {
  if (import.meta.env.PROD && apiBase === renderCatalogOrigin) {
    try {
      await loadStorefrontCatalog('/_catalog', signal, apiBase);
      return;
    } catch (error) {
      if (signal.aborted) throw error;
    }
  }
  await loadStorefrontCatalog(`${apiBase}/api/v1/catalog/`, signal, apiBase);
}

function Storefront() {
  const [status, setStatus] = useState(apiBase ? 'loading' : 'standalone');

  useEffect(() => {
    if (!apiBase) return;
    const controller = new AbortController();
    let mounted = true;
    const timeout = setTimeout(() => controller.abort(), 45_000);
    loadCatalog(controller.signal).then(
      () => { if (mounted) setStatus('ready'); },
      () => { if (mounted) setStatus('offline'); },
    ).finally(() => clearTimeout(timeout));
    return () => {
      mounted = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return <>
    {status === 'offline' && (
      <div className="catalog-offline" role="status" dir="rtl">
        <span>{hasCachedCatalog ? 'ارتباط با کاتالوگ قطع است. آخرین نسخهٔ ذخیره‌شده نمایش داده می‌شود.' : 'ارتباط با کاتالوگ زنده قطع است. قیمت و موجودی این نسخه نمایشی است.'}</span>
        <button type="button" onClick={() => window.location.reload()}>تلاش دوباره</button>
      </div>
    )}
    <App hasCachedCatalog={hasCachedCatalog} catalogLoading={status === 'loading'} catalogOffline={status === 'offline'} />
  </>;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode><Storefront /></React.StrictMode>,
);
