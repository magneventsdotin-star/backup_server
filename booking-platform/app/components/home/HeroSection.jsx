"use client";

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { HERO_STATS, HERO_SPOTLIGHT_SLIDES } from '@/app/constants'

const HERO_MEDIA = [
  { type: 'video', src: '/assets/hero-gifs/house_party_Landscape.mp4' },
  { type: 'video', src: '/assets/hero-gifs/Birthday_Party_Landscape.mp4' },
  ...HERO_SPOTLIGHT_SLIDES.map(src => ({ type: 'image', src: typeof src === 'object' ? src.src : src }))
];

const MOBILE_HERO_MEDIA = [
  { type: 'video', src: '/assets/hero-gifs/farm_house_Portrait.mp4' },
  { type: 'video', src: '/assets/hero-gifs/Book_a_Bhajan_concert_at_home_Portrait.mp4' },
  ...HERO_SPOTLIGHT_SLIDES.map(src => ({ type: 'image', src: typeof src === 'object' ? src.src : src }))
];

function HeroMediaComponent({ item, isActive, onEnded }) {
  const videoRef = useRef(null);
  
  useEffect(() => {
    if (isActive && item.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = 0.85; // Slow down video to increase screen time
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

export default function HeroSection() {
  const [heroSlide, setHeroSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    const mql = window.matchMedia('(max-width: 768px)');
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const currentMedia = isMobile ? MOBILE_HERO_MEDIA : HERO_MEDIA;

    // Transition ALL slides (videos and images) every 4 seconds
    const id = window.setTimeout(() => {
      setHeroSlide(prev => (prev + 1) % currentMedia.length)
    }, 4000)
    
    return () => window.clearTimeout(id)
  }, [heroSlide, isMobile])

  const activeMediaList = isMobile ? MOBILE_HERO_MEDIA : HERO_MEDIA;

  return (
    <section className="hp-hero">
      <div className="hp-hero-bg" style={{ pointerEvents: 'none', background: '#000' }}>
        {activeMediaList.map((item, idx) => (
          <HeroMediaComponent 
            key={item.src + idx} 
            item={item} 
            isActive={heroSlide === idx} 
            onEnded={() => setHeroSlide(prev => (prev + 1) % activeMediaList.length)} 
          />
        ))}
      </div>

      <div className="hp-shell hp-hero-content">
        <div className="hp-hero-grid">
          <div className="hp-hero-main full-width">
            <motion.h1
              className="hp-hero-h1"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 1, y: 15, filter: 'blur(8px)' },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { staggerChildren: 0.05, delayChildren: 0.0 }
                }
              }}
            >
              {"Book A".split(" ").map((word, i) => (
                <motion.span key={`w1-${i}`} style={{ display: 'inline-block', marginRight: '0.25em' }} variants={{ hidden: { opacity: 1, y: 15, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
                  {word}
                </motion.span>
              ))}
              <motion.span 
                className="hp-gradient-text accent-text" 
                style={{ display: 'inline-block', marginRight: '0.25em' }}
                variants={{ hidden: { opacity: 1, y: 15, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
              >
                Singer
              </motion.span>
              {"For Your House Party In".split(" ").map((word, i) => (
                <motion.span key={`w2-${i}`} style={{ display: 'inline-block', marginRight: '0.25em' }} variants={{ hidden: { opacity: 1, y: 15, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
                  {word}
                </motion.span>
              ))}
              <motion.span 
                className="hp-gradient-text accent-text" 
                style={{ display: 'inline-block', marginRight: '0.15em' }}
                variants={{ hidden: { opacity: 1, y: 15, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
              >
                Delhi
              </motion.span>
              <motion.span 
                className="hp-gradient-text accent-text" 
                style={{ display: 'inline-block' }}
                variants={{ hidden: { opacity: 1, y: 15, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
              >
                NCR!
              </motion.span>
            </motion.h1>

            <motion.div
              className="hp-hero-contact-wrap"
              initial={{ opacity: 1, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <a href="tel:+918076515257" className="hp-hero-contact-pill">
                <span className="hp-contact-icon">📞</span>
                <span>Contact Us on <strong>+91 80765 15257</strong></span>
              </a>
            </motion.div>

            <motion.div
              className="hp-hero-actions"
              initial={{ opacity: 1, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }))}
                className="hp-btn hp-btn-primary"
              >
                <span>Book Now</span>
                <span className="hp-btn-shine" aria-hidden="true" />
              </button>
              <Link href="/artists" className="hp-btn hp-btn-ghost">
                View All Artists
              </Link>
            </motion.div>

            <motion.div
              className="hp-stats"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 1 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.5 }
                }
              }}
            >
              {HERO_STATS.map(item => (
                <motion.div 
                  key={item.label} 
                  className="hp-stat-card"
                  variants={{
                    hidden: { opacity: 1, y: 15, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                >
                  <strong>
                    {item.value}{item.suffix}
                  </strong>
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}



