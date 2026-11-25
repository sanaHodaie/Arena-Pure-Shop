import { Check, Edit2, Eye, EyeOff, ImagePlus, Trash2, X } from 'lucide-react';
import ArticlePoster from '../../../src/components/ArticlePoster.jsx';
import { ArticleContent } from '../../../src/pages/ArticlePage.jsx';
import Select from './Select.jsx';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
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
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const editor = useRef(null);

  function openEditor(article) {
    setSelection(article);
    setNotice(null);
    setError('');
  }

  useEffect(() => {
    if (selection) editor.current?.scrollIntoView({ block: 'start' });
  }, [selection]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  function notify(message) {
    setNotice({ message });
  }

  async function changeVisibility(article) {
    setError('');
    setUpdating(true);
    try {
      await post(`articles/${article.id}/visibility/`, { published: String(!article.published) });
      notify(article.published ? 'مقاله از سایت پنهان شد.' : 'مقاله دوباره در سایت نمایش داده می‌شود.');
      rows.refresh();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setUpdating(false);
    }
  }

  async function removeArticle() {
    if (!deleting || updating) return;
    setUpdating(true);
    setDeleteError('');
    try {
      await post(`articles/${deleting.id}/delete/`, {});
      setDeleting(null);
      notify('مقاله حذف شد.');
      rows.refresh();
    } catch (failure) {
      setDeleteError(failure.message);
    } finally {
      setUpdating(false);
    }
  }

  return <div className="space-y-4">
    <Heading title="خواندنی‌ها" subtitle="مقاله‌های صفحهٔ اصلی و صفحهٔ هر مطلب">
      {!selection && account.articleAdd && <Button disabled={!rows.resource} onClick={() => openEditor({ author: account.username })}>مقالهٔ جدید</Button>}
    </Heading>
    <ArticleNotice notice={notice} onClose={() => setNotice(null)} />
    {deleting && <ArticleDeleteDialog article={deleting} busy={updating} error={deleteError}
      onClose={() => setDeleting(null)} onConfirm={removeArticle} />}
    <ErrorBox message={error} />
    <RowStatus {...rows} />
    {selection && <div ref={editor} className="scroll-mt-20">
      <ArticleEditor key={selection.id || 'new'} article={selection}
        categories={rows.resource?.categories || []} onCancel={() => setSelection(null)} onSaved={(published) => {
          setSelection(null);
          notify(published
            ? selection.id ? 'ویرایش‌ها ذخیره شدند و مقاله به‌روز شد.' : 'مقاله منتشر شد.'
            : selection.id ? 'ویرایش‌ها به‌عنوان پیش‌نویس ذخیره شدند.' : 'مقاله به‌عنوان پیش‌نویس ذخیره شد.');
          rows.refresh();
        }} />
    </div>}
    {!selection && <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {rows.resource?.articles.map((article) => <article key={article.id} className="glass-panel grid min-w-0 grid-cols-[minmax(96px,32%)_minmax(0,1fr)] overflow-hidden">
        <div className="aspect-square self-start overflow-hidden rounded-2xl m-3"><img src={article.cover.image} alt="" loading="lazy" className="h-full w-full object-cover" /></div>
        <div className="space-y-3 p-4">
          <h2 className="line-clamp-2 text-sm font-bold">{article.title}</h2>
          <p className="line-clamp-2 text-xs leading-relaxed text-pearl-600 dark:text-pearl-300">{article.excerpt}</p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-pearl-600 dark:text-pearl-300">{article.published ? 'منتشرشده' : 'پیش‌نویس'}</span>
            <div className="flex gap-2">
              {account.articleChange && <>
                <Button type="button" secondary disabled={updating} aria-pressed={article.published}
                  aria-label={article.published ? 'غیرفعال کردن مقاله' : 'فعال کردن مقاله'}
                  onClick={() => changeVisibility(article)}>
                  {article.published ? <Eye size={17} /> : <EyeOff size={17} />}
                </Button>
                <Button type="button" secondary disabled={updating} aria-label="ویرایش مقاله" onClick={() => openEditor(article)}><Edit2 size={17} /></Button>
              </>}
              {account.articleDelete && <Button type="button" secondary disabled={updating} aria-label="حذف مقاله"
                className="text-rose-700 dark:text-rose-300"
                onClick={() => { setDeleteError(''); setDeleting(article); }}><Trash2 size={17} /></Button>}
            </div>
          </div>
        </div>
      </article>)}
    </div>}
  </div>;
}

