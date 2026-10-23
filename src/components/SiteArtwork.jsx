import React, { useState } from 'react';

// Keep the reference artwork until the replacement file is available.
export default function SiteArtwork({ src, mobileSrc, alt = '', className = '', children }) {
  const [failedSource, setFailedSource] = useState(null);
  const [failedMobileSource, setFailedMobileSource] = useState(null);
  if (failedSource === src) return children;
  return <picture className={`site-artwork ${className}`}>
    {mobileSrc && failedMobileSource !== mobileSrc && <source media="(max-width: 520px)" srcSet={mobileSrc}/>}
    <img src={src} alt={alt} decoding="async" loading={className.includes('hero-artwork') ? 'eager' : 'lazy'} fetchPriority={className.includes('hero-artwork') ? 'high' : 'auto'} onError={event => {
      if (mobileSrc && event.currentTarget.currentSrc.endsWith(mobileSrc)) {
        setFailedMobileSource(mobileSrc);
      } else {
        setFailedSource(src);
      }
    }}/>
  </picture>;
}
