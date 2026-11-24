import React from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { formatPrice } from '../data/mockData.js';
import { getRoutinePlacement, readCustomerRoutine } from '../data/skincareRoutine.js';

const timing = { morning: ['صبح', Sun], evening: ['شب', Moon] };
const order = {
  cleanser: 'اول روتین، پیش از سرم و مرطوب‌کننده',
  serum: 'بعد از شوینده و قبل از مرطوب‌کننده',
  moisturizer: 'بعد از سرم یا شوینده',
  sunscreen: 'آخرین مرحلهٔ روتین صبح',
};

export default function ProductRoutinePlacement({ product, accountPhone, onSaveRoutine }) {
  let routine = null;
  let readError = false;
  if (accountPhone) {
    try { routine = readCustomerRoutine(accountPhone); }
    catch { readError = true; }
  }

  const placement = getRoutinePlacement(product, routine);
  if (!placement) return null;
  const { schedule, existing, next, alreadyIncluded, compatible } = placement;
  const difference = next ? next.total - routine.total : 0;

  return (
    <section className="pd-routine-placement" aria-labelledby="pd-routine-placement-title">
      <h2 id="pd-routine-placement-title">این محصول کجای روتینم جا می‌گیره؟</h2>
      <p>{schedule[0].label} · {order[schedule[0].key]}</p>
      <ul>
        {schedule.map(({ period, frequency }) => {
          const [label, Icon] = timing[period];
          return <li key={period}><Icon size={16} aria-hidden="true" /> {label} · {frequency}</li>;
        })}
      </ul>
      {readError && <p role="alert">خواندن روتین ذخیره‌شده ممکن نیست.</p>}
      {alreadyIncluded && <p>این محصول در روتین ذخیره‌شده‌ات هست.</p>}
      {routine && !compatible && !alreadyIncluded && <p>طبق انتخاب‌های روتینت، این محصول برای جایگزینی در این مرحله پیشنهاد نمی‌شود.</p>}
      {routine && !product.inStock && !alreadyIncluded && <p>این محصول فعلاً موجود نیست.</p>}
      {!routine && !readError && <a className="pd-routine-link" href="/skincare-routine">ساخت روتین شخصی <ArrowLeft size={16} aria-hidden="true" /></a>}
      {next && (
        <div className="pd-routine-preview">
          <p>{existing.length ? 'جایگزینِ ' + existing.map(item => item.title).join('، ') : 'این مرحله به روتین ذخیره‌شده‌ات اضافه می‌شود.'}</p>
          <p><strong>جمع جدید {formatPrice(next.total)} تومان</strong> · {difference === 0 ? 'بدون تغییر قیمت' : `${formatPrice(Math.abs(difference))} تومان ${difference > 0 ? 'بیشتر' : 'کمتر'}`}</p>
          <button type="button" className="account-secondary" onClick={() => onSaveRoutine(next)}>
            {existing.length ? 'جایگزین در روتین من' : 'افزودن به روتین من'}
          </button>
        </div>
      )}
    </section>
  );
}
