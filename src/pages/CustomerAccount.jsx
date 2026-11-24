import React, { useEffect, useState } from 'react';
import { LayoutDashboard, LogOut, MapPin, ListFilter, Package, ShoppingBag, Sparkles } from 'lucide-react';
import SelectMenu from '../components/SelectMenu.jsx';
import RoutineSchedules from '../components/RoutineSchedules.jsx';
import { readCustomerRoutine } from '../data/skincareRoutine.js';
import { formatPrice } from '../data/mockData.js';
import {
  orderStatuses, readCustomerOrders, readCustomerProfile, resolveCustomerOrder, saveCustomerProfile,
} from '../data/customerAccount.js';
import './CustomerAccount.css';

const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long', timeZone: 'Asia/Tehran' });
const sections = [
  ['account-overview', 'نمای کلی', LayoutDashboard],
  ['account-orders', 'تاریخچه سفارش‌ها', Package],
  ['account-profile', 'مشخصات و آدرس', MapPin],
  ['account-routine', 'روتین من', Sparkles],
];

const orderFilters = [
  { value: 'all', label: 'همه سفارش‌ها' },
  ...Object.entries(orderStatuses).map(([value, label]) => ({ value, label })),
];

const fields = [
  ['firstName', 'نام', 'given-name'],
  ['lastName', 'نام خانوادگی', 'family-name'],
  ['email', 'ایمیل (اختیاری)', 'email'],
  ['province', 'استان', 'address-level1'],
  ['city', 'شهر', 'address-level2'],
  ['postalCode', 'کد پستی', 'postal-code'],
  ['address', 'نشانی کامل، پلاک و واحد', 'street-address'],
];