const articleFields = [
  ['title', 'عنوان', 220, 'title'], ['author', 'نام نویسنده', 120, 'author'],
  ['date_label', 'تاریخ نمایشی', 45, 'date'], ['read_time', 'زمان مطالعه', 45, 'readTime'],
  ['topic', 'موضوع پوستر', 140, 'topic'], ['summary', 'خلاصهٔ پوستر', 300, 'summary'],
  ['excerpt', 'چکیدهٔ کارت', 800, 'excerpt'],
];
const imageLimit = 3 * 1024 * 1024;

function ArticleEditor({ article, categories, onCancel, onSaved }) {
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [theme, setTheme] = useState(article.cover?.theme || 'matte');
  const [category, setCategory] = useState(String(article.categoryId || ''));
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => { if (image) URL.revokeObjectURL(image); }, [image]);

  function chooseImage(event) {
    const file = event.currentTarget.files[0];
    if (!file) return;
    if (!/\.(jpe?g|png|webp)$/i.test(file.name) || file.size === 0 || file.size > imageLimit) {
      event.currentTarget.value = '';
      setImage('');
      setFileError('تصویر JPG، PNG یا WebP با حجمی حداکثر ۳ مگابایت انتخاب کنید.');
      return;
    }
    setFileError('');
    setErrors((current) => ({ ...current, photo: undefined }));
    setImage(URL.createObjectURL(file));
  }

  function showPreview(event) {
    event.preventDefault();
    if (fileError) return;
    const data = new FormData(event.currentTarget);
    setError('');
    setPreview({
      data,
      article: {
        title: data.get('title'), author: data.get('author'), readTime: data.get('read_time'),
        excerpt: data.get('excerpt'), body: data.get('body'),
        relatedCategory: categories.find((item) => String(item.id) === data.get('related_category'))?.title,
        cover: { image: image || article.cover?.image, theme: data.get('cover_theme'),
          topic: data.get('topic'), summary: data.get('summary') },
      },
    });
  }

  async function save(published) {
    setBusy(true);
    setErrors({});
    setError('');
    try {
      if (published) preview.data.set('is_published', 'true');
      else preview.data.delete('is_published');
      await request(`articles/${article.id || 'new'}/`, preview.data);
      onSaved(published);
    } catch (failure) {
      setError(failure.fields ? 'فیلدهای مشخص‌شده را بررسی کنید.' : failure.message);
      setErrors(failure.fields || {});
      setPreview(null);
    } finally {
      setBusy(false);
    }
  }

  const defaultDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { dateStyle: 'medium', timeZone: 'Asia/Tehran' }).format();
  const values = { date: defaultDate, readTime: '۵ دقیقه', ...article, ...article.cover };
  const feedback = (key) => errors[key]?.map((text) => <small key={text} className="text-rose-700 dark:text-rose-300">{text}</small>);
  return <Panel>
    <Heading title={article.id ? 'ویرایش مقاله' : 'مقالهٔ جدید'} />
    <ErrorBox message={error} />
    {feedback('__all__')}
    {preview && <ArticlePreview article={preview.article} busy={busy} onClose={() => setPreview(null)} onSave={save} />}
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={showPreview}>
      <div className="space-y-2 sm:col-span-2">
        <label className="group block cursor-pointer" data-tooltip="انتخاب تصویر پوستر">
          <input type="file" name="photo" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={chooseImage} required={!article.id} aria-label="انتخاب تصویر پوستر" className="sr-only" />
          <span className="relative grid min-h-36 max-w-md place-items-center overflow-hidden rounded-2xl border border-dashed border-plum-500 bg-plum-50 group-focus-within:outline-2 group-focus-within:outline-plum-600 dark:bg-plum-950">
            {(image || values.image) && <img src={image || values.image} alt="" className="h-40 w-full object-cover" />}
            <span className="absolute flex items-center gap-2 rounded-xl bg-plum-900 px-4 py-2 text-xs font-bold text-white"><ImagePlus size={17} /> انتخاب تصویر پوستر</span>
          </span>
        </label>
        <p className="text-xs text-pearl-600 dark:text-pearl-300">JPG، PNG یا WebP ثابت، حداکثر ۳ مگابایت و ۴۰۹۶ پیکسل در هر ضلع</p>
        {fileError && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{fileError}</p>}
        {feedback('photo')}
      </div>
      {articleFields.map(([name, label, length, key]) => <label key={name} className="grid gap-1 text-sm">
        {label}<input required name={name} className={inputClass} maxLength={length} defaultValue={values[key]} />
        {feedback(name)}
      </label>)}
      <div className="grid gap-1 text-sm">
        <label htmlFor="article-cover-theme">رنگ پوستر</label>
        <Select id="article-cover-theme" name="cover_theme" aria-label="رنگ پوستر" className={inputClass}
          value={theme} onChange={(event) => setTheme(event.target.value)}>
          <option value="matte">آلویی</option><option value="dry-skin">رز</option>
          <option value="hydration">آبی</option><option value="eyeliner">تیره</option>
        </Select>
        {feedback('cover_theme')}
      </div>
      <div className="grid gap-1 text-sm">
        <label htmlFor="article-category">دستهٔ مرتبط</label>
        <Select id="article-category" name="related_category" aria-label="دستهٔ مرتبط" className={inputClass}
          value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">بدون دستهٔ مرتبط</option>
          {categories.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}
        </Select>
        {feedback('related_category')}
      </div>
      <label className="grid gap-1 text-sm sm:col-span-2">متن کامل
        <textarea required rows={12} name="body" className={inputClass} maxLength={20000} defaultValue={article.body} />
        <small>برای عنوان بخش، ابتدای خط از «##» و یک فاصله استفاده کنید.</small>{feedback('body')}
      </label>
      <div className="flex gap-2 sm:col-span-2">
        <Button disabled={Boolean(fileError)}>پیش‌نمایش</Button>
        <Button secondary type="button" onClick={onCancel}>انصراف</Button>
      </div>
    </form>
  </Panel>;
}

