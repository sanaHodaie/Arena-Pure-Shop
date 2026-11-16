import SectionHeading from './SectionHeading.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { specialOfferProducts } from '../data/mockData.js';
import ProductCard from './ProductCard.jsx';
import './WeeklyDeals.css';

const weeklyProducts = [...specialOfferProducts].reverse();

export default function WeeklyDeals({ onAddToCart, onToggleWishlist, wishlist = [] }) {
  const rail = useRef(null);
  const [position, setPosition] = useState({ first: true, last: false });

  useEffect(() => {
    const element = rail.current;
    const update = () => {
      const offset = Math.abs(element.scrollLeft);
      setPosition({ first: offset < 2, last: offset >= element.scrollWidth - element.clientWidth - 2 });
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => { element.removeEventListener('scroll', update); observer.disconnect(); };
  }, []);

  const scroll = direction => {
    const element = rail.current;
    const card = element?.querySelector('.beauty-card');
    if (!card) return;
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap || 0);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollBy({ left: direction * step, behavior: reducedMotion ? 'instant' : 'smooth' });
  };

  return <section id="weekly-deals" className="arena-container weekly-section" aria-labelledby="weekly-heading">
    <SectionHeading id="weekly-heading" title="پیشنهاد هفته" eyebrow={<><Sparkles size={14}/> انتخاب‌های این هفته</>} action={<a className="weekly-all" href="/#products">دیدن همه محصولات <ArrowLeft size={17}/></a>}/>
    <div className="weekly-showcase">
      <div className="weekly-seal"><span>تا</span><strong>{Math.max(...weeklyProducts.map(product => product.discountPercent)).toLocaleString('fa-IR')}<small>٪</small></strong><span>تخفیف</span></div>
      <aside className="weekly-editorial">
        <span className="weekly-edition" dir="ltr">THE WEEKLY EDIT</span>
        <div className="weekly-editorial-copy"><h3>برای روتین تو،<br/><em>یک انتخاب تازه.</em></h3><p>از رنگ‌های دوست‌داشتنی تا مراقبت روزانه؛ این هفته با انتخاب‌های آرنا پیور همراه شو.</p></div>
        <div className="weekly-editorial-footer"><span>{weeklyProducts.length.toLocaleString('fa-IR')} محصول برای کشف کردن</span><ArrowLeft size={20}/></div>
      </aside>
      <div className="weekly-products">
        <div className="weekly-rail no-scrollbar" ref={rail} role="region" aria-label="محصولات پیشنهاد هفته" tabIndex={0}>
          {weeklyProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlist={wishlist}/>)}
        </div>
        <div className="weekly-navigation"><p><span aria-hidden="true"/> زیبایی، به انتخاب خودت</p><div><button type="button" aria-label="محصولات قبلی پیشنهاد هفته" disabled={position.first} onClick={() => scroll(1)}><ChevronRight size={19}/></button><button type="button" aria-label="محصولات بعدی پیشنهاد هفته" disabled={position.last} onClick={() => scroll(-1)}><ChevronLeft size={19}/></button></div></div>
      </div>
    </div>
  </section>;
}
