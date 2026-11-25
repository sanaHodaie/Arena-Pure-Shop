import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import CatalogDialog, { controlStyle } from './components/CatalogDialog';
import LoginModal from './components/LoginModal';
import { post, request } from './api';
import { errorMessage, type Account, type Catalog, type Product } from './types';

const pendingPages: Record<string, string> = {
  orders: 'سفارش‌ها و فاکتورها',
  messages: 'مرکز پیام‌ها',
  customers: 'مشتریان',
};

export default function App() {
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState('dashboard');
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState<number | "new" | "workbook" | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('arena-admin-theme') || 'auto');

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'auto' && media.matches));
    update();
    localStorage.setItem('arena-admin-theme', theme);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [theme]);

  async function loadSession() {
    setError('');
    try {
      const { account: user } = await request('session/');
      setAccount(user);
      setReady(true);
    } catch (failure) {
      setError(errorMessage(failure));
    }
  }

  async function loadCatalog() {
    try {
      setCatalog(await request('catalog/'));
    } catch (failure) {
      if (failure instanceof Error && 'status' in failure && failure.status === 401) {
        setCatalog(null);
        setDialog(null);
        await loadSession();
      } else {
        setError(errorMessage(failure));
      }
    }
  }

  useEffect(() => { loadSession(); }, []);
  useEffect(() => { if (account?.can_view) loadCatalog(); }, [account]);

  async function logout() {
    setError('');
    try {
      await post('session/', { action: 'logout' });
      setAccount(null);
      setCatalog(null);
      setPage('dashboard');
      setDialog(null);
      setSearch('');
      setNotice('');
    } catch (failure) {
      setError(errorMessage(failure));
    }
  }

  async function productAction(product: Product, action: string) {
    if (action === 'delete' && !window.confirm(`«${product.name}» حذف شود؟`)) return;
    setBusy(true);
    setError('');
    try {
      await post(`products/${product.id}/action/`, { action });
      await loadCatalog();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return (
    <main className="grid min-h-screen place-content-center gap-2 text-center">
      <p role="status">{error || 'در حال بررسی حساب مدیریت…'}</p>
      {error && <button className="font-bold text-purple-600" onClick={loadSession}>تلاش دوباره</button>}
    </main>
  );
  if (!account) return <LoginModal isOpen onLoginSuccess={setAccount} />;

  const openNew = account.can_add ? () => setDialog('new') : undefined;
  return (
    <Layout activePage={page} onNavigate={setPage} currentUser={account} onLogout={logout}
      search={search} onSearch={(value: string) => { setSearch(value); setPage('products'); }}
      themeMode={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light')}>
      {error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">{notice}</p>}
      {pendingPages[page] && <section className="glass-panel p-6"><h1 className="text-xl font-black">{pendingPages[page]}</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">این بخش هنوز به داده‌های فروشگاه متصل نشده است.</p></section>}
      {page === 'settings' && <section className="glass-panel max-w-md space-y-3 p-6"><h1 className="text-xl font-black">تنظیمات نمایش</h1>
        <label htmlFor="theme">تم پنل</label>
        <select id="theme" className={controlStyle} value={theme} onChange={(event) => setTheme(event.target.value)}>
          <option value="auto">مطابق تنظیمات دستگاه</option><option value="light">روشن</option><option value="dark">تاریک</option>
        </select>
      </section>}
      {['dashboard', 'products', 'analytics'].includes(page) && !catalog && <div className="glass-panel p-6">
        {account.can_view
          ? error ? <button onClick={() => { setError(''); loadCatalog(); }}>تلاش دوباره</button> : <p role="status">در حال دریافت محصولات…</p>
          : <p>دسترسی مشاهدهٔ کاتالوگ برای این حساب فعال نیست.</p>}
        {openNew && <button className="mt-3 text-sm font-bold text-purple-600" onClick={openNew}>افزودن محصول</button>}
      </div>}
      {catalog && ['dashboard', 'analytics'].includes(page) && <Dashboard {...catalog} onAdd={openNew} onProducts={() => setPage('products')} />}
      {catalog && page === 'products' && <Products {...catalog} account={account} search={search} onSearch={setSearch}
        onEdit={setDialog} onUpload={() => setDialog('workbook')} onAction={productAction} busy={busy} />}
      {dialog !== null && <CatalogDialog key={dialog} item={dialog} onClose={() => setDialog(null)} onSaved={(message: string) => {
        setDialog(null);
        setError('');
        setNotice(message);
        if (account.can_view) { setPage('products'); loadCatalog(); }
      }} />}
    </Layout>
  );
}
