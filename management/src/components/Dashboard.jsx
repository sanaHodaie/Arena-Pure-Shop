import React from 'react';
import { motion } from 'motion/react';
import { Boxes, Eye, Layers, Package, PlusCircle, Sparkles } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import { AnimatedDonutChart } from './AnimatedChart';
import { toPersianDigits } from '../utils/formatters';

export default function Dashboard({ products, categories, onAdd, onProducts }) {
  const active = products.filter((product) => product.active).length;
  const colors = ['#9333ea', '#db2777', '#6366f1', '#0891b2', '#a21caf', '#d97706', '#0f766e'];
  const chart = categories.filter((category) => category.product_count).map((category, index) => ({
    name: category.title, value: category.product_count, color: colors[index % colors.length],
  }));
  const metrics = [
    ['کل محصولات', products.length, Package],
    ['نمایش در فروشگاه', active, Eye],
    ['محصولات ناموجود', products.filter((product) => product.stock === 0).length, Boxes],
  ];
  const date = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { dateStyle: 'full', timeZone: 'Asia/Tehran' }).format();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="inline-block rounded-full border border-purple-200 bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">{date}</span>
          <h1 className="text-2xl font-black md:text-3xl">داشبورد اصلی آرنا پیور</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {onAdd && <motion.button whileTap={{ scale: 0.97 }} onClick={onAdd} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg"><PlusCircle size={16} /> افزودن محصول</motion.button>}
          <button onClick={onProducts} className="glass-panel px-4 py-2.5 text-xs font-bold">مشاهدهٔ ویترین</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <section className="bento-card space-y-4 p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold"><Layers size={18} className="text-purple-500" /> وضعیت کاتالوگ</h2>
          {metrics.map(([label, value, Icon]) => <div key={label} className="bento-card-subtle flex justify-between gap-2 p-3 text-xs">
            <span className="flex items-center gap-2"><Icon size={15} />{label}</span><strong>{toPersianDigits(value)}</strong>
          </div>)}
        </section>
        <section className="bento-card space-y-5 p-5 lg:col-span-2">
          <h2 className="text-sm font-bold">سهم دسته‌ها از محصولات فعال</h2>
          {chart.length ? <AnimatedDonutChart data={chart} /> : <p className="text-sm text-slate-500">محصول فعالی ثبت نشده است.</p>}
        </section>
        <div className="grid gap-4">
          <div className="rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 p-5 text-white shadow-lg shadow-purple-500/20">
            <p className="mb-2 flex justify-between gap-2 text-xs">مجموع موجودی انبار <Sparkles size={16} /></p>
            <strong className="text-2xl"><AnimatedCounter value={products.reduce((sum, product) => sum + product.stock, 0)} suffix=" عدد" /></strong>
          </div>
          <div className="bento-card p-5">
            <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">دسته‌بندی‌ها</p>
            <strong className="text-xl">{toPersianDigits(categories.length)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
