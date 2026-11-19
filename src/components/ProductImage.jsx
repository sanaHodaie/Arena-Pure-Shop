import React, { useState } from 'react';
import { ImagePlus } from 'lucide-react';
export default function ProductImage({ src, alt, className = '', ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);
  if (!src || failedSrc === src) return <span className={`product-image-placeholder ${className}`} role="img" aria-label={`تصویر ${alt}`}><ImagePlus size={30} strokeWidth={1}/><span>تصویر این مدل هنوز اضافه نشده</span></span>;
  const thumbnails = import.meta.glob('/public/images/products/*-320.webp');
  const responsive = !!thumbnails['/public' + src.replace('.webp', '-320.webp')];
  return <img decoding="async" {...props} src={src}
    srcSet={responsive ? `${src.replace('.webp', '-320.webp')} 320w, ${src} 800w` : undefined}
    sizes={responsive ? '(max-width: 600px) 140px, (max-width: 1100px) 220px, 300px' : undefined}
    width={responsive ? 800 : undefined} height={responsive ? 800 : undefined}
    alt={alt} className={className} onError={() => setFailedSrc(src)}/>;
}
