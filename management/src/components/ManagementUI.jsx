import React from "react";
import {AlertCircle} from 'lucide-react';
export {formatToman as money} from '../utils/formatters';
export const number = n => new Intl.NumberFormat('fa-IR').format(n || 0);
export const inputClass = 'w-full rounded-2xl bg-pearl-50 dark:bg-pearl-800 border border-plum-100 dark:border-plum-900/50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-plum-500 min-w-0';
export function Button({children, secondary=false, ...props}) {
  return <button {...props} className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${secondary ? 'bg-white dark:bg-pearl-800 border border-plum-200 dark:border-plum-800' : 'bg-gradient-to-r from-plum-600 to-rosewood-600 text-white shadow-lg shadow-plum-500/20'} ${props.className || ''}`}>{children}</button>;
}
export function Panel({children, className=''}) {return <section className={`glass-panel p-4 sm:p-6 min-w-0 ${className}`}>{children}</section>;}
export function Heading({title, subtitle='', children=null}) {return <div className="flex flex-wrap items-center justify-between gap-4 mb-6"><div><h1 className="text-xl sm:text-2xl font-black">{title}</h1><p className="text-xs text-pearl-500 dark:text-pearl-400 mt-2 leading-6">{subtitle}</p></div>{children}</div>;}
export function ErrorBox({message}) {return message ? <div role="alert" className="rounded-2xl p-4 mb-4 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm flex gap-2"><AlertCircle size={18}/>{message}</div> : null;}
export function Empty({children='داده‌ای برای نمایش وجود ندارد.'}) {return <p className="py-12 text-center text-sm text-pearl-500">{children}</p>;}
export function Pager({data, page, setPage}) {return <div className="flex flex-wrap gap-3 items-center justify-center mt-6 text-xs"><Button secondary disabled={page<=1} onClick={()=>setPage(p=>p-1)}>قبلی</Button><span>صفحه {number(page)} · {number(data?.total)} نتیجه</span><Button secondary disabled={!data || page*data.pageSize>=data.total} onClick={()=>setPage(p=>p+1)}>بعدی</Button></div>;}
