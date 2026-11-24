import React from 'react';
import { ArrowRightLeft, X } from 'lucide-react';
import ProductImage from './ProductImage.jsx';
import './CompareControls.css';

export function CompareButton({ product, comparison }) {
  const selected = comparison.products.some(item => item.id === product.id);
  return (
    <button type="button" className="product-compare-button" aria-pressed={selected}
      aria-label={`افزودن به مقایسه: ${product.title}`} onClick={() => comparison.toggle(product)}>
      <ArrowRightLeft size={16} aria-hidden="true" /> {selected ? 'در مقایسه' : 'افزودن به مقایسه'}
    </button>
  );
}

export function CompareTray({ comparison, onProductPage }) {
  const { products, toggle, open, clear } = comparison;
  if (!products.length) return null;
  return (
    <aside className={`compare-tray${onProductPage ? ' compare-tray--product' : ''}`} dir="rtl" aria-label="محصولات انتخاب‌شده برای مقایسه">
      <div className="compare-tray-items">
        {products.map(product => (
          <button key={product.id} type="button" onClick={() => toggle(product)}
            title={product.title} aria-label={`حذف ${product.title} از مقایسه`}>
            <ProductImage src={product.image} alt="" /><X size={12} aria-hidden="true" />
          </button>
        ))}
      </div>
      <p aria-live="polite">{products.length === 1 ? 'یک محصول هم‌دستهٔ دیگر انتخاب کن' : `${products.length.toLocaleString('fa-IR')} محصول برای مقایسه`}</p>
      <div className="compare-tray-actions">
        <button type="button" className="account-primary" disabled={products.length < 2} onClick={open}>مقایسه</button>
        <button type="button" className="compare-tray-clear" onClick={clear}>پاک کردن</button>
      </div>
    </aside>
  );
}
