import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Droplets, Moon, Sun } from 'lucide-react';
import ProductImage from '../components/ProductImage.jsx';
import { formatPrice } from '../data/mockData.js';
import { productUrl } from '../data/productDetails.js';
import { buildSkincareRoutine, skinConcerns, skinTypes } from '../data/skincareRoutine.js';
import './SkincareRoutinePage.css';

const budgets = [[2_500_000, 'تا ۲٫۵ میلیون'], [3_500_000, 'تا ۳٫۵ میلیون'], [5_000_000, 'تا ۵ میلیون'], [Infinity, 'بدون سقف']];

function RoutineSchedule({ id, title, Icon, steps }) {
  return (
    <section className={`routine-schedule routine-schedule--${id}`} aria-labelledby={`routine-${id}-title`}>
      <h3 id={`routine-${id}-title`}><Icon size={20} aria-hidden="true" /> {title}</h3>
      <ol className="routine-steps">
        {steps.map(({ label, use, product, reason, frequency }, index) => (
          <li key={product.id}>
            <span className="routine-step-number" aria-hidden="true">{formatPrice(index + 1)}</span>
            <div className="routine-product-image" aria-hidden="true">
              <ProductImage src={product.image} alt="" loading="lazy" />
            </div>
            <div className="routine-step-copy">
              <div className="routine-step-heading">
                <h4>{label}</h4>
                <span className="routine-frequency">{frequency}</span>
              </div>
              <a href={productUrl(product)} className="routine-product-link">{product.title} <ArrowLeft size={14} aria-hidden="true" /></a>
              <p><strong>چرا این محصول؟</strong> {reason}</p>
              <p><strong>روش استفاده</strong> {use}</p>
            </div>
            <strong>{formatPrice(product.price)} تومان</strong>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function SkincareRoutinePage() {
  const [skin, setSkin] = useState('');
  const [concerns, setConcerns] = useState([]);
  const [budget, setBudget] = useState(3_500_000);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (!result) return;
    resultRef.current.focus({ preventScroll: true });
    resultRef.current.scrollIntoView({ block: 'start' });
  }, [result]);

  function toggleConcern(concern) {
    setResult(null);
    setConcerns(current => current.includes(concern) ? current.filter(item => item !== concern) : [...current, concern]);
  }

  return (
    <main className="arena-container routine-page flex-1" dir="rtl">
      <header className="routine-hero">
        <div>
          <h1 id="routine-title" tabIndex={-1}>روتین مراقبت پوستت را بساز</h1>
          <p>نوع پوست، دغدغه‌ها و بودجه‌ات را انتخاب کن تا روتین صبح و شب را به ترتیب مصرف ببینی.</p>
        </div>
        <img src="/images/articles/cover-hydration.webp" alt="" width="1440" height="960" />
      </header>

      <form className="routine-form" onSubmit={event => {
        event.preventDefault();
        if (skin) setResult(buildSkincareRoutine(skin, concerns, budget));
      }}>
        <fieldset>
          <legend>۱. نوع پوستت چیه؟</legend>
          <div className="routine-options">
            {skinTypes.map(([type, label]) => (
              <label key={type}>
                <input type="radio" name="routine-skin" value={type} required checked={skin === type}
                  onChange={() => { setSkin(type); setResult(null); }} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>۲. چه دغدغه‌هایی داری؟</legend>
          <p>می‌تونی چند مورد انتخاب کنی یا برای یک روتین پایه از این مرحله بگذری.</p>
          <div className="routine-options">
            {skinConcerns.map(([concern, label]) => (
              <label key={concern}>
                <input type="checkbox" checked={concerns.includes(concern)} onChange={() => toggleConcern(concern)} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>۳. سقف بودجه‌ات چقدره؟ <small>تومان</small></legend>
          <div className="routine-options">
            {budgets.map(([amount, label]) => (
              <label key={amount}>
                <input type="radio" name="routine-budget" checked={budget === amount}
                  onChange={() => { setBudget(amount); setResult(null); }} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" className="account-primary routine-submit">نمایش روتین <ArrowLeft size={17} aria-hidden="true" /></button>
      </form>

      {result && (
        <section ref={resultRef} tabIndex={-1} className="routine-result" aria-labelledby="routine-result-title">
          <div className="routine-result-header">
            <h2 id="routine-result-title">روتین پیشنهادی تو</h2>
            {result.routine && <strong>جمع محصولات بدون تکرار {formatPrice(result.routine.total)} تومان</strong>}
          </div>
          {result.routine ? (
            <>
              {result.serumAvailable && !result.routine.includesSerum && (
                <p className="routine-note">برای اینکه مراحل پایه در بودجه جا بگیرند، سرم در این روتین پیشنهاد نشده.</p>
              )}
              {concerns.includes('dullness') && <p className="routine-note">برای کدری یا ناهماهنگی رنگ، محافظت روزانه در برابر آفتاب را در اولویت بگذار. این روتین محصولی برای درمان لک پیشنهاد نمی‌دهد.</p>}
              <RoutineSchedule id="morning" title="روتین صبح" Icon={Sun} steps={result.routine.morning} />
              <RoutineSchedule id="evening" title="روتین شب" Icon={Moon} steps={result.routine.evening} />
            </>
          ) : (
            <p className="routine-note" role="status"><Droplets size={18} aria-hidden="true" />
              {Number.isFinite(result.minimum)
                ? `با این بودجه روتین پایه کامل نمی‌شود. ارزان‌ترین ترکیب مناسب در کاتالوگ ${formatPrice(result.minimum)} تومان است.`
                : 'برای این انتخاب، موجودی فعلی برای تکمیل روتین کافی نیست.'}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
