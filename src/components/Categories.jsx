import SectionHeading from './SectionHeading.jsx';
import React from 'react';
import { categoryPages, categoryUrl } from '../data/categories.js';
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
    <SectionHeading id="categories-heading" title="دسته‌بندی"/>
    <div className="beauty-category-list no-scrollbar">
      {categories.map((category, index) => {
        const filter = category.id;
        const active = selectedCategory === filter;
        const Element = categoryPages[category.id] ? 'a' : 'button';
        return <Element href={categoryPages[category.id] ? categoryUrl(category.id) : undefined} key={category.id} style={{ '--category-index': index }} className={`beauty-category ${active ? 'is-active' : ''}`} aria-pressed={categoryPages[category.id] ? undefined : active} onClick={categoryPages[category.id] ? undefined : () => onSelectCategory(filter)}>
          <span className={`beauty-category-circle category-photo-group tone-${index % 2} ${category.products.length === 1 ? 'single-photo' : 'double-photo'}`} aria-hidden="true">
            {category.products.map((id, photoIndex) => {
              const product = products.find(item => item.id === id);
              return <ProductImage key={id} src={product.image} alt="" loading="lazy" className={`category-product-photo photo-${photoIndex}`}/>;
            })}
          </span>
          <span>{category.name}</span>
        </Element>;
      })}
    </div>
  </section>;
}
