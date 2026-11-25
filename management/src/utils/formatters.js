// Persian Numbers & Financial Formatters

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(num) {
  if (num === null || num === undefined) return '';
  return String(num).replace(/[0-9]/g, (w) => PERSIAN_DIGITS[+w]);
}

export function formatToman(amount, includeUnit = true) {
  if (amount === null || amount === undefined) return '۰ تومان';
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const persianFormatted = toPersianDigits(formatted);
  return includeUnit ? `${persianFormatted} تومان` : persianFormatted;
}
