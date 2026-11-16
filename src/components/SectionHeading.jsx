import React from 'react';

export default function SectionHeading({ title, id, eyebrow, action, className = '' }) {
  return <header className={`section-heading ${className}`}>
    {eyebrow && <div className="section-heading-eyebrow">{eyebrow}</div>}
    <div className="section-heading-row"><h2 id={id}>{title}</h2><span className="section-heading-line" aria-hidden="true"/>{action && <div className="section-heading-action">{action}</div>}</div>
  </header>;
}
