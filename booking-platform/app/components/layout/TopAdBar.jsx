"use client";

import React, { useState, useEffect } from 'react';

export default function TopAdBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [textDesktop, setTextDesktop] = useState("🎉 Exclusive Offer: First-time users get 10% OFF their booking!");
  const [textMobile, setTextMobile] = useState("🎉 10% OFF First Booking!");
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetch('/api/settings/top-ad', { cache: 'no-store' })
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

  // Countdown timer logic
  useEffect(() => {
    // Target end of day (midnight)
    const getNextMidnight = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      return midnight.getTime();
    };

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = getNextMidnight() - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
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

  const pad = (num) => num.toString().padStart(2, '0');

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
        
        <div className="countdown-timer" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
          <span style={{ fontSize: '12px', opacity: 0.9 }}>Ends in:</span>
          <span className="time-block">{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
        </div>

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
        .time-block {
          font-family: monospace;
          font-weight: bold;
          font-size: 13px;
        }
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { display: inline-block !important; font-size: 11px !important; }
          .top-ad-btn { padding: 4px 8px !important; font-size: 10px !important; }
          .countdown-timer { gap: 2px !important; padding: 2px 4px !important; }
          .time-block { font-size: 11px; }
        }
      `}</style>
    </div>
  );
}
