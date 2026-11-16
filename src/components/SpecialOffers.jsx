import SectionHeading from './SectionHeading.jsx';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { specialOfferProducts } from '../data/mockData.js';
import ProductCard from './ProductCard.jsx';
import useAutoScroll from '../hooks/useAutoScroll.js';

export default function SpecialOffers({ onAddToCart, onToggleWishlist, wishlist = [] }) {
  const [seconds, setSeconds] = useState(7459);
  const { rail, section, paused, reducedMotion, togglePaused, scroll, interactionProps } = useAutoScroll();
  useEffect(() => {
    const timer = setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, []);
  const time = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(n => n.toLocaleString('fa-IR', { minimumIntegerDigits: 2 })).join(' : ');

  return <section id="special-offers" ref={section} className="arena-container arena-offers-section" {...interactionProps}>
    <SectionHeading title="پیشنهاد شگفت‌انگیز" action={!reducedMotion && <button className="offers-autoplay" onClick={togglePaused} aria-label={paused ? 'شروع حرکت خودکار پیشنهادها' : 'توقف حرکت خودکار پیشنهادها'} aria-pressed={paused}>{paused ? <Play size={15}/> : <Pause size={15}/>}<span>{paused ? 'ادامه حرکت' : 'توقف حرکت'}</span></button>}/>
    <div className="arena-offers">
      <div className="arena-offers-title">
        <div className="arena-countdown" aria-label="زمان باقی‌مانده">{time}</div>
        <h2>پیشنهاد<br/>شگفت<br/>انگیز</h2>
        <div className="arena-rail-controls"><button aria-label="محصولات قبلی" onClick={() => scroll(320)}><ChevronRight size={19}/></button><button aria-label="محصولات بعدی" onClick={() => scroll(-320)}><ChevronLeft size={19}/></button></div>
      </div>
      <div className="arena-product-rail no-scrollbar" ref={rail} role="region" aria-label="محصولات پیشنهاد شگفت‌انگیز" tabIndex={0}>
        {specialOfferProducts.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlist={wishlist}/>)}
      </div>
    </div>
  </section>;
}
