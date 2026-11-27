import React from 'react';
export default function Invoice({order:o}) {
const money=n=>Number(n||0).toLocaleString('fa-IR'), b=o.buyer||{};
return <section className="arena-invoice" dir="rtl" style={{background:'#fff',color:'#302338',padding:20,border:'1px solid #decde4',borderRadius:16,marginBlock:16}}>
<h2>فاکتور آزمایشی آرنا پیور</h2><p>شماره: AP-{o.id} | تاریخ: {new Date(o.createdAt).toLocaleString('fa-IR')}</p>
<p>فروشنده: {o.seller} | واحد پول: تومان</p><p>خریدار: {[b.firstName,b.lastName].filter(Boolean).join(' ')||'ثبت نشده'} | تلفن: {o.phone}</p>
<p>نشانی: {[b.province,b.city,b.address].filter(Boolean).join('، ')||'ثبت نشده'} | کد پستی: {b.postalCode||'ثبت نشده'}</p>
<table style={{width:'100%',textAlign:'right'}}><thead><tr>{['ردیف','شرح کالا','تعداد','قیمت واحد','مبلغ'].map(t=><th key={t}>{t}</th>)}</tr></thead><tbody>{o.items.map((i,n)=><tr key={i.id}><td>{n+1}</td><td>{i.title}</td><td>{money(i.quantity)}</td><td>{money(i.price)}</td><td>{money(i.price*i.quantity)}</td></tr>)}</tbody></table>
<p>جمع: {money(o.subtotal)} | تخفیف: {money(o.discount)} | مالیات محاسبه‌شده: {money(o.tax)} | ارسال: {money(o.shipping)}</p><strong>قابل پرداخت: {money(o.total)} تومان</strong>
<p>وضعیت: {({pending:'منتظر پرداخت آزمایشی',successful:'پرداخت آزمایشی موفق',failed:'ناموفق',cancelled:'لغوشده'})[o.status]} | شناسه: {o.reference}</p>
<p>خرید آزمایشی است؛ وجهی دریافت نشده و سند مالیاتی رسمی نیست.</p><button type="button" onClick={()=>window.print()}>چاپ / ذخیره PDF</button></section>;
}
