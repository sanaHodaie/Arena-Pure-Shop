import Orders from './components/Orders';
import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import SalesReport from './components/SalesReport';
import CatalogDialog from './components/CatalogDialog';
import LoginModal from './components/LoginModal';
import { Articles, LoginLogs, Reviews } from './components/ContentManagement';
import { Button, Heading, Panel } from './components/ManagementUI';
import { post, request } from './api';
import { errorMessage, type Account, type Catalog, type Product } from './types';

const pendingPages: Record<string, string> = {
  customers: 'مشتریان',
};

export default function App() {
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(() => location.hash.slice(1) || 'dashboard');
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState<number | "new" | "workbook" | null>(null);
  const [error, setError] = useState('');
  const [loginNotice, setLoginNotice] = useState('');
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

  useEffect(() => {
    loadSession();
    const updatePage = () => setPage(location.hash.slice(1) || 'dashboard');
    const onSessionExpired = () => {
      setLoginNotice('نشست مدیریت به پایان رسیده است. دوباره وارد شوید تا همین بخش باز شود.');
      setAccount(null);
      setCatalog(null);
      setDialog(null);
      setError('');
      setNotice('');
    };
    window.addEventListener('hashchange', updatePage);
    window.addEventListener('arena:admin-session-expired', onSessionExpired);
    return () => {
      window.removeEventListener('hashchange', updatePage);
      window.removeEventListener('arena:admin-session-expired', onSessionExpired);
    };
  }, []);

  function navigate(target: string) {
    setPage(target);
    location.hash = target;
  }
  useEffect(() => { if (account?.can_view) loadCatalog(); }, [account]);

  async function logout() {
    setError('');
    try {
      await post('session/', { action: 'logout' });
      setAccount(null);
      setCatalog(null);
      navigate('dashboard');
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

  function toggleTheme() {
    setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  }

  if (!ready) return (
    <main className="grid min-h-screen place-content-center gap-2 text-center">
      <p role="status">{error || 'در حال بررسی حساب مدیریت…'}</p>
      {error && <button className="font-bold text-plum-600" onClick={loadSession}>تلاش دوباره</button>}
    </main>
  );
  if (!account) return <LoginModal isOpen initialError={loginNotice} onLoginSuccess={(user) => { setLoginNotice(''); setAccount(user); }} themeMode={theme} onToggleTheme={toggleTheme} />;

  const openNew = account.can_add ? () => setDialog('new') : undefined;
  return (
    <Layout activePage={page} onNavigate={navigate} currentUser={account} onLogout={logout}
      products={catalog?.products || []} can={() => account.can_view}
      onSearch={(value: string) => { setSearch(value); navigate('products'); }}
      onToggleTheme={toggleTheme}>
      {error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">{notice}</p>}
      {page === 'orders' && <Orders/>}
      {pendingPages[page] && <section className="glass-panel p-6"><h1 className="text-xl font-black">{pendingPages[page]}</h1><p className="mt-2 text-sm text-pearl-500 dark:text-pearl-400">این بخش هنوز به داده‌های فروشگاه متصل نشده است.</p></section>}
      {page === 'articles' && account.articles && <Articles account={account} />}
      {page === 'reviews' && account.reviews && <Reviews account={account} />}
      {page === 'login-logs' && account.loginLogs && <LoginLogs />}
      {page === 'account' && <Panel className="max-w-md space-y-3">
        <Heading title="حساب مدیریت" subtitle={account.role} />
        <p>{account.name} <span className="text-pearl-500" dir="ltr">@{account.username}</span></p>
        <Button secondary onClick={logout}>خروج از حساب</Button>
      </Panel>}
      {page === 'sales' && account.salesReports && <SalesReport />}
      {['dashboard', 'products'].includes(page) && !catalog && <div className="glass-panel p-6">
        {account.can_view
          ? error ? <button onClick={() => { setError(''); loadCatalog(); }}>تلاش دوباره</button> : <p role="status">در حال دریافت محصولات…</p>
          : <p>دسترسی مشاهدهٔ کاتالوگ برای این حساب فعال نیست.</p>}
        {openNew && <button className="mt-3 text-sm font-bold text-plum-600" onClick={openNew}>افزودن محصول</button>}
      </div>}
      {catalog && page === 'dashboard' && <Dashboard {...catalog} name={account.name} onProducts={() => navigate('products')} onRefresh={loadCatalog} />}
      {catalog && page === 'products' && <Products {...catalog} account={account} search={search} onSearch={setSearch}
        onEdit={setDialog} onUpload={() => setDialog('workbook')} onAction={productAction} busy={busy} />}
      {!['dashboard', 'products', 'account', ...(account.salesReports ? ['sales'] : []), ...(account.articles ? ['articles'] : []), ...(account.reviews ? ['reviews'] : []), ...(account.loginLogs ? ['login-logs'] : []), ...Object.keys(pendingPages)].includes(page) &&
        <Button secondary onClick={() => navigate('dashboard')}>بازگشت به داشبورد</Button>}
      {dialog !== null && <CatalogDialog key={dialog} item={dialog} onClose={() => setDialog(null)} onSaved={(message: string) => {
        setDialog(null);
        setError('');
        setNotice(message);
        if (account.can_view) { navigate('products'); loadCatalog(); }
      }} />}
    </Layout>
  );
}
