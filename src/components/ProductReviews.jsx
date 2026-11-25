import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

export function useProductReviews(slug) {
  const url = `/api/v1/products/${encodeURIComponent(slug)}/reviews/`;
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const target = document.getElementById('product-reviews');
    const controller = new AbortController();
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      fetch(url, { signal: controller.signal }).then(async (response) => {
        if (!response.ok) throw Error(response.status);
        setData(await response.json());
      }).catch(() => {
        if (!controller.signal.aborted) setError('دریافت دیدگاه‌ها ممکن نشد.');
      });
    }, { rootMargin: '400px' });
    if (target) observer.observe(target);
    return () => { observer.disconnect(); controller.abort(); };
  }, [url]);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(url, {
        method: 'POST', headers: { 'X-CSRFToken': data.csrf }, body: new FormData(form),
      });
      if (!response.ok) throw Error('ثبت دیدگاه انجام نشد. اطلاعات را بررسی کنید و دوباره تلاش کنید.');
      form.reset();
      setMessage('دیدگاه شما ثبت شد و پس از تأیید مدیر نمایش داده می‌شود.');
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSending(false);
    }
  }
  return { items: data?.reviews || [], count: data?.count || 0, ready: Boolean(data?.csrf), sending, submit, error, message };
}

export function ReviewPanel({ items, ready, sending, submit, error, message }) {
  return <div className="pi-reviews">
    {items.map((review) => <article className="pi-review" key={review.id}>
      <header><strong>{review.name}</strong> <time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString('fa-IR')}</time></header>
      <p>{review.body}</p>
    </article>)}
    {ready && !items.length && <div className="pi-reviews-empty"><span><MessageCircle size={24} /></span><div><h3>هنوز دیدگاهی منتشر نشده</h3></div></div>}
    {error && <p role="alert">{error}</p>}
    {message && <p role="status">{message}</p>}
    {ready && <form className="pi-review-form" onSubmit={submit}>
      <label>نام نمایشی<input name="name" maxLength={80} required /></label>
      <label>دیدگاه<textarea name="body" rows={4} minLength={5} maxLength={1500} required /></label>
      <button type="submit" disabled={sending}>{sending ? 'در حال ارسال…' : 'ثبت دیدگاه'}</button>
    </form>}
  </div>;
}
