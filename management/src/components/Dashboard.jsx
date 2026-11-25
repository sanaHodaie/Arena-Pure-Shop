import React from 'react';
import { ArrowLeft, Boxes, Eye, Package, Wallet } from 'lucide-react';
import { AnimatedDonutChart } from './AnimatedChart';
import DashboardPoster from './DashboardPoster';
import { Button, Heading, Panel, number } from './ManagementUI';

const colors = ['#9333ea', '#db2777', '#6366f1', '#0891b2', '#a21caf', '#d97706', '#0f766e'];

export default function Dashboard({ products, categories, name, onProducts, onRefresh }) {
  const active = products.filter((product) => product.active);
  const chart = categories.filter((category) => category.product_count).map((category, index) => ({
    name: category.title, value: category.product_count, color: colors[index % colors.length],
  }));
  const metrics = [
    [Package, 'کل محصولات', products.length],
    [Eye, 'نمایش در فروشگاه', active.length],
    [Boxes, 'محصولات ناموجود', products.filter((product) => product.stock === 0).length],
    [Wallet, 'تعداد کالا در انبار', products.reduce((sum, product) => sum + product.stock, 0)],
  ];

  return (
    <div className="space-y-6">
      <Heading title="داشبورد مدیریت آرنا پیور" subtitle="وضعیت محصولات و موجودی کاتالوگ فروشگاه">
        <Button secondary onClick={onRefresh}>به‌روزرسانی آمار</Button>
      </Heading>
      <DashboardPoster name={name} onOpen={onProducts} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([Icon, label, value]) => <Panel key={label} className="space-y-4">
          <span className="inline-flex rounded-2xl bg-purple-100 p-3 text-purple-600 dark:bg-purple-950 dark:text-purple-300"><Icon size={22} /></span>
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          <strong className="text-xl font-black sm:text-2xl">{number(value)}</strong>
        </Panel>)}
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <h2 className="mb-6 font-bold">سهم دسته‌ها از محصولات فعال</h2>
          {chart.length ? <AnimatedDonutChart data={chart} /> : <p className="text-sm text-slate-500">محصول فعالی ثبت نشده است.</p>}
        </Panel>
        <Panel>
          <h2 className="mb-4 font-bold">پیگیری موجودی</h2>
          <p className="mb-4 text-sm">{number(active.filter((product) => product.stock < 5).length)} محصول فعال کمتر از ۵ عدد موجودی دارد.</p>
          <Button secondary onClick={onProducts}>مدیریت محصولات <ArrowLeft size={14} className="inline" /></Button>
        </Panel>
      </div>
    </div>
  );
}
