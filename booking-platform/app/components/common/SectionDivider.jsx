import React from 'react';
import '@/app/styles/components/SectionDivider.css';

export default function SectionDivider({ className = '', withGem = false, style = {}, ...props }) {
  return (
    <div
      className={`hp-section-divider ${className}`.trim()}
      role="separator"
      aria-hidden="true"
      style={style}
      {...props}
    >
      <div className="hp-section-divider-line" />
    </div>
  );
}


