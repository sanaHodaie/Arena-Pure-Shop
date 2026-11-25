import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Edit2, Eye, EyeOff, FileSpreadsheet, Plus, Trash2 } from 'lucide-react';
import { Button, Empty, Heading, Pager, Panel, inputClass, money, number } from './ManagementUI';
import Select from './Select';

const pageSize = 20;

export default function Products({ products, categories, search, onSearch, account, onEdit, onUpload, onAction, busy }) {
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [brand, setBrand] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); }, [search, category, status, brand]);

  const brands = [...new Set(products.map((product) => product.brand))].sort((a, b) => a.localeCompare(b, 'fa'));
  const query = search.trim().toLocaleLowerCase('fa');
  const filtered = products.filter((product) =>
    (!category || String(product.category) === category) &&
    (!brand || product.brand === brand) &&
    (!status || product.active === (status === 'active')) &&
    [product.name, product.sku, product.brand, product.model].some((value) => value.toLocaleLowerCase('fa').includes(query))
  );
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 pb-12">
      <Heading title="محصولات و موجودی" subtitle="موجودی و قیمت محصولات را مدیریت کنید. قیمت‌ها به تومان نمایش داده می‌شوند.">
        {account.can_add && <div className="flex flex-wrap gap-2">
          <Button secondary onClick={onUpload}><FileSpreadsheet size={15} className="inline ml-2" />ورود از اکسل</Button>
          <Button onClick={() => onEdit('new')}><Plus size={15} className="inline ml-2" />محصول جدید</Button>
        </div>}
      </Heading>

      <Panel className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <input aria-label="جستجوی محصولات" className={inputClass} value={search} onChange={(event) => onSearch(event.target.value)} placeholder="نام، مدل، برند یا شناسهٔ محصول…" />
        <Select aria-label="فیلتر دسته‌بندی محصولات" className={inputClass} value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">همهٔ دسته‌بندی‌ها</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </Select>
        <Select aria-label="وضعیت نمایش" className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">همهٔ وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="hidden">غیرفعال</option>
        </Select>
        <Select aria-label="برند" className={inputClass} value={brand} onChange={(event) => setBrand(event.target.value)}>
          <option value="">همهٔ برندها</option>
          {brands.map((name) => <option key={name} value={name}>{name}</option>)}
        </Select>
      </Panel>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {rows.map((product) => (
          <motion.article key={product.id} data-category={product.category} layout whileHover={{ y: -5 }}
            className="glass-panel glass-card-hover group flex flex-col overflow-hidden rounded-3xl sm:flex-row">
            <div className="relative m-3 aspect-square w-40 shrink-0 self-start overflow-hidden rounded-2xl bg-white">
              {product.image && <img loading="lazy" src={product.image} alt={product.name} className="size-full object-contain transition-transform duration-500 group-hover:scale-105" />}
              <span className="absolute right-2 top-2 rounded-lg bg-pearl-900/80 px-2 py-1 text-[10px] font-bold text-white">{product.categoryName}</span>
              <span className={`absolute bottom-2 right-2 rounded-lg px-2 py-1 text-[10px] font-bold text-white ${product.active ? 'bg-emerald-600/90' : 'bg-pearl-600/90'}`}>
                {product.active ? `موجودی ${number(product.stock)}` : 'غیرفعال'}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
              <span className="break-all text-[11px] text-pearl-400" dir="ltr">{product.sku}</span>
              <h2 className="text-sm font-bold leading-relaxed">{product.name}</h2>
              <div className="rounded-2xl bg-pearl-50 p-3 text-xs dark:bg-pearl-800/60">
                <strong>{product.brand}</strong>{product.type && <span className="text-pearl-500 dark:text-pearl-400"> · {product.type}</span>}
              </div>
              {product.description && <p className="line-clamp-3 text-xs leading-6 text-pearl-600 dark:text-pearl-300">{product.description}</p>}
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-pearl-100 pt-3 dark:border-pearl-800">
                <strong className="text-sm text-plum-700 dark:text-rosewood-400">{money(product.price)}</strong>
                <div className="flex gap-1">
                  {account.can_change && <>
                    <button data-tooltip={product.active ? 'غیرفعال کردن' : 'فعال کردن'} aria-label="نمایش محصول" aria-pressed={product.active} disabled={busy} onClick={() => onAction(product, product.active ? 'hide' : 'show')} className="rounded-xl p-2 text-plum-600 disabled:opacity-40 dark:text-plum-300">
                      {product.active ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button data-tooltip="ویرایش محصول" aria-label="ویرایش محصول" className="rounded-xl bg-plum-50 p-2 text-plum-600 dark:bg-plum-950/40 dark:text-plum-300" onClick={() => onEdit(product.id)}><Edit2 size={15} /></button>
                  </>}
                  {account.can_delete && <button data-tooltip="حذف محصول" aria-label="حذف محصول" disabled={busy} onClick={() => onAction(product, 'delete')} className="rounded-xl p-2 text-rose-500 disabled:opacity-40"><Trash2 size={15} /></button>}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      {rows.length ? <Pager data={{ total: filtered.length, pageSize }} page={currentPage} setPage={(update) => setPage(update(currentPage))} /> : <Empty>محصولی پیدا نشد.</Empty>}
    </div>
  );
}
