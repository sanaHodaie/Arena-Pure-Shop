import React, { useEffect, useState } from 'react';
import { request, post } from '../api';
import { Button, ErrorBox, Heading, Panel, inputClass } from './ManagementUI';

const displayDate = (value) => new Date(value).toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' });

function useRows(endpoint) {
  const [resource, setResource] = useState(null);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setResource(null);
    setError('');
    request(endpoint).then((data) => { if (active) setResource(data); })
      .catch((failure) => { if (active) setError(failure.message); });
    return () => { active = false; };
  }, [endpoint, version]);
  return { resource, error, refresh: () => setVersion((value) => value + 1) };
}

function RowStatus({ resource, error, refresh }) {
  return error ? <><ErrorBox message={error} /><Button secondary onClick={refresh}>تلاش دوباره</Button></>
    : !resource && <p role="status">در حال دریافت اطلاعات…</p>;
}

export function Articles({ account }) {
  const rows = useRows('articles/');
  const [selection, setSelection] = useState(null);
  const [notice, setNotice] = useState('');
  return <div className="space-y-4">
    <Heading title="خواندنی‌ها" subtitle="مقاله‌های صفحهٔ اصلی و صفحهٔ هر مطلب">
      {account.articleAdd && <Button onClick={() => setSelection({ author: account.username, published: true })}>مقالهٔ جدید</Button>}
    </Heading>
    {notice && <p role="status">{notice}</p>}
    <RowStatus {...rows} />
    {selection && <ArticleEditor key={selection.id || 'new'} article={selection}
      categories={rows.resource?.categories || []} onCancel={() => setSelection(null)} onSaved={() => {
        setSelection(null); setNotice('مقاله ذخیره شد.'); rows.refresh();
      }} />}
    {rows.resource?.articles.map((article) => <Panel key={article.id} className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="font-bold">{article.title}</h2><p className="text-xs text-pearl-500 dark:text-pearl-300">
        {article.author} · {article.published ? 'منتشر شده' : 'پیش‌نویس'}
      </p></div>
      {account.articleChange && <Button secondary onClick={() => setSelection(article)}>ویرایش</Button>}
    </Panel>)}
  </div>;
}

const articleFields = [
  ['title', 'عنوان', 220, 'title'], ['author', 'نام نویسنده', 120, 'author'],
  ['date_label', 'تاریخ نمایشی', 45, 'date'], ['read_time', 'زمان مطالعه', 45, 'readTime'],
  ['topic', 'موضوع پوستر', 140, 'topic'], ['summary', 'خلاصهٔ پوستر', 300, 'summary'],
  ['cover_image', 'آدرس تصویر پوستر', 500, 'image'], ['excerpt', 'چکیدهٔ کارت', 800, 'excerpt'],
];

