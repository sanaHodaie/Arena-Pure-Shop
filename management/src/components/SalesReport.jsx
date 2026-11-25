import React, { useEffect, useState } from 'react';
import { Download, ShoppingBag, Wallet } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { request } from '../api';
import { Button, ErrorBox, Heading, Panel, inputClass, money, number } from './ManagementUI';

const dateFormat = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { dateStyle: 'medium', timeZone: 'UTC' });
const shortDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const compact = new Intl.NumberFormat('fa-IR', { notation: 'compact', maximumFractionDigits: 1 });
const formatDate = (date) => dateFormat.format(new Date(date + 'T12:00Z'));

function reportRange(months) {
  const local = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tehran', year: 'numeric', month: '2-digit', day: '2-digit' });
  const parts = Object.fromEntries(local.formatToParts().map(({ type, value }) => [type, Number(value)]));
  const end = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  const target = new Date(Date.UTC(parts.year, parts.month - 1 - (months || 0), 1));
  if (!months) {
    const persianDay = new Intl.DateTimeFormat('en-US-u-ca-persian-nu-latn', { timeZone: 'Asia/Tehran', day: 'numeric' }).format();
    target.setTime(end.getTime());
    target.setUTCDate(parts.day - Number(persianDay) + 1);
  } else {
    const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    target.setUTCDate(Math.min(parts.day, last) + 1);
  }
  const toISO = (value) => value.toISOString().slice(0, 10);
  return { start: toISO(target), end: toISO(end) };
}

function Chart({ title, series, metric, monthly, color, format, bars }) {
  const reduced = useReducedMotion();
  const width = 560, height = 190, inset = 18;
  const maximum = Math.max(1, ...series.map((row) => row[metric]));
  const cell = (width - inset * 2) / series.length;
  const points = series.map((row, index) => [
    inset + (index + .5) * cell,
    height - inset - row[metric] / maximum * (height - inset * 2),
  ]);
  const describeDate = (row) => monthly ? row.date : shortDate.format(new Date(row.date + 'T12:00Z'));
  return <Panel className="space-y-3">
    <h2 className="font-bold">{title}</h2>
    <div className="flex items-center justify-between text-xs text-pearl-600 dark:text-pearl-300">
      <span>{monthly ? 'ماهانه · میلادی' : 'روزانه'}</span><span>بیشترین مقدار {format(maximum === 1 && series.every(row => row[metric] === 0) ? 0 : maximum)}</span>
    </div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title} dir="ltr" className="w-full overflow-visible" style={{ color }}>
      {[.25, .5, .75, 1].map((fraction) => <line key={fraction} x1={inset} x2={width - inset} y1={fraction * (height - 2 * inset) + inset} y2={fraction * (height - 2 * inset) + inset} stroke="currentColor" opacity=".18" />)}
      {bars ? points.map(([x, y], index) => <motion.rect key={series[index].date} x={x - cell * .28} width={cell * .56}
        rx={4} fill="currentColor" initial={reduced ? false : { y: height - inset, height: 0 }}
        animate={{ y, height: Math.max(0, height - inset - y) }} transition={{ duration: reduced ? 0 : .32, delay: reduced ? 0 : Math.min(index * .02, .2) }}>
        <title>{describeDate(series[index])} · {format(series[index][metric])}</title>
      </motion.rect>) : <>
        <motion.polyline points={points.map((point) => point.join(',')).join(' ')} fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : .55 }} />
        {points.map(([x, y], index) => <circle key={series[index].date} cx={x} cy={y} r={series.length > 20 ? 2 : 4} fill="currentColor">
          <title>{describeDate(series[index])} · {format(series[index][metric])}</title>
        </circle>)}
      </>}
    </svg>
    <div className="flex justify-between text-xs text-pearl-600 dark:text-pearl-300" dir="ltr">
      <span>{describeDate(series[0])}</span><span>{describeDate(series.at(-1))}</span>
    </div>
  </Panel>;
}

