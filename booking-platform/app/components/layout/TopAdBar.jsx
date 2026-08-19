"use client";

import React, { useState, useEffect } from 'react';

export default function TopAdBar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetch('/api/settings/top-ad')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.isVisible === 'boolean') {
          setIsVisible(data.isVisible);
        }
      })
      .catch(err => console.error('Failed to load top ad settings', err));

    const handleScroll = () => {
      const nav = document.querySelector('.lux-nav');
      if (nav) {
        if (window.scrollY > 40) {
          nav.style.setProperty('top', '0px', 'important');
        } else {
          nav.style.setProperty('top', `${40 - window.scrollY}px`, 'important');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      const nav = document.querySelector('.lux-nav');
      if (nav) nav.style.removeProperty('top');
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="top-ad-bar" style={{
      background: 'var(--brand-primary)',
      color: '#000',
      padding: '8px 16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      fontWeight: '600',
      fontSize: '14px',
      textAlign: 'center'
    }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
        <span className="hide-on-mobile">🎉 Exclusive Offer: First-time users get 10% OFF their booking!</span>
        <span className="show-on-mobile" style={{ display: 'none' }}>🎉 10% OFF First Booking!</span>
        
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
        onClick={() => setIsVisible(false)}
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
        .top-ad-bar {
          height: 40px;
          white-space: nowrap;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { display: inline-block !important; font-size: 11px !important; }
          .top-ad-btn { padding: 4px 8px !important; font-size: 10px !important; }
        }
      `}</style>
      <style jsx global>{`
        body {
          padding-top: 40px !important;
        }
        .lux-nav {
          top: 40px !important;
        }
      `}</style>
    </div>
  );
}
