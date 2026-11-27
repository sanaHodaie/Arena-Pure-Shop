import React, { useState } from 'react';
import { UserRound, ShoppingBag, Menu, X, Sparkles, Badge, Droplets, Scissors, Pipette, SprayCan, Heart } from 'lucide-react';
import { navCategories } from '../data/mockData.js';
import { categoryPages, categoryUrl } from '../data/categories.js';
import SearchAutocomplete from './SearchAutocomplete.jsx';
const icons = [Sparkles, Badge, Droplets, Scissors, Pipette, SprayCan, Droplets];
export default function Header({ cartCount, onOpenCart, onOpenAuth, isSignedIn, wishlistCount, isWishlist, isRoutine, catalogLoading, searchTerm, setSearchTerm, selectedCategory, onSelectCategory, onSelectProduct, onSearchSubmit }) {
 const [menuOpen, setMenuOpen] = useState(false);
 return <header className="arena-header"><div className="arena-header-main arena-container">
 <a href="/" className="arena-logo" aria-label="آرنا پیور، صفحه اصلی"><span>Arena</span><i>Pure</i></a>
 <SearchAutocomplete catalogLoading={catalogLoading} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSelectProduct={onSelectProduct} onSearchSubmit={onSearchSubmit}/>
 <div className="arena-header-actions"><button className="arena-login" aria-label={isSignedIn ? 'پنل مشتری' : 'ورود یا ثبت‌نام'} onClick={onOpenAuth}><UserRound size={19} strokeWidth={1.3}/><span>{isSignedIn ? 'پنل مشتری' : 'ورود / ثبت‌نام'}</span></button>
 <a className="arena-cart arena-wishlist-link" href="/wishlist" aria-current={isWishlist ? 'page' : undefined} aria-label={`علاقه‌مندی‌ها، ${wishlistCount.toLocaleString('fa-IR')} محصول`} title="علاقه‌مندی‌ها"><Heart size={21} strokeWidth={1.5} fill={isWishlist ? 'currentColor' : 'none'} aria-hidden="true"/>{wishlistCount > 0 && <span aria-hidden="true">{wishlistCount.toLocaleString('fa-IR')}</span>}</a>
 <button className="arena-cart" onClick={onOpenCart} aria-label={`سبد خرید، ${cartCount} کالا`}><ShoppingBag size={21} strokeWidth={1.5}/>{cartCount > 0 && <span>{cartCount.toLocaleString('fa-IR')}</span>}</button></div>
 <button className="arena-menu-toggle" aria-label="فهرست دسته‌ها" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div>
 <div className="arena-nav-wrap"><div className="arena-container arena-nav-row"><nav className={`arena-nav ${menuOpen ? 'is-open' : ''}`} aria-label="دسته‌بندی محصولات">{navCategories.map((item,index) => {const Icon=icons[index]; return <a key={item.id} href={categoryPages[item.id] ? categoryUrl(item.id) : `/${item.href}`} className={`${index === 0 ? 'featured' : ''} ${selectedCategory === item.id ? 'active' : ''}`} onClick={event => {if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; if (categoryPages[item.id]) { setMenuOpen(false); return; } event.preventDefault();onSelectCategory(item.id, item.href);setMenuOpen(false);}}><Icon size={17} strokeWidth={1.15}/>{item.title}</a>;})}<a href="/skincare-routine" aria-current={isRoutine ? 'page' : undefined} className={isRoutine ? 'active' : undefined} onClick={() => setMenuOpen(false)}><Sparkles size={17} strokeWidth={1.15}/>روتین‌ساز پوست</a></nav></div></div></header>;
}
