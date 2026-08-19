"use client";

import React, { useState, useEffect } from 'react';

export default function TopAdBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

  // Countdown timer logic
  useEffect(() => {
    // Set an initial deadline 12 hours from now for the demo
    const deadline = new Date().getTime() + 12 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

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
        background: 'linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%)',
        color: '#fff',
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
        willChange: 'transform',
        boxShadow: '0 2px 10px rgba(255, 75, 43, 0.3)'
      }}
    >
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'nowrap' }}>
        <span className="hide-on-mobile">🔥 Deal of the Day: Get <strong style={{color: '#ffdf00', fontSize: '1.1em'}}>20% OFF</strong> all bookings!</span>
        <span className="show-on-mobile" style={{ display: 'none' }}>🔥 <strong style={{color: '#ffdf00'}}>20% OFF</strong> Deal!</span>
        
        <div className="countdown-timer" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
          <span style={{ fontSize: '12px', opacity: 0.9 }}>Ends in:</span>
          <span className="time-block">{pad(timeLeft.hours)}</span>:
          <span className="time-block">{pad(timeLeft.minutes)}</span>:
          <span className="time-block">{pad(timeLeft.seconds)}</span>
        </div>

        <button 
          className="top-ad-btn" 
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'offer' } }));
            }
          }}
          style={{
            background: '#fff',
            color: '#ff4b2b',
            border: 'none',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
          color: '#fff',
          cursor: 'pointer',
          padding: '4px',
          position: 'absolute',
          right: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.8
        }}
        aria-label="Close"
      >
        ✕
      </button>

      <style jsx>{`
        .time-block {
          background: #000;
          color: #fff;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 13px;
          min-width: 22px;
          display: inline-block;
          text-align: center;
        }
        @media (max-width: 768px) {
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { display: inline-block !important; font-size: 11px !important; }
          .top-ad-btn { padding: 4px 8px !important; font-size: 10px !important; }
          .countdown-timer { gap: 2px !important; padding: 2px 4px !important; }
          .time-block { font-size: 11px; min-width: 18px; padding: 1px 2px; }
        }
      `}</style>
    </div>
  );
}
