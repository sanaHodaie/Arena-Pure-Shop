import React, { useEffect, useState } from 'react';
import { ArrowUpLeft, BookOpen, Check, ChevronDown, ExternalLink, HelpCircle, Info, ListChecks, MessageCircle, Plus, Sparkles, ScanFace } from 'lucide-react';
import { categoryNames } from '../data/productDetails.js';
import { productSuitability } from '../data/productSuitability.js';
import './ProductInformation.css';

const suitabilityTitle = 'این محصول برای من مناسبه؟';

const sections = [
  { id: 'product-introduction', label: 'معرفی محصول', Icon: BookOpen },
  { id: 'product-suitability', label: suitabilityTitle, Icon: ScanFace },
  { id: 'product-specifications', label: 'مشخصات محصول', Icon: ListChecks },
  { id: 'product-usage', label: 'روش مصرف و ترکیبات', Icon: Sparkles, ScanFace },
  { id: 'product-questions', label: 'پرسش‌های متداول', Icon: HelpCircle },
  { id: 'product-reviews', label: 'دیدگاه خریداران', Icon: MessageCircle },
];

function PanelHeader({ sectionId, children, subtitle }) {
  const { Icon } = sections.find(section => section.id === sectionId);
  return <header className="pi-panel-header"><span className="pi-panel-icon"><Icon size={21} strokeWidth={1.5}/></span><div><h2>{children}</h2>{subtitle && <p>{subtitle}</p>}</div></header>;
}

