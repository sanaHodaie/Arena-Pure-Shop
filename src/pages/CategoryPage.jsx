import React, { useMemo, useState } from 'react';
import { Sun, ChevronLeft, Scissors, ArrowLeft, Droplets, Sparkles } from 'lucide-react';
import { products } from '../data/catalog.js';
import SortMenu from '../components/SortMenu.jsx';
import { categoryPages } from '../data/categories.js';
import ProductCard from '../components/ProductCard.jsx';
import './CategoryPage.css';

export default function CategoryPage({ category, onAddToCart, onToggleWishlist, wishlist }) {
  const content = categoryPages[category];
  const Icon = category === 'sunscreen' ? Sun : category === 'haircare' ? Scissors : Droplets;
  const [sort, setSort] = useState('default');
  const categoryProducts = useMemo(() => {
    const list = products.filter(product => product.category === category);
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'name') list.sort((a, b) => a.title.localeCompare(b.title, 'fa'));
    return list;
  }, [sort, category]);
  return <main className="arena-container category-page" dir="rtl">
    <nav className="pd-breadcrumb" aria-label="مسیر صفحه"><a href="/">خانه</a><ChevronLeft size={14}/><span aria-current="page">{content.title}</span></nav>
    <div className={`category-hero category-hero-${category}`}><header className="category-intro"><div><span className="category-eyebrow"><Icon size={17}/>{content.eyebrow}</span><h1 id="category-title" tabIndex={-1}>{content.title}</h1><p>{content.description}</p><span className="category-glass-label"><Sparkles size={13}/> زیبایی در جزئیات مراقبت توست</span></div><span className="category-count"><Icon size={24}/><strong>{categoryProducts.length.toLocaleString('fa-IR')}</strong>انتخاب برای روتین تو</span></header></div>
    <div className="category-toolbar"><p><strong>{categoryProducts.length.toLocaleString('fa-IR')}</strong> محصول برای کشف کردن</p><SortMenu value={sort} onChange={setSort}/></div>
    <div className="beauty-product-grid category-product-grid">{categoryProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlist={wishlist}/>)}</div>
    <a className="category-back" href="/">بازگشت به فروشگاه <ArrowLeft size={17}/></a>
  </main>;
}
