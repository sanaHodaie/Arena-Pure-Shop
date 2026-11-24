import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, SprayCan } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { findFragrances, fragranceOccasions, scentFamilies } from '../data/fragranceFinder.js';
import './SkincareRoutinePage.css';
import './FragranceFinderPage.css';

const budgets = [
  ['Infinity', 'بدون سقف'],
  ['6500000', 'تا ۶٫۵ میلیون'],
  ['6800000', 'تا ۶٫۸ میلیون'],
  ['7000000', 'تا ۷ میلیون'],
];

function FinderOptions({ name, title, value, options, onChange }) {
  return (
    <fieldset>
      <legend>{title}</legend>
      <div className="routine-options">
        {options.map(([id, label]) => (
          <label key={id}>
            <input type="radio" name={name} value={id} checked={value === id} onChange={() => onChange(id)} />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

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
        <img src="/images/banners/category-fragrance-v2.png" alt="" width="1536" height="1024" fetchPriority="high" />
        <div>
          <h1 id="fragrance-finder-title" tabIndex={-1}>عطر مناسبم رو پیدا کن</h1>
          <p>با سلیقهٔ بویایی، موقعیت استفاده و بودجه‌ات، عطرهای مناسب را از کاتالوگ آرنا پیور پیدا کن.</p>
        </div>
      </header>
      <form className="routine-form finder-form" onSubmit={event => {
        event.preventDefault();
        setMatches(findFragrances(family, occasion, Number(budget)));
      }}>
        <FinderOptions name="finder-family" title="۱. چه رایحه‌ای دوست داری؟" value={family}
          options={[['', 'هر رایحه‌ای'], ...scentFamilies]}
          onChange={value => { setFamily(value); setMatches(null); }} />
        <FinderOptions name="finder-occasion" title="۲. برای چه موقعیتی عطر می‌خوای؟" value={occasion}
          options={[['', 'هر موقعیتی'], ...fragranceOccasions]}
          onChange={value => { setOccasion(value); setMatches(null); }} />
        <FinderOptions name="finder-budget" title={<>۳. سقف بودجه‌ات چقدره؟ <small>تومان</small></>}
          value={budget} options={budgets} onChange={value => { setBudget(value); setMatches(null); }} />
        <button type="submit" className="account-primary routine-submit">دیدن پیشنهادها <ArrowLeft size={17} aria-hidden="true" /></button>
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
