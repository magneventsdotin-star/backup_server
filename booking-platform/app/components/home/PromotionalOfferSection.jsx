"use client";

import React, { useState, useEffect } from 'react';
import '@/app/styles/components/PromotionalOfferSection.css';

export default function PromotionalOfferSection({ 
  className = "",
  category = "",
  city = ""
}) {
  const isContextual = Boolean(category && city);
  const defaultHeadline = isContextual 
    ? `Book Verified ${category} in ${city} with ₹99 Token Advance!`
    : "Get Up to 60% OFF on Your First Event Booking!";

  const [headline, setHeadline] = useState(defaultHeadline);
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 19, seconds: 15 });

  useEffect(() => {
    if (isContextual) {
      setHeadline(`Book Verified ${category} in ${city} for ₹99 Token Advance!`);
      return;
    }
    fetch('/api/settings/top-ad', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && data.textDesktop) {
          setHeadline(data.textDesktop.replace(/^[🎉\s]+/, ''));
        }
      })
      .catch(() => {});
  }, [isContextual, category, city]);

  // Midnight countdown
  useEffect(() => {
    const getNextMidnight = () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    };

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = getNextMidnight() - now;
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaimOffer = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'offer' } }));
    }
  };

  const pad = (n) => n.toString().padStart(2, '0');

  return (
    <section className={`lux-promo-section-wrap ${className}`} aria-label="Limited Time Offer">
      <div className="lux-promo-section-card">
        <div className="lux-promo-bg-glow" aria-hidden="true" />
        <div className="lux-promo-bg-glow-left" aria-hidden="true" />

        {/* Left column */}
        <div className="lux-promo-left-col">
          <div className="lux-promo-badge-row">
            <span className="lux-promo-pill">
              <span className="lux-promo-live-dot" />
              <span>{isContextual ? `Exclusive ${city} Offer` : "Limited Time Offer"}</span>
            </span>
            <span className="lux-promo-code-pill">
              {isContextual ? "Token: ₹99 ONLY" : "Code: FIRSTEVENT60"}
            </span>
          </div>

          <h2 className="lux-promo-headline">
            🎉 <span className="lux-promo-headline-grad">{headline}</span>
          </h2>

          <p className="lux-promo-desc">
            {isContextual 
              ? `Book verified ${category} in ${city} for your date with only ₹99 token advance. 100% Artist Arrival Guarantee with zero middleman charges — token is fully adjusted into your artist fee!`
              : "Book verified live singers, bands, or DJs across India with 0% middleman fees and our legally binding 100% Artist Arrival Guarantee."
            }
          </p>

          <div className="lux-promo-perks-row">
            <span className="lux-promo-perk">
              <span className="icon">🛡️</span> 100% Arrival Guarantee
            </span>
            <span className="lux-promo-perk">
              <span className="icon">💎</span> 0% Agency Markup
            </span>
            <span className="lux-promo-perk">
              <span className="icon">🎟️</span> ₹99 Adjustable Token
            </span>
          </div>
        </div>

        {/* Right column */}
        <div className="lux-promo-right-col">
          <div className="lux-promo-timer-card">
            <span className="lux-promo-timer-label">Ends in:</span>
            <div className="lux-promo-timer-digits">
              <span className="lux-promo-digit-box">{pad(timeLeft.hours)}</span>
              <span>:</span>
              <span className="lux-promo-digit-box">{pad(timeLeft.minutes)}</span>
              <span>:</span>
              <span className="lux-promo-digit-box">{pad(timeLeft.seconds)}</span>
            </div>
          </div>

          <div className="lux-promo-actions-group">
            {isContextual ? (
              <a
                href="#hero-book-99"
                className="lux-promo-main-btn"
                style={{ textDecoration: 'none' }}
              >
                <span>Pay ₹99 &amp; Book {category}</span>
                <span>→</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={handleClaimOffer}
                className="lux-promo-main-btn"
              >
                <span>Claim 60% OFF Now</span>
                <span>→</span>
              </button>
            )}
            <a
              href={`https://wa.me/918076515257?text=${encodeURIComponent(
                isContextual
                  ? `Hi Magnevents! I want to pay ₹99 token and book a verified ${category} in ${city} for my upcoming event.`
                  : "Hi Magnevents! I want to claim the 60% OFF first booking discount for my event."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="lux-promo-wa-btn"
            >
              <span>💬 WhatsApp Offer</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
