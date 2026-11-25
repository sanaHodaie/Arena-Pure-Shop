import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { request } from '../api';

export const controlStyle = 'w-full rounded-2xl border border-plum-100 bg-pearl-50 p-3 text-sm dark:border-pearl-700 dark:bg-pearl-800 focus:outline-plum-500';

export default function CatalogDialog({ item, onClose, onSaved }) {
  const dialog = useRef(null);
  const upload = item === 'workbook';
  const path = upload ? 'workbook/' : `products/${item}/`;
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    dialog.current.showModal();
    if (upload) return;
    let current = true;
    request(path).then((payload) => { if (current) setData(payload); })
      .catch((error) => { if (current) setMessage(error.message); });
    return () => { current = false; };
  }, [path, upload]);

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setErrors({});
    setMessage('');
    try {
      const result = await request(path, new FormData(event.currentTarget));
      onSaved(upload ? `${new Intl.NumberFormat('fa').format(result.count)} محصول وارد شد.` : 'محصول ذخیره شد.');
    } catch (error) {
      setErrors(error.fields || {});
      setMessage(error.fields ? 'فیلدهای مشخص‌شده را بررسی کنید.' : error.message);
      dialog.current?.scrollTo({ top: 0 });
    } finally {
      setPending(false);
    }
  }

  return (
    <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); if (!pending) onClose(); }}
      aria-labelledby="dialog-title"
      className="m-auto max-h-[90dvh] w-[min(94vw,54rem)] overflow-auto rounded-3xl border border-plum-200 bg-white p-5 text-pearl-900 shadow-2xl backdrop:bg-pearl-950/60 backdrop:backdrop-blur-sm dark:border-plum-900 dark:bg-pearl-900 dark:text-white sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id="dialog-title" className="text-xl font-black">{upload ? 'ورود محصولات از اکسل' : item === 'new' ? 'افزودن محصول' : 'ویرایش محصول'}</h2>
        <button onClick={onClose} disabled={pending} aria-label="بستن" className="rounded-xl bg-pearl-100 p-2 dark:bg-pearl-800"><X size={18} /></button>
      </div>
      {message && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-200">{message}</p>}
      <form onSubmit={submit} className="space-y-5">
        {upload && <div className="space-y-3">
          <a className="inline-block text-sm font-bold text-plum-700 underline dark:text-plum-300" href="/api/management/workbook/">دریافت فایل نمونه</a>
          <p className="text-xs text-pearl-500 dark:text-pearl-400">فرمت XLSX، حداکثر ۲ مگابایت و ۱۰۰۰ ردیف. برای دسته‌بندی از شناسهٔ دسته در فایل نمونه استفاده کنید.</p>
          <input type="file" required name="workbook" aria-label="فایل اکسل محصولات" accept=".xlsx" className={controlStyle} />
        </div>}
        {!upload && !data && !message && <p role="status">در حال دریافت اطلاعات محصول…</p>}
        {data?.image && <img src={data.image} alt="تصویر فعلی محصول" className="size-24 rounded-2xl border border-plum-100 object-contain" />}
        {data && <div className="grid gap-4 sm:grid-cols-2">
          {data.fields.map((field) => <Field key={field.name} field={field} errors={errors[field.name]} />)}
        </div>}
        {errors.__all__?.map((error) => <p key={error} role="alert" className="text-rose-600">{error}</p>)}
        {(upload || data) && <button disabled={pending} className="rounded-2xl bg-gradient-to-r from-plum-600 to-rosewood-600 px-6 py-3 text-sm font-bold text-white disabled:opacity-60">
          {pending ? 'در حال ارسال…' : upload ? 'بارگذاری و ورود محصولات' : 'ذخیرهٔ محصول'}
        </button>}
      </form>
    </dialog>
  );
}

function Field({ field, errors }) {
  const { name, label, type, value, required, choices, help } = field;
  const attributes = { id: 'field-' + name, name, required, 'aria-invalid': Boolean(errors), className: controlStyle };
  return (
    <div className={type === 'textarea' ? 'sm:col-span-2' : ''}>
      <label htmlFor={attributes.id} className="mb-1 block text-xs font-bold">{label}</label>
      {type === 'select' && <select {...attributes} defaultValue={value ?? ''}>{choices.map((choice) => <option key={choice.value} value={choice.value}>{choice.label}</option>)}</select>}
      {type === 'textarea' && <textarea {...attributes} rows={3} defaultValue={value ?? ''} dir={['extra', 'faq'].includes(name) ? 'ltr' : 'auto'} />}
      {type === 'checkbox' && <input {...attributes} type="checkbox" value="true" className="size-4 accent-plum-600" defaultChecked={Boolean(value)} />}
      {type === 'file' && <input {...attributes} type="file" accept="image/jpeg,image/png,image/webp" />}
      {!['select', 'textarea', 'checkbox', 'file'].includes(type) && <input {...attributes} type={type} defaultValue={value ?? ''} min={type === 'number' ? 0 : undefined} />}
      {help && <p className="mt-1 text-xs text-pearl-500 dark:text-pearl-400">{help}</p>}
      {errors?.map((error) => <p key={error} className="mt-1 text-xs text-rose-600 dark:text-rose-300">{error}</p>)}
    </div>
  );
}
