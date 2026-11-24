import React from 'react';
import { ArrowDownWideNarrow } from 'lucide-react';
import SelectMenu from './SelectMenu.jsx';

const options = [{ value: 'default', label: 'پیش‌فرض' }, { value: 'price-asc', label: 'ارزان‌ترین' }, { value: 'price-desc', label: 'گران‌ترین' }, { value: 'name', label: 'نام محصول' }];

export default function SortMenu({ value, onChange }) {
  return <SelectMenu value={value} onChange={onChange} options={options} label="مرتب‌سازی" Icon={ArrowDownWideNarrow} />;
}
