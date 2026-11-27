import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { products } from '../data/catalog.js';
import { filterSearchProducts, normalizeSearch, searchColorOptions, searchProducts } from '../data/productSearch.js';

const defaults = { inStock: false, budget: '', color: '' };
const number = new Intl.NumberFormat('fa-IR');

export default function SearchPage({ query, wishlist, comparison, onAddToCart, onToggleWishlist }) {
  const [filters, setFilters] = useState(defaults);
  const matches = searchProducts(products, query);
  const colors = searchColorOptions(matches);
  const budget = normalizeSearch(filters.budget).replace(/ /g, '');
  const validBudget = !filters.budget.trim() || (/^[0-9۰-۹٠-٩,٬\s]+$/.test(filters.budget) && /^\d{1,12}$/.test(budget));
  const visible = filterSearchProducts(matches, {
    inStock: filters.inStock, maxPrice: validBudget && budget ? Number(budget) : null, color: filters.color,
  });
  const changed = filters.inStock || filters.budget || filters.color;
  const update = (key, value) => setFilters(current => ({ ...current, [key]: value }));

  return <main className="arena-container product-search-page">
    <header className="product-search-heading">
      <span><Search size={18} aria-hidden="true" /> جست‌وجوی فروشگاه</span>
      <h1 id="search-title" tabIndex={-1}>{query ? <>نتایج برای «<bdi>{query}</bdi>»</> : 'همهٔ محصولات'}</h1>
    </header>
    <section className="product-search-filters" aria-label="فیلترهای نتایج">
      <div className="product-search-filter-heading"><SlidersHorizontal size={17} /> فیلترها</div>
      <label className="product-search-stock"><input type="checkbox" checked={filters.inStock}
        onChange={event => update('inStock', event.target.checked)} /> فقط کالاهای موجود</label>
      <label>سقف بودجه (تومان)
        <input type="text" inputMode="numeric" maxLength={16} placeholder="بدون سقف" value={filters.budget}
          aria-invalid={!validBudget} aria-describedby={!validBudget ? 'search-budget-error' : undefined}
          onChange={event => update('budget', event.target.value)} />
      </label>
      <label>رنگ محصول
        <select value={filters.color} onChange={event => update('color', event.target.value)}>
          <option value="">همهٔ رنگ‌ها</option>
          {colors.map(color => <option key={color.id} value={color.id}>{color.label}</option>)}
        </select>
      </label>
      {changed && <button className="product-search-reset" type="button" onClick={() => setFilters(defaults)}><X size={15} /> پاک‌کردن فیلترها</button>}
      {!validBudget && <small id="search-budget-error" className="product-search-error">سقف بودجه را با عدد وارد کنید.</small>}
    </section>
    <p className="product-search-count" role="status">{number.format(visible.length)} محصول</p>
    {visible.length ? <div className="beauty-product-grid">
      {visible.map(product => <ProductCard key={product.id} product={product} wishlist={wishlist} comparison={comparison}
        onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} />)}
    </div> : <div className="beauty-empty">
      <p>{changed ? 'محصولی با این فیلترها پیدا نشد.' : 'محصولی با این عبارت پیدا نشد. نام برند یا مدل دیگری را امتحان کنید.'}</p>
      {changed && <button type="button" onClick={() => setFilters(defaults)}>حذف فیلترها</button>}
    </div>}
  </main>;
}
