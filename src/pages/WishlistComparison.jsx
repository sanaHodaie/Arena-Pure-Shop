import React, { useEffect, useRef } from 'react';
import { ArrowUpLeft, X } from 'lucide-react';
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
    return values;
  });
  const rows = [...new Set(specs.flatMap(values => [...values.keys()]))].map(label => {
    const values = specs.map(spec => spec.get(label));
    return { label, values, differs: new Set(values.filter(Boolean)).size > 1 };
  });

  return (
    <dialog ref={dialogRef} className="wishlist-comparison" dir="rtl" aria-labelledby="wishlist-comparison-title"
      onCancel={event => { event.preventDefault(); onClose(); }}>
      <header>
        <div>
          <p>{categoryNames[products[0].category]}</p>
          <h2 id="wishlist-comparison-title">مقایسه محصولات</h2>
        </div>
        <button type="button" aria-label="بستن مقایسه" onClick={onClose}><X size={20} /></button>
      </header>
      <p className="comparison-scroll-hint">برای دیدن همهٔ محصولات، جدول را افقی بکشید.</p>
      <div className="wishlist-comparison-scroll" role="region" tabIndex={0} aria-label="جدول مقایسه محصولات">
        <table>
          <thead>
            <tr>
              <th scope="col"><span className="sr-only">مشخصات</span></th>
              {products.map(product => (
                <th key={product.id} scope="col">
                  <a className="comparison-product" href={productUrl(product)} onClick={event => {
                    if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onClose();
                  }}>
                    <div className="comparison-product-art">
                      <ProductImage src={product.image} alt="" />
                    </div>
                    <span className="comparison-product-name" dir="auto">{product.title}</span>
                    <ArrowUpLeft className="comparison-product-arrow" size={14} aria-hidden="true" />
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">قیمت</th>
              {products.map(product => (
                <td key={product.id} className="comparison-product-price">{formatPrice(product.price)} <small>تومان</small></td>
              ))}
            </tr>
            <tr>
              <th scope="row">موجودی</th>
              {products.map(product => (
                <td key={product.id} className={product.inStock ? 'comparison-in-stock' : undefined}>
                  {product.inStock ? 'موجود' : 'ناموجود'}
                </td>
              ))}
            </tr>
            {rows.map(({ label, values, differs }) => (
              <tr key={label} className={differs ? 'comparison-row-differs' : undefined}>
                <th scope="row">{label}</th>
                {values.map((value, index) => (
                  <td key={products[index].id} dir="auto" className={value ? undefined : 'comparison-missing'}>
                    {value || 'ثبت نشده'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </dialog>
  );
}
