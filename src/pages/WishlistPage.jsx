import React from 'react';
import { ArrowRightLeft, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { formatPrice } from '../data/mockData.js';
import './WishlistPage.css';

export default function WishlistPage({ products, wishlist, onToggleWishlist, onAddToCart, comparison }) {
  const selected = comparison.products;
  const category = selected[0]?.category;
  const hasComparableProducts = new Set(products.map(product => product.category)).size < products.length;
  const showSelection = hasComparableProducts || selected.length > 0;

  return (
    <main className="arena-container wishlist-page flex-1" dir="rtl">
      <header className="wishlist-page-header">
        <div>
          <h1 id="wishlist-title" tabIndex={-1}>علاقه‌مندی‌ها</h1>
          <p aria-live="polite">{formatPrice(products.length)} محصول ذخیره‌شده</p>
        </div>
        <a className="arena-header-shop wishlist-back" href="/">بازگشت به فروشگاه</a>
      </header>

      {(products.length >= 2 || selected.length > 0) && (
        <section className="wishlist-compare-bar" aria-labelledby="wishlist-compare-heading">
          <div>
            <h2 id="wishlist-compare-heading"><ArrowRightLeft size={18} aria-hidden="true" /> مقایسه محصولات</h2>
            <p>{showSelection ? 'دو یا سه محصول از یک دسته انتخاب کنید.' : 'برای مقایسه، دست‌کم دو محصول از یک دسته ذخیره کنید.'}</p>
          </div>
          {showSelection && (
            <div className="wishlist-compare-actions">
              <span aria-live="polite">انتخاب‌شده {formatPrice(selected.length)} از ۳</span>
              {selected.length > 0 && <button type="button" className="wishlist-compare-clear" onClick={comparison.clear}>پاک کردن انتخاب</button>}
              <button type="button" className="account-primary" disabled={selected.length < 2}
                onClick={comparison.open}>مقایسه</button>
            </div>
          )}
        </section>
      )}

      {products.length ? (
        <div className="beauty-product-grid">
          {products.map(product => (
            <div key={product.id} className="wishlist-product">
              <ProductCard product={product} wishlist={wishlist} onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist} />
              {showSelection && (
                <label className="wishlist-select">
                  <input type="checkbox" checked={selected.some(item => item.id === product.id)}
                    disabled={!selected.some(item => item.id === product.id) &&
                      (selected.length >= 3 || (!!category && category !== product.category) ||
                        !products.concat(selected).some(other => other.id !== product.id && other.category === product.category))}
                    onChange={() => comparison.toggle(product)} />
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
    </main>
  );
}
