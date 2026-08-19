"use client";

import React, { useState, useEffect } from 'react';

export default function TopAdBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [textDesktop, setTextDesktop] = useState("🎉 Exclusive Offer: First-time users get 10% OFF their booking!");
  const [textMobile, setTextMobile] = useState("🎉 10% OFF First Booking!");

  useEffect(() => {
    fetch('/api/settings/top-ad')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (typeof data.isVisible === 'boolean') setIsVisible(data.isVisible);
          if (data.textDesktop) setTextDesktop(data.textDesktop);
          if (data.textMobile) setTextMobile(data.textMobile);
        }
      })
      .catch(err => console.error('Failed to load top ad settings', err));
  }, []);

  useEffect(() => {
    if (!isVisible) {
      document.documentElement.style.setProperty('--top-ad-offset', '0px');
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY || 0;
      const offset = Math.max(0, 40 - scrollY);
      document.documentElement.style.setProperty('--top-ad-offset', `${offset}px`);
      
      const adBar = document.getElementById('main-top-ad-bar');
      if (adBar) {
        adBar.style.transform = `translateY(-${Math.min(scrollY, 40)}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.setProperty('--top-ad-offset', '0px');
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      id="main-top-ad-bar"
      className="top-ad-bar"
      style={{
        background: 'var(--brand-primary)',
        color: '#000',
        padding: '0 16px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9998,
        fontWeight: '600',
        fontSize: '14px',
        textAlign: 'center',
        willChange: 'transform'
      }}
    >
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
        <span className="hide-on-mobile">{textDesktop}</span>
        <span className="show-on-mobile" style={{ display: 'none' }}>{textMobile}</span>
        
        <button 
          className="top-ad-btn" 
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'offer' } }));
            }
          }}
          style={{
            background: '#000',
            color: 'var(--brand-primary)',
            border: 'none',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Claim Now
        </button>
      </div>
      
      <button 
        onClick={() => {
          setIsVisible(false);
          document.documentElement.style.setProperty('--top-ad-offset', '0px');
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#000',
          cursor: 'pointer',
          padding: '4px',
          position: 'absolute',
          right: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Close"
      >
        ✕
      </button>

      <style jsx>{`
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { display: inline-block !important; font-size: 11px !important; }
          .top-ad-btn { padding: 4px 8px !important; font-size: 10px !important; }
        }
      `}</style>
    </div>
  );
}
