import React, { useState } from 'react';
import { UserRound, ShoppingBag, Menu, X, Sparkles, Badge, Droplets, Scissors, Pipette, SprayCan, Moon, Sun } from 'lucide-react';
import { navCategories } from '../data/mockData.js';
import useTheme from '../hooks/useTheme.js';
import SearchAutocomplete from './SearchAutocomplete.jsx';
const icons = [Sparkles, Badge, Droplets, Scissors, Pipette, SprayCan, Droplets];
export default function Header({ cartCount, onOpenCart, onOpenAuth, searchTerm, setSearchTerm, selectedCategory, onSelectCategory, onSelectProduct }) {
 const { theme, toggleTheme } = useTheme();
 const [menuOpen, setMenuOpen] = useState(false);
 return <header className="arena-header"><div className="arena-header-main arena-container">
 <a href="/" className="arena-logo" aria-label="آرنا پیور، صفحه اصلی"><span>Arena</span><i>Pure</i></a>
 <SearchAutocomplete searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSelectProduct={onSelectProduct} onSearchSubmit={() => onSelectCategory(null)}/>
 <div className="arena-header-actions"><button className="arena-theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'فعال کردن حالت روشن' : 'فعال کردن حالت تاریک'} aria-pressed={theme === 'dark'}>{theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}</button><button className="arena-login" aria-label="ورود یا ثبت نام" onClick={onOpenAuth}><UserRound size={19} strokeWidth={1.3}/><span>ورود / ثبت نام</span></button><button className="arena-cart" onClick={onOpenCart} aria-label={`سبد خرید، ${cartCount} کالا`}><ShoppingBag size={21} strokeWidth={1.5}/>{cartCount > 0 && <span>{cartCount.toLocaleString('fa-IR')}</span>}</button></div>
 <button className="arena-menu-toggle" aria-label="فهرست دسته‌ها" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div>
 <div className="arena-nav-wrap"><div className="arena-container arena-nav-row"><nav className={`arena-nav ${menuOpen ? 'is-open' : ''}`} aria-label="دسته‌بندی محصولات">{navCategories.map((item,index) => {const Icon=icons[index]; return <a key={item.id} href={item.id === 'haircare' ? '/categories/haircare' : `/${item.href}`} className={`${index === 0 ? 'featured' : ''} ${selectedCategory === item.id ? 'active' : ''}`} onClick={event => {if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; if (item.id === 'haircare') { setMenuOpen(false); return; } event.preventDefault();onSelectCategory(item.id, item.href);setMenuOpen(false);}}><Icon size={17} strokeWidth={1.15}/>{item.title}</a>;})}</nav></div></div></header>;
}
