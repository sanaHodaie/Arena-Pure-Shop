import React from 'react';
import { ArrowLeft, Sparkles, Droplets } from 'lucide-react';
const campaigns = [
  { id: 'matte-collection', category: 'cosmetics', eyebrow: 'کالکشن آرایش مات', title: ['زیبایی بی‌پایان،', 'که لایقش هستی!'], description: 'از رنگ‌های ملایم تا جلوه‌های خاص؛ آرایش دلخواهت را با انتخاب‌های دوست‌داشتنی کامل کن.', action: 'کشف محصولات آرایشی', Icon: Sparkles },
  { id: 'daily-skincare', category: 'skincare', eyebrow: 'مراقبت روزانه پوست', title: ['طراوتی تازه،', 'برای هر روز تو.'], description: 'پاک‌سازی، آبرسانی و مراقبت؛ برای لحظه‌هایی که به خودت اختصاص می‌دهی.', action: 'کشف روتین مراقبت پوست', Icon: Droplets },
];
export default function MiddleBanners({ onShopClick }) {
  return <section className="arena-container middle-campaigns" aria-label="کالکشن‌های زیبایی و مراقبت">
    {campaigns.map(({ id, category, eyebrow, title, description, action, Icon }) => <article className={`middle-campaign campaign-${id}`} key={id}>
      <img className="middle-campaign-art" src={`/images/banners/${id}.webp`} alt="" width="1600" height="800" loading="lazy" decoding="async"/>
      <div className="middle-campaign-copy">
        <span className="middle-campaign-eyebrow"><Icon size={14}/>{eyebrow}</span>
        <h2>{title[0]}<br/>{title[1]}</h2>
        <p>{description}</p>
        <button className="arena-shop" onClick={() => onShopClick(category)}>{action}<ArrowLeft size={16}/></button>
      </div>
    </article>)}
  </section>;
}
