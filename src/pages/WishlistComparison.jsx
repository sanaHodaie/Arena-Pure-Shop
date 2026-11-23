import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRightLeft, X } from 'lucide-react';
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
        <div className="comparison-heading">
          <span className="comparison-icon"><ArrowRightLeft size={22} aria-hidden="true" /></span>
          <div>
            <h2 id="wishlist-comparison-title">مقایسه محصولات</h2>
            <p>{categoryNames[products[0].category]} · {formatPrice(products.length)} محصول</p>
          </div>
        </div>
        <button type="button" aria-label="بستن مقایسه" onClick={onClose}><X size={22} /></button>
      </header>
      <p className="comparison-scroll-hint"><ArrowRightLeft size={15} aria-hidden="true" /> برای دیدن همهٔ محصولات، جدول را افقی حرکت دهید.</p>
      <div className="wishlist-comparison-scroll" role="region" tabIndex={0} aria-label="جدول مقایسه محصولات">
        <table>
          <thead>
            <tr>
              <th scope="col"><span className="comparison-label">مشخصات</span></th>
              {products.map(product => (
                <th key={product.id} scope="col">
                  <a className="comparison-product" href={productUrl(product)} onClick={event => {
                    if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onClose();
                  }}>
                    <div className="comparison-product-art">
                      <ProductImage src={product.image} alt="" />
                    </div>
                    <strong className="comparison-product-name" dir="auto">{product.title}</strong>
                    <strong className="comparison-product-price">{formatPrice(product.price)} <small>تومان</small></strong>
                    <span className={`comparison-stock${product.inStock ? ' is-available' : ''}`}>
                      {product.inStock ? 'موجود' : 'ناموجود'}
                    </span>
                    <span className="comparison-product-link">مشاهده محصول <ArrowLeft size={13} aria-hidden="true" /></span>
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, values, differs }) => (
              <tr key={label} className={differs ? 'comparison-row-differs' : undefined}>
                <th scope="row">
                  {label}
                  {differs && <span className="comparison-difference">متفاوت</span>}
                </th>
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
