import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, SprayCan } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { findFragrances, fragranceOccasions, scentFamilies } from '../data/fragranceFinder.js';
import './FragranceFinderPage.css';

export default function FragranceFinderPage({ onAddToCart, onToggleWishlist, wishlist, comparison }) {
  const [family, setFamily] = useState('');
  const [occasion, setOccasion] = useState('');
  const [budget, setBudget] = useState('Infinity');
  const [matches, setMatches] = useState(null);
  const results = useRef(null);

  useEffect(() => {
    if (!matches) return;
    results.current.focus({ preventScroll: true });
    results.current.scrollIntoView({ block: 'start' });
  }, [matches]);

  return (
    <main className="arena-container fragrance-finder flex-1" dir="rtl">
      <header className="finder-hero">
        <img src="/images/banners/slide-fragrance-desktop.webp" alt="" />
        <div>
          <h1 id="fragrance-finder-title" tabIndex={-1}>عطر مناسبم رو پیدا کن</h1>
          <p>با سلیقهٔ بویایی، موقعیت استفاده و بودجه‌ات، عطرهای مناسب را از کاتالوگ آرنا پیور پیدا کن.</p>
        </div>
      </header>
      <form className="finder-form" onSubmit={event => {
        event.preventDefault();
        setMatches(findFragrances(family, occasion, Number(budget)));
      }}>
        <label>خانوادهٔ بویایی
          <select value={family} onChange={event => { setFamily(event.target.value); setMatches(null); }}>
            <option value="">هر رایحه‌ای</option>
            {scentFamilies.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label>موقعیت استفاده
          <select value={occasion} onChange={event => { setOccasion(event.target.value); setMatches(null); }}>
            <option value="">هر موقعیتی</option>
            {fragranceOccasions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label>سقف بودجه
          <select value={budget} onChange={event => { setBudget(event.target.value); setMatches(null); }}>
            <option value="Infinity">بدون سقف</option>
            <option value="6500000">تا ۶٫۵ میلیون تومان</option>
            <option value="6800000">تا ۶٫۸ میلیون تومان</option>
            <option value="7000000">تا ۷ میلیون تومان</option>
          </select>
        </label>
        <button type="submit" className="account-primary">دیدن پیشنهادها <ArrowLeft size={17} aria-hidden="true" /></button>
      </form>

      {matches && (
        <section className="finder-results" ref={results} tabIndex={-1} aria-labelledby="finder-results-title">
          <h2 id="finder-results-title"><SprayCan size={20} aria-hidden="true" /> پیشنهادهای عطریاب</h2>
          {matches.length ? (
            <div className="finder-grid">
              {matches.map(({ product, reason }) => (
                <div className="finder-match" key={product.id}>
                  <ProductCard product={product} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist}
                    wishlist={wishlist} comparison={comparison} />
                  <p>{reason}</p>
                </div>
              ))}
            </div>
          ) : <p className="finder-empty" role="status">با این ترکیب، عطری در بودجه و موجودی فعلی پیدا نشد. یکی از گزینه‌ها یا سقف بودجه را تغییر بده.</p>}
        </section>
      )}
      <a className="category-back" href="/categories/fragrance">همهٔ عطرها <ArrowLeft size={16} aria-hidden="true" /></a>
    </main>
  );
}
