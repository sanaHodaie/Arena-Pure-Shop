import React, { useState } from 'react';
import { Search, UserRound, ShoppingBag, Phone, Menu, X, Sparkles, Badge, Droplets, Scissors, Pipette, SprayCan } from 'lucide-react';
import { navCategories, siteConfig } from '../data/mockData.js';
const icons = [Sparkles, Badge, Droplets, Scissors, Pipette, SprayCan, Droplets];
export default function Header({ cartCount, onOpenCart, onOpenAuth, searchTerm, setSearchTerm, selectedCategory, onSelectCategory }) {
 const [menuOpen, setMenuOpen] = useState(false);
 return <header className="arena-header"><div className="arena-header-main arena-container">
 <a href="#" className="arena-logo" aria-label="آرنا پیور، صفحه اصلی"><span>Arena</span><i>Pure</i></a>
 <form className="arena-search" role="search" onSubmit={e => { e.preventDefault(); document.getElementById('special-offers')?.scrollIntoView({ behavior: 'smooth' }); }}><Search size={22} strokeWidth={1.2}/><input aria-label="جستجوی محصولات" placeholder="جستجوی محصولات" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>{searchTerm && <button type="button" aria-label="پاک کردن جستجو" onClick={() => setSearchTerm('')}><X size={15}/></button>}</form>
 <div className="arena-header-actions"><a className="arena-header-shop" href="#products">خرید محصولات <ShoppingBag size={17}/></a><button className="arena-login" aria-label="ورود یا ثبت نام" onClick={onOpenAuth}><UserRound size={19} strokeWidth={1.3}/><span>ورود / ثبت نام</span></button><button className="arena-cart" onClick={onOpenCart} aria-label={`سبد خرید، ${cartCount} کالا`}><ShoppingBag size={21} strokeWidth={1.5}/>{cartCount > 0 && <span>{cartCount.toLocaleString('fa-IR')}</span>}</button></div>
 <button className="arena-menu-toggle" aria-label="فهرست دسته‌ها" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div>
 <div className="arena-nav-wrap"><div className="arena-container arena-nav-row"><nav className={`arena-nav ${menuOpen ? 'is-open' : ''}`} aria-label="دسته‌بندی محصولات">{navCategories.map((item,index) => {const Icon=icons[index]; return <a key={item.id} href={item.href} className={`${index === 0 ? 'featured' : ''} ${selectedCategory === item.id ? 'active' : ''}`} onClick={() => {onSelectCategory(item.id);setMenuOpen(false);}}><Icon size={17} strokeWidth={1.15}/>{item.title}</a>;})}</nav><a className="arena-phone" href="tel:09301315050"><Phone size={17} strokeWidth={1.2}/><span>{siteConfig.mobile}</span></a></div></div></header>;
}
