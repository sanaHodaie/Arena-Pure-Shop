import React, { useMemo, useState } from 'react';
import { ChevronLeft, Scissors, ArrowLeft } from 'lucide-react';
import { products } from '../data/catalog.js';
import ProductCard from '../components/ProductCard.jsx';
import './CategoryPage.css';

export default function CategoryPage({ onAddToCart, onToggleWishlist, wishlist }) {
  const [sort, setSort] = useState('default');
  const haircare = useMemo(() => {
    const list = products.filter(product => product.category === 'haircare');
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'name') list.sort((a, b) => a.title.localeCompare(b.title, 'fa'));
    return list;
  }, [sort]);
  return <main className="arena-container category-page" dir="rtl">
    <nav className="pd-breadcrumb" aria-label="مسیر صفحه"><a href="/">خانه</a><ChevronLeft size={14}/><span aria-current="page">مراقبت مو</span></nav>
    <header className="category-intro"><div><span className="category-eyebrow"><Scissors size={17}/> روتین زیبایی مو</span><h1 id="category-title" tabIndex={-1}>مراقبت مو</h1><p>از شامپو و نرم‌کننده تا ماسک و روغن مو؛ محصول دلخواهت را پیدا کن و مشخصات هر مدل را در صفحه خودش ببین.</p></div><span className="category-count"><strong>{haircare.length.toLocaleString('fa-IR')}</strong>محصول برای مراقبت روزانه</span></header>
    <div className="category-toolbar"><p>{haircare.length.toLocaleString('fa-IR')} محصول</p><label htmlFor="haircare-sort">مرتب‌سازی<select id="haircare-sort" value={sort} onChange={event => setSort(event.target.value)}><option value="default">پیش‌فرض</option><option value="price-asc">ارزان‌ترین</option><option value="price-desc">گران‌ترین</option><option value="name">نام محصول</option></select></label></div>
    <div className="beauty-product-grid category-product-grid">{haircare.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlist={wishlist}/>)}</div>
    <a className="category-back" href="/">بازگشت به فروشگاه <ArrowLeft size={17}/></a>
  </main>;
}