function ArticleNotice({ notice, onClose }) {
  const reduced = useReducedMotion();
  return createPortal(<AnimatePresence>
    {notice && <motion.div key={notice.message} role="status" className="article-notice"
      initial={{ opacity: 0, y: reduced ? 0 : 10 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : 8 }} transition={{ duration: .2 }}>
      <Check size={18} /><span>{notice.message}</span>
      <button type="button" onClick={onClose} aria-label="بستن اعلان"><X size={16} /></button>
    </motion.div>}
  </AnimatePresence>, document.body);
}

function ArticleDeleteDialog({ article, busy, error, onClose, onConfirm }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return <dialog ref={ref} role="alertdialog" aria-labelledby="delete-article-title" aria-describedby="delete-article-warning"
    className="article-preview article-delete-dialog"
    onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}>
    <div className="space-y-4 p-6">
      <span className="inline-flex rounded-2xl bg-rose-100 p-3 text-rose-700 dark:bg-rose-950 dark:text-rose-300"><Trash2 size={24} /></span>
      <h2 id="delete-article-title" className="text-base font-black">آیا از حذف این مقاله مطمئن هستید؟</h2>
      <p className="break-words text-sm font-bold">{article.title}</p>
      <p id="delete-article-warning" className="text-sm text-pearl-600 dark:text-pearl-300">این عمل بدون بازگشت است.</p>
      <ErrorBox message={error} />
      <div className="flex flex-wrap gap-2">
        <Button autoFocus secondary type="button" disabled={busy} onClick={onClose}>لغو</Button>
        <button type="button" disabled={busy} onClick={onConfirm}
          className="rounded-2xl bg-rose-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-800 disabled:opacity-50">
          {busy ? 'در حال حذف…' : 'تأیید حذف'}
        </button>
      </div>
    </div>
  </dialog>;
}

function ArticlePreview({ article, busy, onClose, onSave }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog ref={ref} className="article-preview" aria-labelledby="admin-preview-title"
    onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}>
    <div className="article-preview-top">
      <h2 id="admin-preview-title">پیش‌نمایش مقاله</h2>
      <Button type="button" secondary disabled={busy} aria-label="بستن پیش‌نمایش" onClick={onClose}><X size={18} /></Button>
    </div>
    <div className="p-4 sm:p-6">
      <ArticlePoster article={article} preview />
      <ArticleContent article={article} preview />
    </div>
    <div className="article-preview-actions">
      <Button disabled={busy} type="button" onClick={() => onSave(true)}>ذخیره و انتشار</Button>
      <Button disabled={busy} secondary type="button" onClick={() => onSave(false)}>ذخیره به‌عنوان پیش‌نویس</Button>
      <Button disabled={busy} secondary type="button" onClick={onClose}>بازگشت به ویرایش</Button>
    </div>
  </dialog>;
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
