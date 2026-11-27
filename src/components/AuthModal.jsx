import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Smartphone, X } from 'lucide-react';
import { normalizePhone, registerCustomer, loginCustomer } from '../data/customerSession.js';
import './AuthModal.css';

export default function AuthModal({ onClose, onLoginSuccess }) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const activeRef = useRef(false);
  const requestRef = useRef(null);
  const [step, setStep] = useState('welcome');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const registering = step === 'register';

  useEffect(() => {
    const dialog = dialogRef.current;
    activeRef.current = true;
    dialog.showModal();
    return () => {
      activeRef.current = false;
      requestRef.current?.abort();
      dialog.close();
    };
  }, []);

  useEffect(() => { titleRef.current.focus(); }, [step]);

  function changeStep(next) {
    setError('');
    setNotice('');
    setPassword('');
    setVisible(false);
    setStep(next);
  }

  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    const normalized = normalizePhone(phone);
    setError('');
    if (!/^09\d{9}$/.test(normalized)) {
      setError('شماره موبایل معتبر وارد کنید، مثل ۰۹۱۲۳۴۵۶۷۸۹.');
      return;
    }
    if (registering && password.length < 12) {
      setError('رمز عبور باید حداقل ۱۲ نویسه داشته باشد.');
      return;
    }

    setPending(true);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const result = await (registering
        ? registerCustomer(normalized, password, controller.signal)
        : loginCustomer(normalized, password, controller.signal));
      if (!activeRef.current || controller.signal.aborted) return;
      if (registering) {
        changeStep('login');
        setPhone(normalized);
        setNotice('اگر ثبت‌نام انجام شده باشد، می‌توانید با همین شماره و رمز وارد شوید.');
      } else {
        onLoginSuccess(result.account);
      }
    } catch (failure) {
      if (activeRef.current && !controller.signal.aborted) setError(failure.message);
    } finally {
      if (activeRef.current) setPending(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="account-dialog"
      dir="rtl"
      aria-labelledby="account-dialog-title"
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="account-dialog-content">
        <div className="account-dialog-top">
          <div className="arena-logo account-wordmark"><span>Arena</span><i>Pure</i></div>
          <button type="button" className="account-close" aria-label="بستن" onClick={onClose}><X size={20} /></button>
        </div>

        <h2 ref={titleRef} id="account-dialog-title" tabIndex={-1}>
          {step === 'welcome' ? 'به آرنا پیور خوش آمدید' : registering ? 'ثبت‌نام' : 'ورود به حساب'}
        </h2>

        {step === 'welcome' && (
          <img className="account-welcome-portrait"
            src="/images/account/lipstick-portrait.webp" alt="تصویر سه‌بعدی زنی در حال زدن رژ لب دیور"
            width="900" height="596" />
        )}

        {step === 'welcome' ? <>
          <div className="account-actions">
            <button type="button" className="account-primary" onClick={() => changeStep('register')}>ثبت‌نام <ArrowLeft size={17} /></button>
            <button type="button" className="account-secondary" onClick={() => changeStep('login')}>ورود</button>
          </div>
        </> : <>
          {notice && <p className="account-notice" role="status">{notice}</p>}
          <form className="account-form" onSubmit={submit}>
            <label htmlFor="account-phone">شماره موبایل</label>
            <div className="account-field">
              <Smartphone size={18} aria-hidden="true" />
              <input id="account-phone" type="tel" dir="ltr" autoComplete="username" required value={phone}
                maxLength={24} disabled={pending} placeholder="09123456789" onChange={event => setPhone(event.target.value)} />
            </div>
            <label htmlFor="account-password">رمز عبور</label>
            <div className="account-field">
              <LockKeyhole size={18} aria-hidden="true" />
              <input id="account-password" type={visible ? 'text' : 'password'} dir="ltr"
                autoComplete={registering ? 'new-password' : 'current-password'} required
                minLength={registering ? 12 : undefined} maxLength={128} disabled={pending}
                value={password} placeholder={registering ? 'حداقل ۱۲ نویسه' : undefined}
                onChange={event => setPassword(event.target.value)} />
              <button type="button" className="account-password-toggle" aria-label={visible ? 'پنهان کردن رمز' : 'نمایش رمز'} onClick={() => setVisible(!visible)}>
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="account-error" role="alert">{error}</p>}
            <button type="submit" className="account-primary" disabled={pending}>
              {pending ? 'در حال بررسی…' : registering ? 'ثبت‌نام' : 'ورود'} <ArrowLeft size={17} />
            </button>
          </form>
          <button type="button" className="account-switch" disabled={pending} onClick={() => changeStep(registering ? 'login' : 'register')}>
            {registering ? 'حساب دارید؟ ورود' : 'حساب ندارید؟ ثبت‌نام'}
          </button>
        </>}

        <p className="account-demo">برای این حساب یک رمز منحصربه‌فرد انتخاب کنید.</p>
      </div>
    </dialog>
  );
}
