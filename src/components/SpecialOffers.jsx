import React, { useEffect, useRef, useState } from 'react';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { specialOfferProducts, formatPrice } from '../data/mockData.js';
import ProductCard from './ProductCard.jsx';
export default function SpecialOffers({ onAddToCart, onToggleWishlist, wishlist = [], onQuickView, searchTerm = '' }) {
 const [seconds,setSeconds]=useState(7459); const rail=useRef(null);
 useEffect(()=>{const timer=setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000);return ()=>clearInterval(timer);},[]);
 const time=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>n.toLocaleString('fa-IR',{minimumIntegerDigits:2})).join(' : ');
 const products=specialOfferProducts.filter(p=>`${p.title} ${p.brand}`.includes(searchTerm.trim()));
 return <section id="special-offers" className="arena-container arena-offers-section"><div className="arena-offers"><div className="arena-offers-title"><div className="arena-countdown" aria-label="زمان باقی‌مانده">{time}</div><h2>پیشنهاد<br/>شگفت<br/>انگیز</h2><div className="arena-rail-controls"><button aria-label="محصولات قبلی" onClick={()=>rail.current?.scrollBy({left:320,behavior:'smooth'})}><ChevronRight size={19}/></button><button aria-label="محصولات بعدی" onClick={()=>rail.current?.scrollBy({left:-320,behavior:'smooth'})}><ChevronLeft size={19}/></button></div></div><div className="arena-product-rail no-scrollbar" ref={rail}>{products.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlist={wishlist} onQuickView={onQuickView}/>)}{products.length===0&&<p className="arena-empty-search">محصولی با این نام پیدا نشد.</p>}</div></div></section>;
}