export default function ProductInformation({ product, details }) {
  const [active, setActive] = useState(sections[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-10% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => { const element = document.getElementById(section.id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  const questions = [
    { question: details.shade ? 'آیا محصول دریافتی همین رنگ است؟' : 'این صفحه مربوط به کدام مدل است؟', answer: details.shade ? `رنگ انتخاب‌شده ${details.shade} است و با همین نام به سبد اضافه می‌شود. توجه داشته باشید که نمایش رنگ در نمایشگرهای مختلف متفاوت است.` : `این صفحه مخصوص ${product.englishName} است. برای تطبیق نسخه، نام کامل مدل روی بسته‌بندی را بررسی کنید.` },
    { question: 'از کجا ترکیبات دقیق را بررسی کنم؟', answer: 'فهرست ترکیبات روی بسته‌بندی همان کالای عرضه‌شده مرجع اصلی است؛ فرمول‌ها ممکن است در بازارها یا زمان‌های مختلف تغییر کنند. منبع محصول نیز در بخش معرفی در دسترس است.' },
    { question: 'چطور این محصول را به سبد اضافه کنم؟', answer: 'تعداد دلخواه را در بالای صفحه انتخاب کنید و «افزودن به سبد خرید» را بزنید. اگر محصول چند رنگ دارد، ابتدا رنگ موردنظرتان را انتخاب کنید. در موبایل دکمه خرید پایین صفحه هم در دسترس است.' },
  ];

  return <section className="product-information" aria-label="راهنمای شناخت محصول">
    <div className="pi-heading"><div><span>جزئیات، برای انتخاب بهتر</span><h2>محصولت را بهتر بشناس</h2></div><span className="pi-heading-line" aria-hidden="true"/></div>
    <div className="pi-layout">
      <aside className="pi-sidebar"><div className="pi-sidebar-inner"><span className="pi-sidebar-caption">در این صفحه</span><nav aria-label="بخش‌های اطلاعات محصول">{sections.map(({ id, label, Icon }) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setActive(id)}><Icon size={17}/><span>{label}</span>{id === 'product-reviews' ? <small>۰</small> : <ArrowUpLeft size={13} className="pi-nav-arrow"/>}</a>)}</nav><p className="pi-sidebar-note"><Info size={15}/> مشخصات هر نسخه را با بسته‌بندی آن تطبیق دهید.</p></div></aside>
      <div className="pi-content">
        <section id="product-introduction" className="pi-panel">
          <PanelHeader sectionId="product-introduction" subtitle="نگاهی نزدیک‌تر به انتخاب شما">معرفی محصول</PanelHeader>
          <div className="pi-introduction"><span className="pi-brand-pill">{product.brand}</span><h3>{product.title}</h3><p>{product.title} در دسته {categoryNames[product.category]} قرار دارد.{details.shade ? ` این صفحه مربوط به رنگ ${details.shade} است؛ پیش از خرید، شماره و نام رنگ را بررسی کنید.` : ' نام انگلیسی و مدل درج‌شده در مشخصات، به شما کمک می‌کند نسخه موردنظر را دقیق‌تر شناسایی کنید.'}</p></div>
          {product.sourceUrl && <a className="pi-source" href={product.sourceUrl} target="_blank" rel="noopener noreferrer"><span><ExternalLink size={17}/> منبع اطلاعات محصول</span><ArrowUpLeft size={17}/></a>}
        </section>
        <section id="product-suitability" className="pi-panel pi-suitability">
          <PanelHeader sectionId="product-suitability">{suitabilityTitle}</PanelHeader>
          <p className="pi-suitability-copy">{(product.suitability ?? productSuitability[product.id]) || 'راهنمای انتخاب این مدل هنوز ثبت نشده است.'}</p>
        </section>
        <section id="product-specifications" className="pi-panel">
          <PanelHeader sectionId="product-specifications" subtitle="اطلاعات کلیدی، یک‌جا و خوانا">مشخصات محصول</PanelHeader>
          <dl className="pi-specs">{details.specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd dir="auto">{value}</dd></div>)}</dl>
          <details className="pi-pack-note"><summary><span><Info size={16}/> اطلاعات تکمیلی بسته‌بندی</span><ChevronDown size={16}/></summary><p>حجم، کشور سازنده و فهرست ترکیبات این موجودی هنوز ثبت نشده‌اند. این موارد باید با بسته‌بندی کالای عرضه‌شده تطبیق داده شوند.</p></details>
        </section>
        <section id="product-usage" className="pi-panel">
          <PanelHeader sectionId="product-usage" subtitle="قبل از استفاده، برچسب محصول را بخوانید">روش مصرف و ترکیبات</PanelHeader>
          <div className="pi-guide-grid"><div><span className="pi-guide-number">۰۱</span><h3>روش مصرف</h3><p>دستور استفاده و هشدارهای روی بسته‌بندی همین مدل را مبنا قرار دهید.</p></div><div><span className="pi-guide-number">۰۲</span><h3>فهرست ترکیبات</h3><p>ترکیبات نسخه عرضه‌شده پس از بررسی برچسب محصول در این بخش تکمیل می‌شود.</p></div></div>
          <p className="pi-guide-note"><Check size={15}/> برای انتخاب آگاهانه، اطلاعات تأییدنشده درج نمی‌کنیم.</p>
        </section>
        <section id="product-questions" className="pi-panel">
          <PanelHeader sectionId="product-questions" subtitle="پاسخ کوتاه به سؤال‌های رایج">پرسش‌های متداول</PanelHeader>
          <div className="pi-questions">{questions.map(({ question, answer }) => <details key={question}><summary>{question}<Plus size={18}/></summary><p>{answer}</p></details>)}</div>
        </section>
        <section id="product-reviews" className="pi-panel">
          <PanelHeader sectionId="product-reviews" subtitle="تجربه‌های مربوط به همین محصول">دیدگاه خریداران</PanelHeader>
          <div className="pi-reviews-empty"><span><MessageCircle size={26} strokeWidth={1.3}/></span><div><h3>هنوز تجربه‌ای ثبت نشده</h3><p>پس از ثبت دیدگاه برای این محصول، تجربه خریداران اینجا نمایش داده می‌شود.</p><small>۰ دیدگاه</small></div></div>
        </section>
      </div>
    </div>
  </section>;
}