function ArticleEditor({ article, categories, onCancel, onSaved }) {
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setError('');
    try {
      await request(`articles/${article.id || 'new'}/`, new FormData(event.currentTarget));
      onSaved();
    } catch (failure) {
      setError(failure.fields ? 'فیلدهای مشخص‌شده را بررسی کنید.' : failure.message);
      setErrors(failure.fields || {});
    } finally {
      setBusy(false);
    }
  }
  const defaultDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { dateStyle: 'medium', timeZone: 'Asia/Tehran' }).format();
  const values = { date: defaultDate, readTime: '۵ دقیقه', image: '/images/articles/cover-matte.webp', ...article, ...article.cover };
  const feedback = (key) => errors[key]?.map((text) => <small key={text} className="text-rose-700 dark:text-rose-300">{text}</small>);
  return <Panel>
    <Heading title={article.id ? 'ویرایش مقاله' : 'مقالهٔ جدید'} />
    <ErrorBox message={error} />
    {feedback('__all__')}
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
      {articleFields.map(([name, label, length, key]) => <label key={name} className="grid gap-1 text-sm">
        {label}<input required name={name} className={inputClass} maxLength={length} defaultValue={values[key]} />
        {feedback(name)}
      </label>)}
      <label className="grid gap-1 text-sm">رنگ پوستر<select name="cover_theme" className={inputClass} defaultValue={values.theme || 'matte'}>
        <option value="matte">آلویی</option><option value="dry-skin">رز</option>
        <option value="hydration">آبی</option><option value="eyeliner">تیره</option>
      </select>{feedback('cover_theme')}</label>
      <label className="grid gap-1 text-sm">دستهٔ مرتبط<select name="related_category" className={inputClass} defaultValue={article.categoryId || ''}>
        <option value="">بدون دستهٔ مرتبط</option>
        {categories.map((category) => <option value={category.id} key={category.id}>{category.title}</option>)}
      </select>{feedback('related_category')}</label>
      <label className="grid gap-1 text-sm sm:col-span-2">متن کامل
        <textarea required rows={12} name="body" className={inputClass} maxLength={20000} defaultValue={article.body} />
        <small>برای عنوان بخش، ابتدای خط از «##» و یک فاصله استفاده کنید.</small>{feedback('body')}
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_published" defaultChecked={article.published} /> انتشار در سایت
      </label>
      <div className="flex gap-2 sm:col-span-2">
        <Button disabled={busy}>ذخیرهٔ مقاله</Button>
        <Button secondary disabled={busy} type="button" onClick={onCancel}>انصراف</Button>
      </div>
    </form>
  </Panel>;
}

const reviewStates = { pending: 'در انتظار بررسی', approved: 'تأییدشده', rejected: 'ردشده' };

export function Reviews({ account }) {
  const [status, setStatus] = useState('pending');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const rows = useRows(`reviews/?status=${status}`);
  async function moderate(id, value) {
    setBusy(true);
    setError('');
    try {
      await post(`reviews/${id}/`, { status: value });
      rows.refresh();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }
  return <div className="space-y-4">
    <Heading title="نظرات محصولات" subtitle="دیدگاه‌ها پس از تأیید در صفحهٔ محصول منتشر می‌شوند." />
    <div className="flex flex-wrap gap-2">{Object.entries(reviewStates).map(([key, label]) =>
      <Button key={key} secondary={key !== status} aria-pressed={key === status} onClick={() => { setStatus(key); setError(''); }}>{label}</Button>
    )}</div>
    <ErrorBox message={error} />
    <RowStatus {...rows} />
    {rows.resource?.reviews.length === 0 && <p>دیدگاهی با این وضعیت وجود ندارد.</p>}
    {rows.resource?.reviews.map((review) => <Panel key={review.id} className="space-y-3">
      <h2 className="font-bold">{review.name} · <a href={`/products/${review.slug}`}>{review.product}</a></h2>
      <time className="text-xs" dateTime={review.createdAt}>{displayDate(review.createdAt)}</time>
      <p className="whitespace-pre-wrap break-words">{review.body}</p>
      {account.reviewChange && <div className="flex gap-2">
        {status !== 'approved' && <Button disabled={busy} onClick={() => moderate(review.id, 'approved')}>تأیید و انتشار</Button>}
        {status !== 'rejected' && <Button disabled={busy} secondary onClick={() => moderate(review.id, 'rejected')}>رد دیدگاه</Button>}
      </div>}
    </Panel>)}
  </div>;
}

export function LoginLogs() {
  const rows = useRows('login-logs/');
  return <div className="space-y-4">
    <Heading title="لاگ ورود مدیران" subtitle="ورودهای موفق در ۱۰ روز اخیر" />
    <RowStatus {...rows} />
    {rows.resource?.logs.length === 0 && <p>ورودی در این بازه ثبت نشده است.</p>}
    {rows.resource?.logs.map(({ username, created_at }) => <Panel key={`${username}-${created_at}`} className="flex flex-wrap justify-between gap-2">
      <p>کاربر <bdi className="font-bold">{username}</bdi> وارد شد.</p>
      <time dateTime={created_at}>{displayDate(created_at)}</time>
    </Panel>)}
  </div>;
}
