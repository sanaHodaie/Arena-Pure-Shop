import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bookmark, Droplets, ShoppingBag, Sparkles, X } from 'lucide-react';
import RoutineSchedules from '../components/RoutineSchedules.jsx';
import { formatPrice } from '../data/mockData.js';
import { buildSkincareRoutine, replaceRoutineProduct, skinConcerns, skinTypes } from '../data/skincareRoutine.js';

const budgets = [[2_500_000, 'تا ۲٫۵ میلیون'], [3_500_000, 'تا ۳٫۵ میلیون'], [5_000_000, 'تا ۵ میلیون'], [Infinity, 'بدون سقف']];

function MissingSkinDialog({ onClose, onChoose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog ref={ref} className="routine-validation" dir="rtl" aria-labelledby="routine-validation-title"
      aria-describedby="routine-validation-message"
      onCancel={event => { event.preventDefault(); onClose(); }}>
      <button type="button" className="routine-validation-close" aria-label="بستن پیام" onClick={onClose}><X size={20} /></button>
      <span className="routine-validation-icon" aria-hidden="true"><Sparkles size={24} /></span>
      <h2 id="routine-validation-title">اول نوع پوستت رو انتخاب کن</h2>
      <p id="routine-validation-message">با شناخت نوع پوستت می‌تونیم روتین صبح و شب مناسب‌تری پیشنهاد بدیم. اگر نمی‌دونی، گزینهٔ «مطمئن نیستم» رو بزن.</p>
      <button type="button" className="account-primary" onClick={onChoose}>انتخاب نوع پوست <ArrowLeft size={16} aria-hidden="true" /></button>
    </dialog>
  );
}

export default function SkincareRoutinePage({ draft, onDraftChange, onSaveRoutine, onAddRoutineToCart }) {
  const { skin, concerns, budget, result } = draft;
  const [revision, setRevision] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const resultRef = useRef(null);
  const firstSkinInput = useRef(null);

  useEffect(() => {
    if (!revision || !resultRef.current) return;
    resultRef.current.focus({ preventScroll: true });
    resultRef.current.scrollIntoView({ block: 'start' });
  }, [revision]);

  function updateDraft(fields) {
    onDraftChange(current => ({ ...current, ...fields }));
  }

  function toggleConcern(concern) {
    updateDraft({
      result: null,
      concerns: concerns.includes(concern) ? concerns.filter(item => item !== concern) : [...concerns, concern],
    });
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

      <form className="routine-form" noValidate onSubmit={event => {
        event.preventDefault();
        if (!skin) {
          setShowValidation(true);
          return;
        }
        updateDraft({ result: buildSkincareRoutine(skin, concerns, budget) });
        setRevision(value => value + 1);
      }}>
        <fieldset>
          <legend>۱. نوع پوستت چیه؟</legend>
          <div className="routine-options">
            {skinTypes.map(([type, label], index) => (
              <label key={type}>
                <input type="radio" name="routine-skin" value={type} required checked={skin === type}
                  ref={index === 0 ? firstSkinInput : undefined}
                  onChange={() => updateDraft({ skin: type, result: null })} />
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
                  onChange={() => updateDraft({ budget: amount, result: null })} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" className="account-primary routine-submit">نمایش روتین <ArrowLeft size={17} aria-hidden="true" /></button>
      </form>

      {result && (
        <section id="routine-result" ref={resultRef} tabIndex={-1} className="routine-result" aria-labelledby="routine-result-title">
          <div className="routine-result-header">
            <h2 id="routine-result-title">روتین پیشنهادی تو</h2>
            {result.routine && <strong aria-live="polite">جمع محصولات بدون تکرار {formatPrice(result.routine.total)} تومان</strong>}
          </div>
          {result.routine ? (
            <>
              {result.serumAvailable && !result.routine.includesSerum && (
                <p className="routine-note">برای اینکه مراحل پایه در بودجه جا بگیرند، سرم در این روتین پیشنهاد نشده.</p>
              )}
              {concerns.includes('dullness') && <p className="routine-note">برای کدری یا ناهماهنگی رنگ، محافظت روزانه در برابر آفتاب را در اولویت بگذار. این روتین محصولی برای درمان لک پیشنهاد نمی‌دهد.</p>}
              <div className="routine-actions">
                <button type="button" className="account-primary" onClick={() => onAddRoutineToCart(result.routine)}><ShoppingBag size={17} aria-hidden="true" /> افزودن کل روتین به سبد</button>
                <button type="button" className="account-secondary" onClick={() => onSaveRoutine(result.routine)}><Bookmark size={17} aria-hidden="true" /> ذخیرهٔ روتین من</button>
              </div>
              <RoutineSchedules routine={result.routine} onReplace={key => updateDraft({
                result: { ...result, routine: replaceRoutineProduct(result.routine, key) },
              })} />
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
      {showValidation && <MissingSkinDialog onClose={() => setShowValidation(false)} onChoose={() => {
        setShowValidation(false);
        requestAnimationFrame(() => firstSkinInput.current?.focus());
      }} />}
    </main>
  );
}
