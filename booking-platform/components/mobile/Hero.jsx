"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HERO_STATS, HERO_SPOTLIGHT_SLIDES } from '@/app/constants';

const MOBILE_HERO_MEDIA = [
  { type: 'video', src: '/assets/hero-gifs/Book_a_Bhajan_concert_at_home_Portrait.mp4' },
  { type: 'video', src: '/assets/hero-gifs/farm_house_Portrait.mp4' },
  ...HERO_SPOTLIGHT_SLIDES.map(src => ({ type: 'image', src: typeof src === 'object' ? src.src : src }))
];

function HeroMediaComponent({ item, isActive, onEnded }) {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (isActive && item.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [isActive, item.type]);

  return (
    <div
      className={`hp-hero-slide ${isActive ? 'is-active' : ''}`}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: isActive ? 1 : 0,
        zIndex: isActive ? 2 : 1,
        transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'opacity'
      }}
    >
      {item.type === 'video' ? (
        <video
          ref={videoRef}
          src={item.src}
          autoPlay
          muted
          playsInline
          onEnded={onEnded}
          style={{ objectFit: "cover", width: "100%", height: "100%", position: "absolute", inset: 0 }}
         />
      ) : (
        <img
          src={item.src}
          alt="Event slide"
          style={{ objectFit: "cover", width: "100%", height: "100%", position: "absolute", inset: 0 }}
        />
      )}
    </div>
  );
}

export default function MobileHero() {
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    if (heroSlide >= 2) {
      const id = window.setInterval(() => {
        setHeroSlide(prev => (prev + 1) % MOBILE_HERO_MEDIA.length);
      }, 4500);
      return () => window.clearInterval(id);
    }
  }, [heroSlide]);

  return (
    <section className="mobile-hero">
      <div className="mobile-hero-bg" style={{ position: 'absolute', inset: 0, background: '#000' }}>
        {MOBILE_HERO_MEDIA.map((item, idx) => (
          <HeroMediaComponent 
            key={item.src + idx} 
            item={item} 
            isActive={heroSlide === idx} 
            onEnded={() => setHeroSlide(prev => (prev + 1) % MOBILE_HERO_MEDIA.length)} 
          />
        ))}
        {/* Subtle gradient overlay to make text pop without making video too dark */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)' }} />
      </div>
      <div className="mobile-shell mobile-hero-content">
        <h1 className="mobile-hero-h1">
          Book A <span style={{ color: '#FFE032' }}>Musician</span><br/>
          For Your <span style={{ color: '#FFE032' }}>Grand Event!</span>
        </h1>
        
        <div style={{ marginBottom: '24px' }}>
          <a href="tel:+918076515257" style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', background: 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '100px',
            color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '600'
          }}>
            <span>📞</span> Contact Us on <strong style={{ color: '#FFE032' }}>+91 80765 15257</strong>
          </a>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }))}
            className="mobile-btn"
            style={{ background: 'linear-gradient(135deg, #e53e3e 0%, #8b2d2d 100%)', color: '#fff' }}
          >
            Book Now
          </button>
          <Link href="/artists" className="mobile-btn" style={{ background: 'transparent', border: '1px solid #FFE032', color: '#FFE032' }}>
            View All Artists
          </Link>
        </div>
        
        <div className="mobile-stats">
          {HERO_STATS.slice(0, 2).map(item => (
            <div key={item.label} className="mobile-stat-card">
              <strong>{item.value}{item.suffix}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
