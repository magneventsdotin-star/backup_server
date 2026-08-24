"use client";

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

import { HERO_SPOTLIGHT_SLIDES } from '@/app/constants'

export default function HeroSection() {
  const [heroSlide, setHeroSlide] = useState(0)
  const [mobCardSlide, setMobCardSlide] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }
    const id = window.setInterval(() => {
      setHeroSlide(prev => (prev + 1) % HERO_SPOTLIGHT_SLIDES.length)
    }, 8000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="hp-hero-wrapper">
      {/* BACKGROUND (Shared for both) */}
      <div className="hp-hero-bg" style={{ pointerEvents: 'none' }}>
        {HERO_SPOTLIGHT_SLIDES.map((src, idx) => (
          <div
            key={src}
            className={`hp-hero-slide ${heroSlide === idx ? 'is-active' : ''}`}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: heroSlide === idx ? 1 : 0,
              zIndex: heroSlide === idx ? 2 : 1,
              transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'opacity'
            }}
          >
            <Image
              src={typeof src === "object" ? src?.src : src}
              alt={`Live singer and band performing at an event slide ${idx + 1}`} 
              fill
              priority={idx === 0}
              sizes="100vw"
              style={{ objectFit: "cover" }}
             />
          </div>
        ))}
      </div>
      <div className="hp-hero-overlay" aria-hidden="true" />
      <div className="hp-hero-radial-glow" aria-hidden="true" />
      <div className="hp-mobile-hero-overlay" aria-hidden="true" />

      {/* ======================================================== */}
      {/* DESKTOP HERO (DO NOT MODIFY, strictly preserved) */}
      {/* ======================================================== */}
      <div className="hp-hero hp-desktop-hero">
        <div className="hp-shell hp-hero-content">
          <div className="hp-hero-split">
            
            {/* LEFT 60% */}
            <div className="hp-hero-left">
              <motion.div 
                className="hp-premium-badge"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                India's Premier Event Booking Platform
              </motion.div>

              <motion.h1
                className="hp-hero-h1"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0, y: 15, filter: 'blur(8px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                  }
                }}
              >
                Book a <i className="hp-gradient-text italic">Verified Singer</i><br className="hp-desktop-br" /> Anywhere in India
              </motion.h1>

              <motion.p 
                className="hp-hero-sub"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                Book India's verified singers for weddings, corporate events and celebrations.
                Get instant quotes with transparent pricing and expert booking support.
              </motion.p>

              <motion.div 
                className="hp-trust-chips"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05, delayChildren: 0.2 }
                  }
                }}
              >
                {['✔ Verified Artists', '⚡ Instant Quotes', '🛡 Secure Booking', '💰 Transparent Pricing', '🇮🇳 Pan India', '24×7 Support'].map(chip => (
                  <motion.span 
                    key={chip} 
                    className="hp-trust-chip"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    {chip}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                className="hp-hero-actions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }))}
                  className="hp-btn hp-btn-primary hp-btn-glow"
                >
                  <span>Get Free Quote &rarr;</span>
                </button>
                <Link href="/artists" className="hp-btn hp-btn-glass">
                  Check Artist Availability
                </Link>
              </motion.div>
            </div>

            {/* RIGHT 40% */}
            <div className="hp-hero-right">
              <motion.div 
                className="hp-glass-card-wrapper"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mob-premium-slider-card">
                  <div className="mps-header">
                    <span className="mps-title">
                      {mobCardSlide === 0 ? "Why Choose Magnevents?" : mobCardSlide === 1 ? "How to Book?" : "Our Reviews"}
                    </span>
                    <div className="mps-dots">
                      <span className={`mps-dot ${mobCardSlide === 0 ? 'active' : ''}`} onClick={() => setMobCardSlide(0)} />
                      <span className={`mps-dot ${mobCardSlide === 1 ? 'active' : ''}`} onClick={() => setMobCardSlide(1)} />
                      <span className={`mps-dot ${mobCardSlide === 2 ? 'active' : ''}`} onClick={() => setMobCardSlide(2)} />
                    </div>
                  </div>

                  <div className="mps-body">
                    {mobCardSlide === 0 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mps-slide">
                        <div className="mps-inner-card">
                          <h4 className="mps-slide-title">🎤 Why Choose Magnevents?</h4>
                          <ul className="mps-list">
                            <li><span className="mps-check">✓</span> Verified Professional Artists</li>
                            <li><span className="mps-check">✓</span> Fast Booking Process</li>
                            <li><span className="mps-check">✓</span> Transparent Pricing</li>
                            <li><span className="mps-check">✓</span> Event Expert Support</li>
                            <li><span className="mps-check">✓</span> 24/7 Assistance</li>
                            <li><span className="mps-check">✓</span> Pan India Service</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}
                    
                    {mobCardSlide === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mps-slide">
                        <div className="mps-inner-card">
                          <h4 className="mps-slide-title">📱 How to Book?</h4>
                          <ul className="mps-list">
                            <li><span className="mps-check">1️⃣</span> Share your event details</li>
                            <li><span className="mps-check">2️⃣</span> Get curated artist options</li>
                            <li><span className="mps-check">3️⃣</span> Compare prices & profiles</li>
                            <li><span className="mps-check">4️⃣</span> Confirm booking securely</li>
                            <li><span className="mps-check">5️⃣</span> Enjoy a flawless performance</li>
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    {mobCardSlide === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mps-slide">
                        <div className="mps-inner-card">
                          <h4 className="mps-slide-title">⭐ Our Reviews</h4>
                          <div className="mps-review">
                            <p>"Magnevents made our wedding unforgettable! The singer was phenomenal."</p>
                            <span>- Priya S., Mumbai</span>
                          </div>
                          <div className="mps-review">
                            <p>"Super transparent and professional. Highly recommended for corporate events."</p>
                            <span>- Rahul M., Delhi</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="mps-footer">
                    <span className="mps-chip">⚡ Response in 5 Mins</span>
                    <span className="mps-chip">💵 Transparent Pricing</span>
                    <span className="mps-chip">🛡 Verified Artists</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE HERO (Premium App-Like Layout) */}
      {/* ======================================================== */}
      <div className="hp-mobile-hero">
        <div className="hp-mobile-content">
          
          {/* Section 1: Badge */}
          <div className="hp-mob-section">
            <div className="hp-mob-badge">
              <span className="mob-stars">⭐⭐⭐⭐⭐</span> Trusted by 2500+ Happy Clients
            </div>
          </div>

          {/* Section 2: Headline */}
          <div className="hp-mob-section">
            <h1 className="hp-mob-h1">
              Book a <span className="hp-gradient-text">Verified Singer</span> Anywhere in India
            </h1>
          </div>

          {/* Section 3: Subtitle */}
          <div className="hp-mob-section">
            <p className="hp-mob-sub">
              Book from 1500+ verified artists for weddings, birthdays, corporate events and private parties with instant quotations.
            </p>
          </div>

          {/* Section 4: Trust Cards */}
          <div className="hp-mob-section">
            <div className="hp-mob-trust-grid">
              <div className="mob-trust-card"><span className="mob-check">✓</span> Verified Artists</div>
              <div className="mob-trust-card"><span className="mob-check">✓</span> Instant Quotes</div>
              <div className="mob-trust-card"><span className="mob-check">✓</span> Transparent Pricing</div>
              <div className="mob-trust-card"><span className="mob-check">✓</span> Pan India</div>
            </div>
          </div>

          {/* Section 5: CTAs */}
          <div className="hp-mob-section hp-mob-cta-section">
            <button 
              className="mob-btn-primary"
              onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }))}
            >
              Get Free Quote
            </button>
            <Link href="/artists" className="mob-btn-secondary">
              Browse Artists
            </Link>
            <div className="mob-micro-copy">
              <span>✔ Response in Minutes</span>
              <span>✔ No Hidden Charges</span>
              <span>✔ Dedicated Booking Expert</span>
            </div>
          </div>

          {/* Section 6: Mobile Premium Slider Card */}
          <div className="hp-mob-section">
            <div className="mob-premium-slider-card">
              <div className="mps-header">
                <span className="mps-title">
                  {mobCardSlide === 0 ? "Why Choose Magnevents?" : mobCardSlide === 1 ? "How to Book?" : "Our Reviews"}
                </span>
                <div className="mps-dots">
                  <span className={`mps-dot ${mobCardSlide === 0 ? 'active' : ''}`} onClick={() => setMobCardSlide(0)} />
                  <span className={`mps-dot ${mobCardSlide === 1 ? 'active' : ''}`} onClick={() => setMobCardSlide(1)} />
                  <span className={`mps-dot ${mobCardSlide === 2 ? 'active' : ''}`} onClick={() => setMobCardSlide(2)} />
                </div>
              </div>

              <div className="mps-body">
                {mobCardSlide === 0 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mps-slide">
                    <div className="mps-inner-card">
                      <h4 className="mps-slide-title">🎤 Why Choose Magnevents?</h4>
                      <ul className="mps-list">
                        <li><span className="mps-check">✓</span> Verified Professional Artists</li>
                        <li><span className="mps-check">✓</span> Fast Booking Process</li>
                        <li><span className="mps-check">✓</span> Transparent Pricing</li>
                        <li><span className="mps-check">✓</span> Event Expert Support</li>
                        <li><span className="mps-check">✓</span> 24/7 Assistance</li>
                        <li><span className="mps-check">✓</span> Pan India Service</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
                
                {mobCardSlide === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mps-slide">
                    <div className="mps-inner-card">
                      <h4 className="mps-slide-title">📱 How to Book?</h4>
                      <ul className="mps-list">
                        <li><span className="mps-check">1️⃣</span> Share your event details</li>
                        <li><span className="mps-check">2️⃣</span> Get curated artist options</li>
                        <li><span className="mps-check">3️⃣</span> Compare prices & profiles</li>
                        <li><span className="mps-check">4️⃣</span> Confirm booking securely</li>
                        <li><span className="mps-check">5️⃣</span> Enjoy a flawless performance</li>
                      </ul>
                    </div>
                  </motion.div>
                )}

                {mobCardSlide === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mps-slide">
                    <div className="mps-inner-card">
                      <h4 className="mps-slide-title">⭐ Our Reviews</h4>
                      <div className="mps-review">
                        <p>"Magnevents made our wedding unforgettable! The singer was phenomenal."</p>
                        <span>- Priya S., Mumbai</span>
                      </div>
                      <div className="mps-review">
                        <p>"Super transparent and professional. Highly recommended for corporate events."</p>
                        <span>- Rahul M., Delhi</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="mps-footer">
                <span className="mps-chip">⚡ Response in 5 Mins</span>
                <span className="mps-chip">💵 Transparent Pricing</span>
                <span className="mps-chip">🛡 Verified Artists</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="hp-mob-sticky-cta">
        <button 
          className="mob-sticky-btn"
          onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }))}
        >
          🎤 Get Free Quote
        </button>
      </div>

      {/* Hidden SEO Paragraph for bots */}
      <div className="sr-only">
        <p>Looking to book a singer online for your next celebration? Whether you want to hire a singer for an intimate gathering or need a professional wedding singer to create magical moments, we offer a seamless singer booking platform. Explore our diverse roster of verified singers ranging from soulful Bollywood performers to high-energy corporate event singers and house party singers. Enjoy transparent pricing and hire a professional singer instantly. Let us help you find the perfect birthday party singer or live artist. Book artists online with complete peace of mind today.</p>
      </div>
    </section>
  )
}
