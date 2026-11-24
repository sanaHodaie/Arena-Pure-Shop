import React, { useEffect, useRef } from 'react';
import { ArrowUpLeft, Check, Palette, X } from 'lucide-react';
import { getProductDetails, productUrl } from '../data/productDetails.js';
import ProductImage from './ProductImage.jsx';

export default function ProductShadeGuide({ variants, selectedId }) {
  const dialog = useRef(null);
  useEffect(() => { dialog.current?.close(); }, [selectedId]);

  const shades = variants.map(variant => ({ variant, ...getProductDetails(variant) }));
  if (shades.filter(shade => shade.undertone).length < 2) return null;

  return <>
    <button className="pd-shade-guide-trigger" type="button" aria-haspopup="dialog" onClick={() => dialog.current.showModal()}>
      <Palette size={16} aria-hidden="true" /> راهنمای انتخاب رنگ
    </button>
    <dialog ref={dialog} className="pd-shade-guide" aria-labelledby="pd-shade-guide-title">
      <header>
        <h2 id="pd-shade-guide-title">راهنمای انتخاب رنگ</h2>
        <button type="button" className="pd-icon" onClick={() => dialog.current.close()} aria-label="بستن راهنمای رنگ"><X size={20} /></button>
      </header>
      <div className="pd-shade-guide-grid">
        {shades.map(({ variant, shade, color, undertone, shadeNote }) => (
          <article key={variant.id}>
            <div className="pd-shade-guide-photo"><ProductImage src={variant.image} alt="" /></div>
            <h3><i style={{ background: color }} aria-hidden="true" /><bdi>{shade}</bdi></h3>
            <strong>{undertone}</strong>
            <p>{shadeNote}</p>
            {variant.id === selectedId ? <span className="pd-shade-guide-current"><Check size={15} aria-hidden="true" /> رنگ فعلی</span> : (
              <a href={productUrl(variant)} aria-label={`انتخاب رنگ ${shade}`} onClick={event => {
                if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) dialog.current.close();
              }}>انتخاب این رنگ <ArrowUpLeft size={15} aria-hidden="true" /></a>
            )}
          </article>
        ))}
      </div>
      <p className="pd-shade-guide-note">نمونه‌رنگ دیجیتال تقریبی است. رنگ روی لب با تناژ طبیعی لب و نور تغییر می‌کند.</p>
    </dialog>
  </>;
}
