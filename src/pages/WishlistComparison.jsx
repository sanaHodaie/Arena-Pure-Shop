import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ProductImage from '../components/ProductImage.jsx';
import { formatPrice } from '../data/mockData.js';
import { categoryNames, getProductDetails, productUrl } from '../data/productDetails.js';

export default function WishlistComparison({ products, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  const specs = products.map(product => {
    const details = getProductDetails(product);
    const values = new Map(details.specs.filter(([label]) => !['نام انگلیسی', 'دسته‌بندی'].includes(label)));
    const spf = product.category === 'sunscreen' && product.englishName?.match(/\bSPF\s*\d+\+?/i);
    if (spf) values.set('فاکتور محافظت درج‌شده در نام محصول', spf[0]);
    const concentration = product.category === 'fragrance' && product.englishName?.match(/\bEau de (?:Parfum|Toilette|Cologne)\b/i);
    if (concentration && !values.has('غلظت')) values.set('غلظت', concentration[0]);
    values.set('قیمت', `${formatPrice(product.price)} تومان`);
    values.set('موجودی', product.inStock ? 'موجود' : 'ناموجود');
    return values;
  });
  const rows = [...new Set(specs.flatMap(values => [...values.keys()]))];

  return (
    <dialog ref={dialogRef} className="wishlist-comparison" dir="rtl" aria-labelledby="wishlist-comparison-title"
      onCancel={event => { event.preventDefault(); onClose(); }}>
      <header>
        <div>
          <h2 id="wishlist-comparison-title">مقایسه محصولات</h2>
          <p>{categoryNames[products[0].category]}</p>
        </div>
        <button type="button" aria-label="بستن مقایسه" onClick={onClose}><X size={22} /></button>
      </header>
      <div className="wishlist-comparison-scroll" role="region" tabIndex={0} aria-label="جدول مقایسه محصولات">
        <table>
          <thead>
            <tr>
              <th scope="col">مشخصات</th>
              {products.map(product => (
                <th key={product.id} scope="col">
                  <a href={productUrl(product)} onClick={onClose}>
                    <ProductImage src={product.image} alt="" />
                    <span>{product.title}</span>
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(label => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {specs.map((values, index) => <td key={products[index].id} dir="auto">{values.get(label) || 'ثبت نشده'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </dialog>
  );
}
