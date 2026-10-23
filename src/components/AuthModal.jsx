import React, { useState } from 'react';
import { X, Smartphone, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const handleSendCode = (e) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setStep('otp');
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess(phoneNumber);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 p-6 sm:p-8 relative text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1 mb-2">
            <span className="text-2xl font-black text-slate-900">Arena</span>
            <span className="text-xs font-serif italic text-purple-600 -translate-y-2">Pure</span>
          </div>
          <h3 className="text-lg font-black text-slate-800">
            {step === 'phone' ? 'ورود یا ثبت‌نام در آرنا پیور' : 'کد تأیید را وارد کنید'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {step === 'phone' 
              ? 'برای دسترسی به سفارش‌ها و تخفیف‌های ویژه شماره موبایل خود را وارد نمایید'
              : `کد یکبار مصرف ۵ رقمی به شماره ${phoneNumber} ارسال شد`
            }
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                شماره تلفن همراه
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-sm rounded-2xl py-3 pr-10 pl-4 border border-slate-200 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 font-mono text-left dir-ltr"
                />
                <Smartphone className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition cursor-pointer"
            >
              <span>دریافت کد تایید</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                کد فعال‌سازی
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={5}
                  placeholder="۱۲۳۴۵"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-lg tracking-widest text-center rounded-2xl py-3 border border-slate-200 focus:border-purple-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 font-mono font-bold"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-purple-600 font-semibold hover:underline"
              >
                تغییر شماره
              </button>
              <span className="text-slate-400 font-mono">ارسال مجدد تا ۰۱:۴۵</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition cursor-pointer"
            >
              <span>ورود به حساب کاربری</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            با ورود به آرنا پیور، <a href="#" className="text-purple-600 underline">قوانین و مقررات</a> را می‌پذیرید.
          </p>
        </div>
      </div>
    </div>
  );
}
