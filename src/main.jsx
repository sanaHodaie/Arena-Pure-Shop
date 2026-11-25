import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadStorefrontCatalog } from './data/catalogApi.js';
import './index.css';
import './brand.css';
import './theme.css';

const root = createRoot(document.getElementById('root'));
const apiBase = import.meta.env.VITE_API_BASE_URL?.trim();

const renderCatalogOrigin = 'https://arena-pure-catalog.onrender.com';

async function loadCatalog() {
  const origin = apiBase.replace(/\/+$/, '');
  const signal = AbortSignal.timeout(45_000);
  if (import.meta.env.PROD && origin === renderCatalogOrigin) {
    try {
      await loadStorefrontCatalog('/_catalog', signal);
      return;
    } catch {
      if (signal.aborted) throw signal.reason;
    }
  }
  await loadStorefrontCatalog(`${origin}/api/v1/catalog/`, signal);
}

async function startStorefront() {
  let catalogOffline = false;
  if (apiBase) {
    root.render(<main className="arena-container catalog-placeholder" aria-busy="true">
      <div aria-hidden="true" />
    </main>);
    try {
      await loadCatalog();
    } catch {
      catalogOffline = true;
    }
  }
  const { default: App } = await import('./App.jsx');
  root.render(<React.StrictMode>
    {catalogOffline && (
      <div className="catalog-offline" role="status" dir="rtl">
        <span>ارتباط با کاتالوگ زنده قطع است. قیمت و موجودی این نسخه نمایشی است.</span>
        <button type="button" onClick={() => window.location.reload()}>تلاش دوباره</button>
      </div>
    )}
    <App catalogOffline={catalogOffline} />
  </React.StrictMode>);
}

startStorefront();
