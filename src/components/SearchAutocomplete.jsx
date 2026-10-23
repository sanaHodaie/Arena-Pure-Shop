import React, { useEffect, useId, useRef, useState } from 'react';
import { Search, X, ArrowUpLeft } from 'lucide-react';
import { products } from '../data/catalog.js';
import { formatPrice } from '../data/mockData.js';
import { normalizeSearch, searchProducts } from '../data/productSearch.js';
import ProductImage from './ProductImage.jsx';

export default function SearchAutocomplete({ searchTerm, setSearchTerm, onSelectProduct, onSearchSubmit }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef(null);
  const input = useRef(null);
  const id = useId();
  const results = searchProducts(products, searchTerm);
  const suggestions = results.slice(0, 6);
  const expanded = open && !!normalizeSearch(searchTerm);
  const activeOption = active >= 0 && active < suggestions.length ? active : -1;

  useEffect(() => {
    const outside = event => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  useEffect(() => {
    if (expanded && activeOption >= 0) document.getElementById(`${id}-${activeOption}`)?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [activeOption, expanded, id]);

  const close = () => { setOpen(false); setActive(-1); };
  const select = product => {
    close();
    setSearchTerm(product.title);
    onSelectProduct(product);
  };
  const submit = event => {
    event.preventDefault();
    close();
    input.current?.blur();
    onSearchSubmit();
  };
  const onKeyDown = event => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key === 'Tab') { close(); return; }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!normalizeSearch(searchTerm) || !suggestions.length) return;
      event.preventDefault();
      setOpen(true);
      setActive(index => event.key === 'ArrowDown' ? (index + 1) % suggestions.length : (index <= 0 ? suggestions.length - 1 : index - 1));
    }
    if (event.key === 'Enter') {
      if (expanded && activeOption >= 0) {
        event.preventDefault();
        select(suggestions[activeOption]);
      } else {
        submit(event);
      }
    }
  };

  return <form ref={root} className="arena-search" role="search" onSubmit={submit} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
    <Search size={22} strokeWidth={1.2}/>
    <input ref={input} type="search" role="combobox" aria-label="جستجوی محصولات" placeholder="جستجوی محصول یا برند…" autoComplete="off"
      aria-autocomplete="list" aria-expanded={expanded} aria-controls={expanded ? `${id}-list` : undefined}
      aria-activedescendant={expanded && activeOption >= 0 ? `${id}-${activeOption}` : undefined}
      value={searchTerm} onChange={event => { setSearchTerm(event.target.value); setActive(-1); setOpen(true); }}
      onFocus={() => setOpen(true)} onKeyDown={onKeyDown}/>
    {searchTerm && <button className="search-clear" type="button" aria-label="پاک کردن جستجو" onClick={() => { setSearchTerm(''); close(); input.current?.focus(); }}><X size={16}/></button>}
    {expanded && <div className="search-suggestions">
      <div className="search-suggestions-heading"><span>پیشنهادهای جستجو</span><span>{results.length.toLocaleString('fa-IR')} محصول</span></div>
      <ul id={`${id}-list`} role="listbox" aria-label="محصولات پیشنهادی" className="search-results-list">
        {suggestions.map((product, index) => <li key={product.id} id={`${id}-${index}`} role="option" aria-selected={activeOption === index}
          className={`search-result ${activeOption === index ? 'is-active' : ''}`}
          onPointerDown={event => event.preventDefault()} onPointerMove={() => setActive(index)} onClick={() => select(product)}>
          <ProductImage src={product.image} alt="" className="search-result-image" loading="lazy"/>
          <span className="search-result-copy"><span className="search-result-brand">{product.brand}</span><span className="search-result-title">{product.title}</span><span className="search-result-price">{formatPrice(product.price)} تومان</span></span>
          <ArrowUpLeft size={16}/>
        </li>)}
      </ul>
      {!suggestions.length && <p className="search-no-results" role="status">محصولی پیدا نشد؛ نام یا برند دیگری را امتحان کن.</p>}
      {suggestions.length > 0 && <button className="search-all-results" type="submit">نمایش همهٔ نتایج <ArrowUpLeft size={16}/></button>}
    </div>}
  </form>;
}
