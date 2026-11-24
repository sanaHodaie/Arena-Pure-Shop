import React from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import ProductImage from './ProductImage.jsx';
import { formatPrice } from '../data/mockData.js';
import { productUrl } from '../data/productDetails.js';
import '../pages/SkincareRoutinePage.css';

function RoutineSchedule({ id, title, Icon, steps, onReplace, showAlternativeFor }) {
  return (
    <section className={`routine-schedule routine-schedule--${id}`} aria-labelledby={`routine-${id}-title`}>
      <h3 id={`routine-${id}-title`}><Icon size={20} aria-hidden="true" /> {title}</h3>
      <ol className="routine-steps">
        {steps.map(({ label, use, product, reason, frequency, key, alternative }, index) => (
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
              {!product.unlisted ? (
                <a href={productUrl(product)} className="routine-product-link">{product.title} <ArrowLeft size={14} aria-hidden="true" /></a>
              ) : <span className="routine-product-link">{product.title}</span>}
              <p><strong>چرا این محصول؟</strong> {reason}</p>
              <p><strong>روش استفاده</strong> {use}</p>
              {!product.inStock && <p className="account-error">این محصول در حال حاضر موجود نیست.</p>}
              {alternative && onReplace && showAlternativeFor(key) && (
                <details className="routine-alternative">
                  <summary>جایگزین ارزان‌تر · {formatPrice(product.price - alternative.product.price)} تومان کمتر</summary>
                  <a href={productUrl(alternative.product)}>{alternative.product.title}</a>
                  <p>{alternative.reason}</p>
                  <button type="button" className="account-secondary" onClick={() => onReplace(key)}>انتخاب جایگزین</button>
                </details>
              )}
            </div>
            <strong>{formatPrice(product.price)} تومان</strong>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function RoutineSchedules({ routine, onReplace }) {
  return <>
    <RoutineSchedule id="morning" title="روتین صبح" Icon={Sun} steps={routine.morning}
      onReplace={onReplace} showAlternativeFor={() => true} />
    <RoutineSchedule id="evening" title="روتین شب" Icon={Moon} steps={routine.evening}
      onReplace={onReplace} showAlternativeFor={key => !routine.morning.some(step => step.key === key)} />
  </>;
}
