import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadStorefrontCatalog } from './data/catalogApi.js';
import './index.css';
import './brand.css';
import './theme.css';

const root = createRoot(document.getElementById('root'));
const apiBase = import.meta.env.VITE_API_BASE_URL?.trim();

function CatalogStatus({ failed = false }) {
  return <main className="arena-container pd-not-found" dir="rtl" role={failed ? 'alert' : 'status'}>
    <h1>{failed ? 'کاتالوگ در دسترس نیست' : 'در حال بارگیری کاتالوگ…'}</h1>
    {failed && <button type="button" className="account-secondary" onClick={startStorefront}>تلاش دوباره</button>}
  </main>;
}

async function startStorefront() {
  if (apiBase) {
    root.render(<CatalogStatus />);
    try {
      await loadStorefrontCatalog(apiBase, AbortSignal.timeout(60_000));
    } catch {
      root.render(<CatalogStatus failed />);
      return;
    }
  }
  const { default: App } = await import('./App.jsx');
  root.render(<React.StrictMode><App /></React.StrictMode>);
}

startStorefront();
