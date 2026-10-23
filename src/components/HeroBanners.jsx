import React, { useEffect, useRef, useState } from 'react';
import ReferenceArtwork from './ReferenceArtwork.jsx';
import SiteArtwork from './SiteArtwork.jsx';
import { ArrowLeft, Sparkles, ShieldCheck, Truck } from 'lucide-react';

const slides = [
  { id: 'care', category: 'skincare', eyebrow: 'زیبایی از یک انتخاب خوب شروع می‌شود', title: ['مراقبت امروز،', 'درخشش هر روز.'], description: 'از سرم‌های محبوب تا آبرسان‌های روزانه؛ روتین مراقبت پوستت را با انتخاب‌هایی دوست‌داشتنی در آرنا پیور کامل کن.', button: 'کشف محصولات مراقبت پوست' },
  { id: 'fragrance', category: 'fragrance', eyebrow: 'رایحه‌ای برای امضای شخصی تو', title: ['هر رایحه،', 'یک خاطرهٔ تازه.'], description: 'از نت‌های لطیف و روزانه تا رایحه‌های خاص و ماندگار؛ عطری را پیدا کن که داستان تو را روایت می‌کند.', button: 'کشف دنیای عطر' },
];
const INTERVAL = 6000;

export default function HeroBanners({ onShopClick }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(() => document.hidden);
  const touchStart = useRef(null);
  const stopped = paused || hovered || focused || hidden;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => { if (query.matches) setPaused(true); };
    const onVisibility = () => setHidden(document.hidden);
    query.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { query.removeEventListener('change', onMotion); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  useEffect(() => {
    if (stopped) return;
    const timer = window.setTimeout(() => setActive(index => (index + 1) % slides.length), INTERVAL);
    return () => window.clearTimeout(timer);
  }, [active, stopped]);
  const move = direction => setActive(index => (index + direction + slides.length) % slides.length);

  return <section className="arena-container arena-hero" aria-label="محصولات زیبایی آرنا پیور">
    <div className="arena-carousel" role="region" aria-roledescription="اسلایدشو" aria-label="پیشنهادهای آرنا پیور" data-active-slide={active}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onTouchStart={event => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchCancel={() => { touchStart.current = null; }}
      onTouchEnd={event => { if (touchStart.current !== null) { const distance = event.changedTouches[0].clientX - touchStart.current.x; const vertical = event.changedTouches[0].clientY - touchStart.current.y; if (Math.abs(distance) > 45 && Math.abs(distance) > Math.abs(vertical)) move(distance > 0 ? 1 : -1); touchStart.current = null; } }}>
      {slides.map((slide, index) => <div key={slide.id} className={`arena-main-banner hero-carousel-slide ${active === index ? 'is-active' : ''}`} aria-hidden={active !== index} inert={active !== index} role="group" aria-roledescription="اسلاید" aria-label={`${index + 1} از ${slides.length}`}>
        <picture className="hero-carousel-picture"><source media="(max-width: 640px)" srcSet={`/images/banners/slide-${slide.id}-mobile.webp`}/><img src={`/images/banners/slide-${slide.id}-desktop.webp`} alt="" width="1920" height="640" decoding="async" loading="eager" fetchPriority={index === 0 ? 'high' : 'auto'}/></picture>
        <div className="arena-hero-copy carousel-copy">
          <span className="hero-eyebrow"><Sparkles size={15}/>{slide.eyebrow}</span>
          {index === 0 ? <h1>{slide.title[0]}<br/>{slide.title[1]}</h1> : <h2 className="carousel-title">{slide.title[0]}<br/>{slide.title[1]}</h2>}
          <p>{slide.description}</p>
          <div className="hero-assurances"><span><ShieldCheck size={15}/> انتخاب برندهای معتبر</span><span><Truck size={15}/> خرید آسان و مطمئن</span></div>
          <button onClick={() => onShopClick(slide.category)} className="arena-shop">{slide.button}<ArrowLeft size={17}/></button>
        </div>
      </div>)}
      <div className="arena-slide-indicator" role="group" aria-label="انتخاب پوستر">{slides.map((slide,index) => <button key={slide.id} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)} aria-label={`نمایش پوستر ${index+1}`} aria-pressed={active === index}><span/></button>)}</div>
      <span className="sr-only" aria-live={stopped ? 'polite' : 'off'}>پوستر {active+1} از {slides.length}</span>
    </div>
    <div className="arena-secondary-banners">
      <div className="arena-hair-banner">
        <SiteArtwork src="/images/banners/haircare-desktop.webp" mobileSrc="/images/banners/haircare-mobile.webp" className="banner-artwork"><ReferenceArtwork x={838} y={561} width={319} height={309}/></SiteArtwork>
        <div className="arena-banner-copy"><span className="hero-eyebrow">روتین زیبایی مو</span><h2>مراقبتی که موهایتان<br/>شایستهٔ آن است</h2><p>یک قدم نزدیک‌تر به موهایی خوش‌حالت؛<br/>شامپو، ماسک و مراقبت محبوبت را پیدا کن.</p><button className="arena-shop" onClick={() => onShopClick('haircare')}>خرید مراقبت مو <ArrowLeft size={15}/></button></div>
      </div>
      <div className="arena-perfume-banner">
        <SiteArtwork src="/images/banners/fragrance-desktop.webp" mobileSrc="/images/banners/fragrance-mobile.webp" className="banner-artwork"><ReferenceArtwork x={202} y={562} width={620} height={308}/></SiteArtwork>
        <div className="arena-banner-copy"><span className="hero-eyebrow">امضای شخصی تو</span><h2>رایحه‌ای ماندگار<br/>برای لحظه‌های بی‌تکرار</h2><p>از رایحه‌های لطیف روزانه تا عطرهای خاص؛<br/>رایحه‌ای را انتخاب کن که حال‌وهوای تو را روایت می‌کند.</p><button className="arena-shop" onClick={() => onShopClick('fragrance')}>کشف دنیای عطر <ArrowLeft size={15}/></button></div>
      </div>
    </div>
  </section>;
}
