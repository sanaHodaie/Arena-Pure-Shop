import React from 'react';
import { products } from '../data/catalog.js';
import ProductImage from './ProductImage.jsx';

const categories = [
  { id: 'haircare', name: 'مراقبت مو', products: [10] },
  { id: 'skincare', name: 'مراقبت پوست', products: [6, 8] },
  { id: 'sunscreen', name: 'ضد آفتاب', products: [9] },
  { id: 'hygiene', name: 'بهداشت شخصی', products: [11, 8] },
  { id: 'cleansing', name: 'پاک‌کننده‌ها', products: [11, 7] },
  { id: 'fragrance', name: 'ادکلن', products: [12] },
  { id: 'cosmetics', name: 'آرایشی', products: [2, 3] },
];

export default function Categories({ selectedCategory, onSelectCategory }) {
  return <section className="arena-container beauty-categories" aria-labelledby="categories-heading">
    <h2 id="categories-heading">دسته‌بندی</h2>
    <div className="beauty-category-list no-scrollbar">
      {categories.map((category, index) => {
        const filter = category.id === 'cleansing' ? 'hygiene' : category.id;
        const active = selectedCategory === filter;
        return <button key={category.id} className={`beauty-category ${active ? 'is-active' : ''}`} aria-pressed={active} onClick={() => onSelectCategory(filter)}>
          <span className={`beauty-category-circle category-photo-group tone-${index % 2} ${category.products.length === 1 ? 'single-photo' : 'double-photo'}`} aria-hidden="true">
            {category.products.map((id, photoIndex) => {
              const product = products.find(item => item.id === id);
              return <ProductImage key={id} src={product.image} alt="" loading="lazy" className={`category-product-photo photo-${photoIndex}`}/>;
            })}
          </span>
          <span>{category.name}</span>
        </button>;
      })}
    </div>
  </section>;
}
