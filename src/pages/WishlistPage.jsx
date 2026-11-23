import React from 'react';
import { Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { formatPrice } from '../data/mockData.js';
import './WishlistPage.css';

export default function WishlistPage({ products, wishlist, onToggleWishlist, onAddToCart }) {
  return (
    <main className="arena-container wishlist-page flex-1" dir="rtl">
      <header className="wishlist-page-header">
        <div>
          <h1 id="wishlist-title" tabIndex={-1}>علاقه‌مندی‌ها</h1>
          <p aria-live="polite">{formatPrice(products.length)} محصول ذخیره‌شده</p>
        </div>
        <a className="arena-header-shop wishlist-back" href="/">بازگشت به فروشگاه</a>
      </header>

      {products.length ? (
        <div className="beauty-product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} wishlist={wishlist}
              onToggleWishlist={onToggleWishlist} onAddToCart={onAddToCart} />
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
