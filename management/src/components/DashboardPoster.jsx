import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function DashboardPoster({ name, onOpen }) {
  return (
    <section className="dashboard-poster" aria-label="خوشامد داشبورد">
      <img src="/assets/admin/dashboard-beauty.webp" alt="" width="1680" height="560" />
      <div className="dashboard-poster-copy">
        <p>{name ? `سلام ${name}، به آرنا پیور خوش آمدید` : 'به آرنا پیور خوش آمدید'}</p>
        <h2>مدیریت فروشگاه، از یک نگاه</h2>
        <p>محصولات، قیمت‌ها و موجودی آرنا پیور را از همین پنل مدیریت کنید.</p>
        {onOpen && <button type="button" onClick={onOpen}>مدیریت محصولات <ArrowLeft size={16} /></button>}
      </div>
    </section>
  );
}
