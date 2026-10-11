"use client";

import React from 'react';
import Link from 'next/link';

export default function DesignComparisonBar({ activeVariant = 'test1' }) {
  const variants = [
    { id: 'test1', label: 'Test 1: Cinematic Noir', path: '/test1', badge: 'High Energy' },
    { id: 'test2', label: 'Test 2: Royal Gold Luxe', path: '/test2', badge: 'Editorial VIP' },
    { id: 'test3', label: 'Test 3: Glassmorphic Stage', path: '/test3', badge: 'Modern Vivid' },
    { id: 'test4', label: 'Test 4: Warm Velvet & Ivory', path: '/test4', badge: 'Artisanal Romance' },
  ];

  return (
    <div className="design-comparison-bar" role="region" aria-label="Design Comparison Switcher">
      <div className="dcb-label-wrap">
        <span className="dcb-badge">Design Lab</span>
        <span className="dcb-title">Switch &amp; Compare 4 Aesthetics:</span>
      </div>

      <nav className="dcb-nav-list" aria-label="Design variants">
        {variants.map((v) => {
          const isActive = activeVariant === v.id;
          return (
            <Link
              key={v.id}
              href={v.path}
              className={`dcb-btn ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span>{v.label}</span>
              <small style={{ opacity: 0.8, fontSize: '10px', textTransform: 'uppercase' }}>({v.badge})</small>
            </Link>
          );
        })}
      </nav>

      <div>
        <Link href="/" className="dcb-home-link">
          Original Homepage &rarr;
        </Link>
      </div>
    </div>
  );
}
