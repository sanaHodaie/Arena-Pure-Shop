import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gem, Plus, Search, Edit2, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
import { toPersianDigits, formatToman } from '../utils/formatters';
import { playTactileClick } from '../utils/sound';

const buttonStyle = 'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold';
const filterStyle = 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-purple-500';
const iconStyle = 'rounded-xl border border-purple-100 p-2 text-purple-600 hover:bg-purple-50 disabled:opacity-50 dark:border-slate-700 dark:text-purple-300 dark:hover:bg-slate-800';

export default function Products({ products, categories, search, onSearch, account, onEdit, onUpload, onAction, busy }) {
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [brand, setBrand] = useState('');
  const brands = [...new Set(products.map((product) => product.brand))].sort((a, b) => a.localeCompare(b, 'fa'));
  const query = search.trim().toLocaleLowerCase('fa');
  const filtered = products.filter((product) =>
    (!category || String(product.category) === category) &&
    (!brand || product.brand === brand) &&
    (!status || product.active === (status === 'active')) &&
    [product.name, product.sku, product.brand].some((value) => value.toLocaleLowerCase('fa').includes(query))
  );

  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/20"><Gem className="w-5 h-5" /></span>
            <h1 className="text-2xl md:text-3xl font-black">ویترین و موجودی محصولات</h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{toPersianDigits(filtered.length)} محصول</p>
        </div>
        {account.can_add && <div className="flex flex-wrap gap-2">
          <motion.button whileTap={{ scale: 0.97 }} onClick={onUpload} className={buttonStyle + ' glass-panel text-purple-700 dark:text-purple-300'}><Upload size={16} /> ورود از اکسل</motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => onEdit('new')} className={buttonStyle + ' bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'}><Plus size={16} /> افزودن محصول</motion.button>
        </div>}
      </div>

      <div className="glass-panel rounded-3xl p-5 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[{ id: '', title: 'همهٔ محصولات' }, ...categories].map((item) => (
            <button key={item.id} aria-pressed={category === String(item.id)} onClick={() => { playTactileClick(); setCategory(String(item.id)); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${category === String(item.id) ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-purple-300'}`}>
              {item.title}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <label className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <input value={search} onChange={(event) => onSearch(event.target.value)} aria-label="نام یا شناسهٔ محصول" placeholder="جست‌وجو بر اساس نام، برند یا شناسه" className={filterStyle + ' pr-10'} />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={filterStyle} aria-label="وضعیت نمایش">
            <option value="">همهٔ وضعیت‌ها</option><option value="active">فعال</option><option value="hidden">غیرفعال</option>
          </select>
          <select value={brand} onChange={(event) => setBrand(event.target.value)} className={filterStyle} aria-label="برند">
            <option value="">همهٔ برندها</option>{brands.map((name) => <option key={name}>{name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((product) => (
          <motion.article key={product.id} layout whileHover={{ y: -3 }} className="glass-panel glass-card-hover p-4 flex flex-col justify-between gap-4 min-w-0">
            <div className="flex gap-3 items-start">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center">
                {product.image ? <img src={product.image} alt="" loading="lazy" referrerPolicy="no-referrer" className="size-full object-contain" /> : <Gem className="text-slate-400" />}
              </div>
              <div className="min-w-0 space-y-1">
                <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold">{product.categoryName} · {product.brand}</span>
                <h3 className="font-bold text-sm leading-relaxed">{product.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">موجودی {toPersianDigits(product.stock)}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-purple-50 pt-3 dark:border-slate-800">
              <span className="text-xs font-black">{formatToman(product.price)}</span>
              <div className="flex gap-1.5">
                {account.can_change && <>
                  <button className={iconStyle} disabled={busy} onClick={() => onAction(product, product.active ? 'hide' : 'show')} aria-pressed={product.active} title={product.active ? 'غیرفعال کردن محصول' : 'فعال کردن محصول'} aria-label="نمایش محصول">{product.active ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                  <button className={iconStyle} onClick={() => onEdit(product.id)} title="ویرایش محصول" aria-label="ویرایش محصول"><Edit2 size={16} /></button>
                </>}
                {account.can_delete && <button className={iconStyle} disabled={busy} onClick={() => onAction(product, 'delete')} title="حذف محصول" aria-label="حذف محصول"><Trash2 size={16} /></button>}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      {!filtered.length && <p className="glass-panel p-8 text-center text-sm text-slate-500 dark:text-slate-400">محصولی پیدا نشد.</p>}
    </div>
  );
}