export default function SalesReport() {
  const [draft, setDraft] = useState(() => reportRange(0));
  const [range, setRange] = useState(draft);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const query = new URLSearchParams(range).toString();

  useEffect(() => {
    let active = true;
    setReport(null);
    setError('');
    request(`sales/?${query}`).then((data) => { if (active) setReport(data); })
      .catch((failure) => { if (active) setError(failure.message); });
    return () => { active = false; };
  }, [query]);

  function choose(months) {
    const next = reportRange(months);
    setDraft(next);
    setRange(next);
  }

  return <div className="space-y-5">
    <Heading title="گزارش فروش" subtitle="درآمد و تعداد سفارش‌ها در بازهٔ انتخابی، به تومان" />
    <Panel className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[[0, 'ماه جاری شمسی'], [1, 'یک ماه اخیر'], [3, 'سه ماه اخیر'], [12, 'یک سال اخیر']].map(([months, text]) =>
          <Button key={months} type="button" secondary onClick={() => choose(months)}>{text}</Button>)}
      </div>
      <form className="flex flex-wrap items-end gap-3" onSubmit={(event) => { event.preventDefault(); setRange(draft); }}>
        <label className="grid gap-1 text-xs">از تاریخ<input type="date" required dir="ltr" className={inputClass} value={draft.start} max={draft.end} onChange={(event) => setDraft({ ...draft, start: event.target.value })} /></label>
        <label className="grid gap-1 text-xs">تا تاریخ<input type="date" required dir="ltr" className={inputClass} value={draft.end} min={draft.start} max={reportRange(0).end} onChange={(event) => setDraft({ ...draft, end: event.target.value })} /></label>
        <Button>نمایش گزارش</Button>
        {report && <a className="sales-export" href={`/api/management/sales/export/?${query}`} download><Download size={16} /> خروجی اکسل</a>}
      </form>
      {report && <p className="text-xs text-pearl-600 dark:text-pearl-300">بازهٔ گزارش و فایل اکسل · {formatDate(report.start)} تا {formatDate(report.end)}</p>}
    </Panel>
    <ErrorBox message={error} />
    {!report && !error && <p role="status">در حال دریافت گزارش…</p>}
    {report && <>
      <p role="status" className="rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        {report.demo ? 'پیش‌نمایش آزمایشی · اعداد و فایل اکسل از داده‌های ساختگی استفاده می‌کنند.' : 'فروش آنلاین هنوز به این گزارش متصل نیست. اعداد فعلاً صفر هستند.'}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel><Wallet className="mb-3 text-indigo-500" size={21}/><p className="text-sm">درآمد بازه</p><strong className="text-xl">{money(report.totals.revenue)}</strong></Panel>
        <Panel><ShoppingBag className="mb-3 text-teal-500" size={21}/><p className="text-sm">تعداد سفارش‌ها</p><strong className="text-xl">{number(report.totals.orders)}</strong></Panel>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Chart key={`revenue-${query}`} title="روند درآمد" metric="revenue" series={report.series} monthly={report.interval === 'month'} color="#8c63dc" format={(value) => `${compact.format(value)} تومان`} />
        <Chart key={`orders-${query}`} title="تعداد سفارش‌ها" metric="orders" series={report.series} monthly={report.interval === 'month'} color="#109f84" format={number} bars />
      </div>
      <Panel>
        <details>
          <summary className="cursor-pointer font-bold">جزئیات و اعداد دقیق روزانه</summary>
          <table className="mt-3 w-full text-start text-sm">
            <thead><tr><th scope="col">تاریخ</th><th scope="col">سفارش‌ها</th><th scope="col">درآمد</th></tr></thead>
            <tbody>{report.days.map((day) => <tr key={day.date} className="border-t border-plum-200/60 text-center">
              <td className="py-2">{formatDate(day.date)}</td><td>{number(day.orders)}</td><td>{money(day.revenue)}</td>
            </tr>)}</tbody>
          </table>
        </details>
      </Panel>
    </>}
  </div>;
}
