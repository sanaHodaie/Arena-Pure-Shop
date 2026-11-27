import React from 'react';
import { ArrowLeft, House, RefreshCw } from 'lucide-react';
import './StorefrontError.css';

const messages = {
  page: ['صفحه پیدا نشد', 'ممکن است نشانی تغییر کرده باشد. از صفحهٔ اصلی یا دسته‌بندی‌ها می‌توانید دوباره مسیرتان را پیدا کنید.'],
  product: ['این محصول پیدا نشد', 'ممکن است محصول از ویترین برداشته شده باشد. می‌توانید محصولات دیگر را در دسته‌بندی‌ها ببینید.'],
  article: ['این مطلب پیدا نشد', 'ممکن است مطلب جابه‌جا یا از دسترس خارج شده باشد. مطالب دیگر آرنا پیور را ببینید.'],
  unavailable: ['دریافت اطلاعات ممکن نشد', 'ارتباط با فروشگاه موقتاً برقرار نشد. می‌توانید دوباره تلاش کنید یا به صفحهٔ اصلی برگردید.'],
};

export default function StorefrontError({ kind = 'page' }) {
  const [title, description] = messages[kind];
  const unavailable = kind === 'unavailable';
  return (
    <main className="arena-container storefront-error" dir="rtl" aria-labelledby="storefront-error-title">
      <div className="storefront-error-card">
        <div className="storefront-error-copy">
          {!unavailable && <span className="storefront-error-code" aria-hidden="true">۴۰۴</span>}
          <h1 id="storefront-error-title" tabIndex={-1}>{title}</h1>
          <p>{description}</p>
          <div className="storefront-error-actions">
            {unavailable ? (
              <button className="storefront-error-primary" type="button" onClick={() => window.location.reload()}>
                <RefreshCw size={17} aria-hidden="true" /> تلاش دوباره
              </button>
            ) : (
              <a className="storefront-error-primary" href="/">
                <House size={17} aria-hidden="true" /> صفحهٔ اصلی
              </a>
            )}
            <a className="storefront-error-secondary" href={unavailable ? '/' : kind === 'article' ? '/#blog' : '/#categories'}>
              {unavailable ? 'صفحهٔ اصلی' : kind === 'article' ? 'خواندنی‌ها' : 'دسته‌بندی محصولات'}
              <ArrowLeft size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="storefront-error-visual">
          <img src="/images/errors/arena-beauty.webp" alt="" width="720" height="900" decoding="async" />
        </div>
      </div>
    </main>
  );
}

export class StorefrontErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <StorefrontError kind="unavailable" /> : this.props.children;
  }
}
