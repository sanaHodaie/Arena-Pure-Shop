import React from 'react';
import {ArrowLeft} from 'lucide-react';
export default function DashboardPoster({name,onOpen}) {
 return <section className="dashboard-poster" aria-label="خوشامد داشبورد"><div className="dashboard-poster-copy">
  <p>👋 {name?`سلام ${name}؛ به آرنا پیور خوش آمدید`:'به آرنا پیور خوش آمدید'}</p><h2>مدیریت فروشگاه، از یک نگاه</h2>
  <p>محصولات، قیمت‌ها و موجودی آرنا پیور را از همین پنل مدیریت کنید.</p>
  {onOpen&&<button onClick={onOpen}>مدیریت محصولات<ArrowLeft size={16}/></button>}
 </div><img src="/assets/admin/dashboard-poster.webp" alt="" width="760" height="507"/></section>;
}
