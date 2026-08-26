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

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

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
      if (typeof window !== 'undefined' && window.innerWidth <= 768) return;
      const scrollY = window.scrollY || 0;
      const offset = Math.max(0, 48 - scrollY);
      document.documentElement.style.setProperty('--top-ad-offset', `${offset}px`);
      
      const adBar = document.getElementById('main-top-ad-bar');
      if (adBar) {
        adBar.style.transform = `translateY(-${Math.min(scrollY, 48)}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.setProperty('--top-ad-offset', '0px');
    };
  }, [isVisible]);

  if (!isVisible || !isMounted) return null;

  const pad = (num) => num.toString().padStart(2, '0');

  return (
    <div
      id="main-top-ad-bar"
      className="ultimate-ad-bar"
    >
      <div className="ultimate-ad-content">
        <span className="hide-on-mobile ad-text-main">{textDesktop}</span>
        <span className="show-on-mobile ad-text-main" style={{ display: 'none' }}>{textMobile}</span>
        
        <div className="mobile-action-row">
          <div className="ultimate-countdown-timer">
            <span className="timer-label">Ends in:</span>
            <div className="time-blocks">
              <span className="time-block">{pad(timeLeft.hours)}</span><span className="colon">:</span>
              <span className="time-block">{pad(timeLeft.minutes)}</span><span className="colon">:</span>
              <span className="time-block">{pad(timeLeft.seconds)}</span>
            </div>
          </div>

          <button 
            className="ultimate-claim-btn" 
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
        className="ultimate-close-btn"
        onClick={() => {
          setIsVisible(false);
          document.documentElement.style.setProperty('--top-ad-offset', '0px');
        }}
        aria-label="Close"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 1L11 11M11 1L1 11" />
        </svg>
      </button>

      <style jsx>{`
        .ultimate-ad-bar {
          /* Animated Gradient Background */
          background: linear-gradient(115deg, #ff007b, #6b00ff, #00d4ff, #ff007b);
          background-size: 300% 300%;
          animation: gradientShift 10s ease infinite;
          
          color: #ffffff;
          padding: 0 16px;
          height: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9998;
          font-family: var(--font-sans, system-ui, sans-serif);
          box-shadow: 0 4px 20px rgba(107, 0, 255, 0.4);
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .ultimate-ad-content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          flex-wrap: nowrap;
          max-width: 1200px;
          margin: 0 auto;
        }

        .mobile-action-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ad-text-main {
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.2px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
        }

        .ultimate-countdown-timer {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .timer-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 800;
          opacity: 0.9;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .time-blocks {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .time-block {
          /* Glassmorphism Blocks */
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #ffffff;
          padding: 4px 6px;
          border-radius: 6px;
          font-family: monospace;
          font-weight: 800;
          font-size: 14px;
          min-width: 24px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .colon {
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
          opacity: 0.8;
        }

        .ultimate-claim-btn {
          background: #ffffff;
          color: #6b00ff;
          border: none;
          padding: 6px 20px;
          border-radius: 24px;
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          white-space: nowrap;
        }

        .ultimate-claim-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.5);
          color: #ff007b;
        }
        
        .ultimate-claim-btn:active {
          transform: translateY(1px) scale(0.98);
        }

        .ultimate-close-btn {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          color: #ffffff;
          cursor: pointer;
          width: 28px;
          height: 28px;
          position: absolute;
          right: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          border-radius: 50%;
        }
        
        .ultimate-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        @media (max-width: 768px) {
          .ultimate-ad-bar { 
            position: absolute !important;
            top: 0 !important;
            transform: none !important;
            height: 48px; 
            padding: 0 40px 0 12px; 
          }
          .ultimate-ad-content { 
            gap: 8px; 
            flex-direction: row;
            padding-right: 0;
            width: 100%;
            justify-content: space-between;
          }
          .mobile-action-row {
            gap: 8px;
            width: auto;
          }
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { 
            display: inline-block !important; 
            width: auto; 
            font-size: 12px !important; 
            text-align: left; 
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex: 1;
            font-weight: 700;
          }
          .ultimate-claim-btn { 
            padding: 5px 12px; 
            font-size: 10px; 
            letter-spacing: 0.5px;
          }
          .timer-label { display: none; }
          .time-block { 
            font-size: 11px; 
            min-width: 18px; 
            padding: 3px 4px; 
            border-radius: 4px;
          }
          .colon { font-size: 11px; }
          .ultimate-close-btn { 
            right: 8px; 
            width: 24px;
            height: 24px;
          }
        }
      `}</style>
    </div>
  );
}
