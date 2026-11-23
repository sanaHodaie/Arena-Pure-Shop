import React, { useState } from 'react';
import { ArrowRightLeft, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { formatPrice } from '../data/mockData.js';
import WishlistComparison from './WishlistComparison.jsx';
import './WishlistPage.css';

export default function WishlistPage({ products, wishlist, onToggleWishlist, onAddToCart }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const selected = products.filter(product => selectedIds.includes(product.id));
  const category = selected[0]?.category;
  const hasComparableProducts = new Set(products.map(product => product.category)).size < products.length;

  function toggleSelection(id) {
    const ids = selected.map(product => product.id);
    setSelectedIds(ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id]);
  }

  return (
    <main className="arena-container wishlist-page flex-1" dir="rtl">
      <header className="wishlist-page-header">
        <div>
          <h1 id="wishlist-title" tabIndex={-1}>علاقه‌مندی‌ها</h1>
          <p aria-live="polite">{formatPrice(products.length)} محصول ذخیره‌شده</p>
        </div>
        <a className="arena-header-shop wishlist-back" href="/">بازگشت به فروشگاه</a>
      </header>

      {products.length >= 2 && (
        <section className="wishlist-compare-bar" aria-labelledby="wishlist-compare-heading">
          <div>
            <h2 id="wishlist-compare-heading"><ArrowRightLeft size={18} aria-hidden="true" /> مقایسه محصولات</h2>
            <p>{hasComparableProducts ? 'دو یا سه محصول از یک دسته انتخاب کنید.' : 'برای مقایسه، دست‌کم دو محصول از یک دسته ذخیره کنید.'}</p>
          </div>
          {hasComparableProducts && (
            <div className="wishlist-compare-actions">
              <span aria-live="polite">انتخاب‌شده {formatPrice(selected.length)} از ۳</span>
              {selected.length > 0 && <button type="button" className="wishlist-compare-clear" onClick={() => setSelectedIds([])}>پاک کردن انتخاب</button>}
              <button type="button" className="account-primary" disabled={selected.length < 2}
                onClick={() => setShowComparison(true)}>مقایسه</button>
            </div>
          )}
        </section>
      )}

      {products.length ? (
        <div className="beauty-product-grid">
          {products.map(product => (
            <div key={product.id} className="wishlist-product">
              <ProductCard product={product} wishlist={wishlist} onAddToCart={onAddToCart}
                onToggleWishlist={id => {
                  setSelectedIds(ids => ids.filter(item => item !== id));
                  onToggleWishlist(id);
                }} />
              {hasComparableProducts && (
                <label className="wishlist-select">
                  <input type="checkbox" checked={selectedIds.includes(product.id)}
                    disabled={!selectedIds.includes(product.id) &&
                      (selected.length >= 3 || (!!category && category !== product.category) ||
                        !products.some(other => other.id !== product.id && other.category === product.category))}
                    onChange={() => toggleSelection(product.id)} />
                  <span>انتخاب برای مقایسه<span className="sr-only"> {product.title}</span></span>
                </label>
              )}
            </div>
          ))}
        </div>
      ) : (
        <section className="wishlist-empty" aria-labelledby="wishlist-empty-title">
          <Heart size={34} strokeWidth={1.35} aria-hidden="true" />
          <h2 id="wishlist-empty-title">هنوز محصولی ذخیره نکرده‌اید</h2>
          <p>با زدن قلب کنار هر محصول، آن را به این فهرست اضافه کنید.</p>
        </section>
      )}
      {showComparison && selected.length >= 2 && (
        <WishlistComparison products={selected} onClose={() => setShowComparison(false)} />
      )}
    </main>
  );
}