export default function CustomerAccount({ phone, favoriteCount, onLogin, onLogout, orderVersion, activePanel, onSelectPanel, onAddRoutineToCart }) {
  const selectedPanel = sections.some(([id]) => id === activePanel) ? activePanel : sections[0][0];
  const [savedRoutine, setSavedRoutine] = useState(null);
  const [routineError, setRoutineError] = useState(false);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({});
  const [savedFirstName, setSavedFirstName] = useState('');
  const [filter, setFilter] = useState('all');
  const [orderPending, setOrderPending] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [profileMessage, setProfileMessage] = useState(null);

  useEffect(() => {
    if (!phone) return;
    function refresh() {
      try { setOrders(readCustomerOrders(phone)); }
      catch { setOrderError('خواندن تاریخچه سفارش‌ها ممکن نیست.'); }
    }
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [phone, orderVersion]);

  useEffect(() => {
    if (!phone) return;
    try { setSavedRoutine(readCustomerRoutine(phone)); }
    catch { setRoutineError(true); }
    try {
      const saved = readCustomerProfile(phone);
      setProfile(saved);
      setSavedFirstName(saved.firstName?.trim() || '');
    }
    catch { setProfileMessage({ error: true, text: 'خواندن مشخصات ذخیره‌شده ممکن نیست.' }); }
  }, [phone]);

  async function setStatus(id, status) {
    setOrderError('');
    setOrderPending(true);
    try {
      await resolveCustomerOrder(phone, id, status);
      setOrders(readCustomerOrders(phone));
    } catch {
      setOrderError('به‌روزرسانی وضعیت سفارش ممکن نیست.');
    } finally {
      setOrderPending(false);
    }
  }

  function saveProfile(event) {
    event.preventDefault();
    const values = Object.fromEntries(fields.map(([name]) => [name, profile[name]?.trim() || '']));
    if (fields.some(([name]) => name !== 'email' && !values[name])) {
      setProfileMessage({ error: true, text: 'همهٔ مشخصات و نشانی را کامل کنید.' });
      return;
    }
    try {
      saveCustomerProfile(phone, values);
      setProfile(values);
      setSavedFirstName(values.firstName);
      setProfileMessage({ text: 'مشخصات و آدرس ذخیره شد.' });
    } catch {
      setProfileMessage({ error: true, text: 'ذخیرهٔ مشخصات در این مرورگر ممکن نیست.' });
    }
  }

  if (!phone) return (
    <main className="arena-container customer-account flex-1" dir="rtl">
      <h1 id="customer-account-title" tabIndex={-1}>خوش آمدید</h1>
      <p>برای مشاهدهٔ سفارش‌ها و مشخصات خود وارد شوید.</p>
      <button type="button" className="account-primary" onClick={onLogin}>ورود یا ثبت‌نام</button>
    </main>
  );

  const greetingName = /[اآو]$/.test(savedFirstName) ? savedFirstName + 'ی' : savedFirstName;
  const visibleOrders = orders.filter(order => filter === 'all' || order.status === filter);

  return (
    <main className="arena-container customer-dashboard flex-1" dir="rtl">
      <header className="customer-hero">
        <div>
          <h1 id="customer-account-title" tabIndex={-1}>
            {greetingName ? `${greetingName} عزیز، خوش آمدید` : 'خوش آمدید'}
          </h1>
          <p>حساب آرنا پیور · <bdi>{phone}</bdi></p>
        </div>
        <button type="button" className="account-secondary" onClick={onLogout}><LogOut size={18}/> خروج از حساب</button>
      </header>

      <div className="customer-grid">
        <div className="customer-menu" role="tablist" aria-label="بخش‌های حساب" onKeyDown={event => {
          const index = sections.findIndex(([id]) => id === selectedPanel);
          const offsets = { ArrowDown: 1, ArrowUp: -1, ArrowLeft: 1, ArrowRight: -1 };
          if (!Object.hasOwn(offsets, event.key) && event.key !== 'Home' && event.key !== 'End') return;
          event.preventDefault();
          const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? sections.length - 1
            : (index + offsets[event.key] + sections.length) % sections.length;
          const [id] = sections[nextIndex];
          onSelectPanel(id);
          document.getElementById(`${id}-tab`).focus();
        }}>
          {sections.map(([id, label, Icon]) => (
            <button type="button" key={id} role="tab" id={`${id}-tab`} aria-controls={id}
              aria-selected={selectedPanel === id} tabIndex={selectedPanel === id ? 0 : -1}
              onClick={() => onSelectPanel(id)}><Icon size={18} aria-hidden="true" />{label}</button>
          ))}
        </div>

        <div className="customer-content">
          <section id="account-overview" className="customer-card" role="tabpanel" aria-labelledby="account-overview-tab" hidden={selectedPanel !== 'account-overview'}>
            <h2>نمای کلی</h2>
            <div className="customer-stats">
              <a href="/account#account-orders"><strong>{formatPrice(orders.length)}</strong> همه سفارش‌ها</a>
              <a href="/account#account-orders"><strong>{formatPrice(orders.filter(order => order.status === 'successful').length)}</strong> سفارش موفق</a>
              <a href="/wishlist"><strong>{formatPrice(favoriteCount)}</strong> علاقه‌مندی‌ها</a>
            </div>
          </section>

          <section id="account-orders" className="customer-card" role="tabpanel" aria-labelledby="account-orders-tab" hidden={selectedPanel !== 'account-orders'}>
            <div className="customer-section-head">
              <h2>تاریخچه سفارش‌ها</h2>
              <SelectMenu value={filter} onChange={setFilter} options={orderFilters} label="وضعیت سفارش" Icon={ListFilter} />
            </div>
            {orderError && <p className="account-error" role="alert">{orderError}</p>}
            {!visibleOrders.length && <p className="customer-empty">{orders.length ? 'سفارشی با این وضعیت وجود ندارد.' : 'هنوز سفارشی ثبت نکرده‌اید.'}</p>}
            {visibleOrders.map(order => (
              <details key={order.id} className="customer-order" open={order.status === 'pending' || undefined}>
                <summary>
                  <span>سفارش <bdi>{order.id.toLocaleString('fa-IR', { useGrouping: false })}</bdi></span>
                  <time dateTime={order.createdAt}>{dateFormat.format(new Date(order.createdAt))}</time>
                  <span className={`customer-status customer-status--${order.status}`}>{orderStatuses[order.status]}</span>
                  <strong>{formatPrice(order.total)} تومان</strong>
                </summary>
                <ul>{order.items.map(item => (
                  <li key={item.id}>{item.title} × {formatPrice(item.quantity)} <span>{formatPrice(item.price * item.quantity)} تومان</span></li>
                ))}</ul>
                <p>هزینه ارسال: {order.shipping ? `${formatPrice(order.shipping)} تومان` : 'رایگان'}</p>
                {order.status === 'pending' && <div className="customer-payment">
                  <p>پرداخت آزمایشی است و مبلغی دریافت نمی‌شود.</p>
                  <div>
                    <button disabled={orderPending} onClick={() => setStatus(order.id, 'successful')}>پرداخت موفق</button>
                    <button disabled={orderPending} onClick={() => setStatus(order.id, 'failed')}>پرداخت ناموفق</button>
                    <button disabled={orderPending} onClick={() => setStatus(order.id, 'cancelled')}>لغو سفارش</button>
                  </div>
                </div>}
              </details>
            ))}
          </section>

          <section id="account-profile" className="customer-card" role="tabpanel" aria-labelledby="account-profile-tab" hidden={selectedPanel !== 'account-profile'}>
            <h2>مشخصات و آدرس تحویل</h2>
            <p className="customer-empty">این اطلاعات آزمایشی در همین مرورگر ذخیره می‌شوند.</p>
            <form className="customer-profile" onSubmit={saveProfile}>
              <label>شماره موبایل<input value={phone} dir="ltr" readOnly /></label>
              {fields.map(([name, label, autoComplete]) => {
                const Input = name === 'address' ? 'textarea' : 'input';
                return <label key={name} className={name === 'address' ? 'customer-address' : undefined}>
                  {label}
                  <Input
                    autoComplete={autoComplete}
                    type={name === 'email' ? 'email' : undefined}
                    inputMode={name === 'postalCode' ? 'numeric' : undefined}
                    dir={name === 'email' || name === 'postalCode' ? 'ltr' : undefined}
                    pattern={name === 'postalCode' ? '[0-9۰-۹٠-٩]{10}' : undefined}
                    title={name === 'postalCode' ? 'کد پستی ۱۰ رقمی' : undefined}
                    maxLength={name === 'address' ? 300 : 100}
                    required={name !== 'email'}
                    value={profile[name] || ''}
                    onChange={event => { setProfileMessage(null); setProfile({ ...profile, [name]: event.target.value }); }}
                  />
                </label>;
              })}
              <button type="submit" className="account-primary">ذخیره مشخصات</button>
              {profileMessage && <p className={profileMessage.error ? 'account-error' : 'account-notice'} role={profileMessage.error ? 'alert' : 'status'}>{profileMessage.text}</p>}
            </form>
          </section>

          <section id="account-routine" className="customer-card" role="tabpanel" aria-labelledby="account-routine-tab" hidden={selectedPanel !== 'account-routine'}>
            <div className="customer-section-head">
              <h2>روتین من</h2>
              <a className="customer-routine-link" href="/skincare-routine">{savedRoutine ? 'ساخت روتین جدید' : 'رفتن به روتین‌ساز'}</a>
            </div>
            {routineError && <p className="account-error" role="alert">خواندن روتین ذخیره‌شده ممکن نیست.</p>}
            {!routineError && !savedRoutine && <p className="customer-empty">هنوز روتینی ذخیره نکرده‌اید.</p>}
            {savedRoutine && (
              <>
                <p className="customer-empty">جمع محصولات بدون تکرار {formatPrice(savedRoutine.total)} تومان</p>
                <div className="routine-actions">
                  <button type="button" className="account-primary" onClick={() => onAddRoutineToCart(savedRoutine)}><ShoppingBag size={17} aria-hidden="true" /> افزودن کل روتین به سبد</button>
                </div>
                <RoutineSchedules routine={savedRoutine} />
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
