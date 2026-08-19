"use client";

import React, { useState, useEffect } from 'react';

export default function TopAdBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [textDesktop, setTextDesktop] = useState("🎉 Exclusive Offer: First-time users get a special discount on their booking!");
  const [textMobile, setTextMobile] = useState("🎉 Special Discount on First Booking!");
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
      className="premium-ad-bar"
    >
      <div className="premium-ad-content">
        <span className="hide-on-mobile ad-text-main">{textDesktop}</span>
        <span className="show-on-mobile ad-text-main" style={{ display: 'none' }}>{textMobile}</span>
        
        <div className="mobile-action-row">
          <div className="premium-countdown-timer">
            <span className="timer-label">Ends in:</span>
            <div className="time-blocks">
              <span className="time-block">{pad(timeLeft.hours)}</span><span className="colon">:</span>
              <span className="time-block">{pad(timeLeft.minutes)}</span><span className="colon">:</span>
              <span className="time-block">{pad(timeLeft.seconds)}</span>
            </div>
          </div>

          <button 
            className="premium-claim-btn" 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'offer' } }));
              }
            }}
          >
            Claim Now
          </button>
        </div>
      </div>
      
      <button 
        className="premium-close-btn"
        onClick={() => {
          setIsVisible(false);
          document.documentElement.style.setProperty('--top-ad-offset', '0px');
        }}
        aria-label="Close"
      >
        ✕
      </button>

      <style jsx>{`
        .premium-ad-bar {
          background: linear-gradient(90deg, #121212 0%, #1a1a1a 50%, #121212 100%);
          color: #fff;
          padding: 0 16px;
          height: 44px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9998;
          font-family: var(--font-sans, system-ui, sans-serif);
          will-change: transform;
          border-bottom: 1px solid rgba(255, 224, 50, 0.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        
        .premium-ad-content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          flex-wrap: nowrap;
        }

        .mobile-action-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ad-text-main {
          font-weight: 600;
          font-size: 14px;
          color: #f8f8f8;
          text-shadow: 0 1px 2px rgba(0,0,0,0.8);
          letter-spacing: 0.3px;
        }

        .premium-countdown-timer {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 224, 50, 0.1);
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid rgba(255, 224, 50, 0.25);
        }

        .timer-label {
          font-size: 11px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        .time-blocks {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .time-block {
          background: #ffe032;
          color: #000;
          padding: 2px 5px;
          border-radius: 4px;
          font-family: monospace;
          font-weight: 800;
          font-size: 13px;
          min-width: 20px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(255, 224, 50, 0.3);
        }
        
        .colon {
          color: #ffe032;
          font-weight: 800;
          font-size: 12px;
        }

        .premium-claim-btn {
          background: linear-gradient(135deg, #ffe032 0%, #ffcc00 100%);
          color: #000;
          border: none;
          padding: 5px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255, 224, 50, 0.3);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .premium-claim-btn:hover {
          transform: translateY(-1px) scale(1.05);
          box-shadow: 0 4px 12px rgba(255, 224, 50, 0.5);
        }
        
        .premium-claim-btn:active {
          transform: translateY(1px);
        }

        .premium-close-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          padding: 6px;
          position: absolute;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          border-radius: 50%;
        }
        
        .premium-close-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.1);
        }

        @media (max-width: 768px) {
          .premium-ad-bar { 
            height: 40px; 
            padding: 0 28px 0 8px; 
          }
          .premium-ad-content { 
            gap: 6px; 
            flex-direction: row;
            padding-right: 0;
            width: 100%;
            justify-content: space-between;
          }
          .mobile-action-row {
            gap: 6px;
            width: auto;
          }
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { 
            display: inline-block !important; 
            width: auto; 
            font-size: 11px !important; 
            text-align: left; 
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
          }
          .premium-claim-btn { padding: 4px 10px; font-size: 10px; }
          .premium-countdown-timer { 
            padding: 0; 
            background: transparent; 
            border: none;
          }
          .timer-label { display: none; }
          .time-block { font-size: 11px; min-width: 16px; padding: 2px 3px; }
          .colon { font-size: 10px; }
          .premium-close-btn { right: 2px; top: 50%; transform: translateY(-50%); padding: 4px; }
        }
      `}</style>
    </div>
  );
}
