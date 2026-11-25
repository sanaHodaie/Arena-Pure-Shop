import React, {useEffect, useId, useRef, useState} from 'react';
import {Search, X} from 'lucide-react';
import { formatToman as money } from '../utils/formatters';

export default function AdminSearch({onSearch, products}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef(null), input = useRef(null);
  const id = useId();
  const term = query.trim();
  const lower = term.toLocaleLowerCase('fa');
  const items = term ? products.filter((product) =>
    [product.name, product.sku, product.brand].some((value) => value.toLocaleLowerCase('fa').includes(lower))
  ).slice(0, 6) : [];
  useEffect(() => {
    const outside = event => {if(!root.current?.contains(event.target))setOpen(false);};
    const shortcut = event => {
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'&&input.current?.getClientRects().length){
        event.preventDefault();input.current.focus();setOpen(true);
      }
    };
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',shortcut);
    return () => {document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',shortcut);};
  }, []);
  useEffect(()=>{if(active>=0)document.getElementById(`${id}-${active}`)?.scrollIntoView({block:'nearest'});},[active,id]);
  const choose = product => {setQuery(product.name);setOpen(false);onSearch?.(product.sku);};
  const visible = open && Boolean(term);
  return <div ref={root} className="relative min-w-0 flex-1" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}} dir="rtl">
    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-pearl-100/80 dark:bg-pearl-800/80 border border-plum-100 dark:border-plum-900 focus-within:border-plum-400">
      <Search size={16} className="shrink-0 text-plum-500"/>
      <input ref={input} type="text" inputMode="search" role="combobox" autoComplete="off" maxLength={100} aria-label="جستجوی محصولات پنل" aria-autocomplete="list" aria-expanded={visible} aria-controls={visible?id:undefined} aria-activedescendant={visible&&active>=0?`${id}-${active}`:undefined}
        className="w-full min-w-0 bg-transparent outline-none text-xs text-pearl-800 dark:text-pearl-100" placeholder="نام، مدل، برند یا شناسهٔ محصول…" value={query} onFocus={()=>setOpen(true)} onChange={e=>{setQuery(e.target.value);setOpen(true);setActive(-1);}}
        onKeyDown={e=>{
          if(e.nativeEvent.isComposing)return;
          if(e.key==='Escape'){e.preventDefault();setOpen(false);setActive(-1);}
          else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();setOpen(true);setActive(i=>items.length?Math.max(0,Math.min(items.length-1,i+(e.key==='ArrowDown'?1:-1))):-1);}
          else if(e.key==='Enter'){e.preventDefault();if(visible&&active>=0&&items[active])choose(items[active]);else if(term){setOpen(false);onSearch?.(term);}}
        }}/>
      {query&&<button type="button" aria-label="پاک کردن جستجوی پنل" onClick={()=>{setQuery('');setActive(-1);input.current?.focus();}} className="shrink-0 p-1 text-pearl-500"><X size={14}/></button>}
    </div>
    {visible&&<div className="absolute top-full mt-2 inset-x-0 z-50 bg-white dark:bg-pearl-900 border border-plum-100 dark:border-plum-900 rounded-2xl shadow-xl overflow-hidden">
      <ul id={id} role="listbox" aria-label="پیشنهاد محصولات" className="max-h-[min(55dvh,360px)] overflow-y-auto">
        {items.map((p,i)=><li id={`${id}-${i}`} key={p.id} role="option" aria-selected={active===i} onPointerDown={e=>e.preventDefault()} onClick={()=>choose(p)} onMouseMove={()=>setActive(i)} className={`flex gap-3 p-3 cursor-pointer border-b border-pearl-100 dark:border-pearl-800 ${active===i?'bg-plum-50 dark:bg-plum-950/50':''}`}>
          <img src={p.image} alt="" width="40" height="40" className="w-10! h-10! shrink-0 object-contain rounded-lg bg-white"/>
          <div className="min-w-0 flex-1 text-xs"><strong className="block leading-6 break-words">{p.name}</strong><span className="block text-pearl-400 break-all" dir="ltr">{p.sku}</span><span className="block text-plum-700 dark:text-plum-300 mt-1">{money(p.price)}{!p.active?' · بایگانی':''}</span></div>
        </li>)}
      </ul>
      <div role="status" className="text-xs text-pearl-500 px-3 py-2">{!items.length?'محصولی پیدا نشد.':'با کلیدهای بالا و پایین انتخاب و با Enter تأیید کنید.'}</div>
      {<button className="w-full text-xs text-plum-700 dark:text-plum-300 border-t border-plum-100 dark:border-plum-900 py-3" onClick={()=>{setOpen(false);onSearch?.(term);}}>نمایش همهٔ نتایج</button>}
    </div>}
  </div>;
}
