"use client";

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import { HERO_SPOTLIGHT_SLIDES } from '@/app/constants'

export default function HeroSection() {
  const router = useRouter()
  const [heroSlide, setHeroSlide] = useState(0)
  const [mobCardSlide, setMobCardSlide] = useState(0)

  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/ai-search?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      window.dispatchEvent(new CustomEvent('open-quick-booking'))
    }
  }

  const QUICK_TAGS = [
    { label: 'Bollywood Hits 🎤', query: 'Bollywood singer for party' },
    { label: 'Acoustic / Unplugged 🎸', query: 'Acoustic guitarist singer' },
    { label: 'Sufi & Ghazal 🌙', query: 'Sufi singer in Delhi NCR' },
    { label: 'Live Bands 🥁', query: 'Live band for wedding' },
  ]

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
              unoptimized
              fetchPriority={idx === 0 ? "high" : "auto"}
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
      {/* DESKTOP HERO - LUXURY SINGLE WINDOW PROPER               */}
      {/* ======================================================== */}
      <div className="hp-hero hp-desktop-hero hp-single-window">
        <div className="hp-shell hp-sw-shell">
          <div className="hp-sw-content">

            {/* 1. TOP TRUST BADGE */}
            <motion.div
              className="hp-sw-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <span className="hp-sw-badge-trophy">🏆</span>
              <span className="hp-sw-badge-text">
                India&apos;s #1 Live Artist &amp; Singer Booking Platform
              </span>
              <span className="hp-sw-badge-dot">•</span>
              <span className="hp-sw-badge-highlight">0% Commission Markup</span>
            </motion.div>

            {/* 2. MAIN HEADLINE */}
            <motion.h1
              className="hp-sw-h1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="hp-sw-h1-lead">Book Singer for </span>
              <br className="hp-sw-br" />
              <span className="hp-sw-h1-gold">House Party in Delhi &amp; NCR</span>
            </motion.h1>

            {/* 3. SUBTITLE */}
            <motion.p
              className="hp-sw-sub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Book from <strong>1,500+ verified singers &amp; bands</strong> for weddings, corporate events &amp; house parties. Instant transparent quotes with <strong>100% artist arrival guarantee</strong>.
            </motion.p>

            {/* 4. FAST AI SEARCH & MATCH INPUT BAR */}
            <motion.form
              onSubmit={handleSearchSubmit}
              className="hp-sw-search-bar"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <span className="hp-sw-search-sparkle">✨</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What artist do you need? e.g. Bollywood singer under ₹25k, Acoustic, Sufi..."
                className="hp-sw-search-input"
                aria-label="Search singer or live artist"
              />
              <button type="submit" className="hp-sw-search-btn">
                <span>Match Artist</span>
                <span className="hp-sw-btn-arrow">➔</span>
              </button>
            </motion.form>

            {/* 5. QUICK SUGGESTION CHIPS */}
            <motion.div
              className="hp-sw-quick-tags"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <span className="hp-sw-tags-label">Trending:</span>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => router.push(`/ai-search?q=${encodeURIComponent(tag.query)}`)}
                  className="hp-sw-tag-chip"
                >
                  {tag.label}
                </button>
              ))}
            </motion.div>

            {/* 6. PRIMARY ACTION BUTTONS */}
            <motion.div
              className="hp-sw-actions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
            >
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-quick-booking'))}
                className="hp-sw-btn-primary"
              >
                <span>Get Free Instant Quote</span>
                <span className="hp-sw-arrow">→</span>
              </button>

              <Link href="/artists" className="hp-sw-btn-glass">
                <span>Check Artist Availability</span>
                <span className="hp-sw-icon">📅</span>
              </Link>

              <a href="tel:+918076515257" className="hp-sw-btn-call">
                <span className="hp-sw-call-icon">📞</span>
                <span>+91 80765 15257</span>
              </a>
            </motion.div>

            {/* 7. QUICK TRUST PROOF PILLS */}
            <motion.div
              className="hp-sw-trust-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="hp-sw-trust-pill">★ 4.9 Google Rating</div>
              <div className="hp-sw-trust-pill">👥 2,500+ Celebrated Events</div>
              <div className="hp-sw-trust-pill">🛡️ 100% Verified Artists</div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: SLEEK "WHY CHOOSE MAGNEVENTS" FROSTED GLASS CARD */}
          <motion.div
            className="hp-sw-why-card"
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hp-sw-why-header">
              <div className="hp-sw-why-badge-icon">🎤</div>
              <div className="hp-sw-why-header-text">
                <h3 className="hp-sw-why-title">Why Choose Magnevents?</h3>
                <span className="hp-sw-why-subtitle">India&apos;s 1st AI Live Music Network</span>
              </div>
            </div>

            <div className="hp-sw-why-list">
              <div className="hp-sw-why-item">
                <span className="hp-sw-why-icon">🛡️</span>
                <div className="hp-sw-why-text">
                  <strong>100% Artist Arrival Guarantee</strong>
                  <span>Backed by instant emergency replacement</span>
                </div>
              </div>

              <div className="hp-sw-why-item">
                <span className="hp-sw-why-icon">💎</span>
                <div className="hp-sw-why-text">
                  <strong>Direct Pricing (0% Markup)</strong>
                  <span>Direct transparent rates with zero middlemen</span>
                </div>
              </div>

              <div className="hp-sw-why-item">
                <span className="hp-sw-why-icon">✨</span>
                <div className="hp-sw-why-text">
                  <strong>Smart AI Artist Match</strong>
                  <span>Instant match by genre, city &amp; budget</span>
                </div>
              </div>

              <div className="hp-sw-why-item">
                <span className="hp-sw-why-icon">🎧</span>
                <div className="hp-sw-why-text">
                  <strong>Dedicated Event Manager</strong>
                  <span>24/7 expert support &amp; sound coordination</span>
                </div>
              </div>
            </div>

            <div className="hp-sw-why-footer">
              <span className="hp-sw-why-tag">⭐ 4.9★ Rated</span>
              <span className="hp-sw-why-dot">•</span>
              <span className="hp-sw-why-tag">👥 2500+ Shows</span>
              <span className="hp-sw-why-dot">•</span>
              <span className="hp-sw-why-tag">Pan-India</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE HERO (Premium App-Like Layout) */}
      {/* ======================================================== */}
      <div className="hp-mobile-hero">
        <div className="hp-mobile-content">
          
          {/* Section 0: TOP AI SEARCH BANNER (Top of Mobile View) */}
          <div className="hp-mob-section hp-mob-top-ai-section">
            <Link href="/ai-search" className="mob-top-ai-banner">
              <div className="mob-top-ai-left">
                <span className="mob-top-ai-sparkle">✨</span>
                <span className="mob-top-ai-text">
                  <strong className="mob-top-ai-gold">AI Search:</strong> Find Best Match in 10s
                </span>
              </div>
              <span className="mob-top-ai-pill">TRY AI SEARCH ➔</span>
            </Link>
          </div>

          {/* Section 1: Badge + Quick AI Match Pill */}
          <div className="hp-mob-section">
            <div className="hp-mob-badge-row">
              <div className="hp-mob-badge" style={{ background: 'rgba(255, 224, 50, 0.12)', border: '1px solid rgba(255, 224, 50, 0.3)', color: '#FFE032', fontWeight: '700' }}>
                <span>🏆 #1 Artist Booking Platform</span>
              </div>
              <Link href="/ai-search" className="hp-mob-ai-chip-top">
                <span>✨ AI Search</span>
                <span className="arrow">➔</span>
              </Link>
            </div>
          </div>

          {/* Section 2: Headline */}
          <div className="hp-mob-section">
            <h1 className="hp-mob-h1">
              <span className="hp-mob-lead-text">Book Singer for</span> <br />
              <span className="hp-mob-gold-text">House Party in Delhi</span> <br />
              <span className="hp-mob-amp">&amp; </span>
              <span className="hp-mob-gold-text">Delhi NCR</span>
            </h1>
          </div>

          {/* Section 3: Subtitle / Description Text */}
          <div className="hp-mob-section">
            <p className="hp-mob-sub">
              Book from <strong>1500+ verified singers</strong> for weddings, corporate events &amp; house parties. Trusted by <strong>2500+ happy clients</strong> with 4.9★ rating.
            </p>
          </div>

          {/* Section 4: CTAs */}
          <div className="hp-mob-section hp-mob-cta-section">
            <button 
              className="mob-btn-primary"
              onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }))}
            >
              Get Free Quote
            </button>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <Link href="/artists" className="mob-btn-secondary" style={{ flex: 1 }}>
                Browse Artists
              </Link>
              <a href="tel:+918076515257" className="mob-btn-secondary" style={{ flex: 1, padding: '14px 6px', fontSize: '13.5px', whiteSpace: 'nowrap' }}>
                📞 +91 80765 15257
              </a>
            </div>
          </div>

          {/* Section 5: Trust Cards */}
          <div className="hp-mob-section">
            <div className="hp-mob-trust-grid">
              <div className="mob-trust-card"><span className="mob-check">✓</span> Verified Artists</div>
              <div className="mob-trust-card"><span className="mob-check">✓</span> Instant Quotes</div>
              <div className="mob-trust-card"><span className="mob-check">✓</span> Transparent Pricing</div>
              <div className="mob-trust-card"><span className="mob-check">✓</span> Pan India</div>
            </div>
          </div>

          {/* Section 6: Mobile Premium Slider Card */}
          <div className="hp-mob-section">
            <div className="mob-premium-slider-card">

              <div className="mps-body">
                {mobCardSlide === 0 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mps-slide">
                    <div className="mps-inner-card">
                      <h4 className="mps-slide-title">🎤 Why Choose Magnevents?</h4>
                      <ul className="mps-list">

                        <li><span className="mps-check">✓</span> Verified Professional Artists</li>
                        <li><span className="mps-check">✓</span> 100% Artist Arrival Guarantee</li>
                        <li><span className="mps-check">✓</span> Fast Booking Process (0% Markup)</li>
                        <li><span className="mps-check">✓</span> Transparent Pricing & Escrow</li>
                        <li><span className="mps-check">✓</span> 24/7 Dedicated Event Support</li>
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
                        <p>&quot;Magnevents made our wedding unforgettable! The singer was phenomenal.&quot;</p>
                        <span>- Priya S., Mumbai</span>
                      </div>
                      <div className="mps-review">
                        <p>&quot;Super transparent and professional. Highly recommended for corporate events.&quot;</p>
                        <span>- Rahul M., Delhi</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="hp-trust-badge-bottom">
                ⭐ Trusted by 2500+ Happy Clients
              </div>
            </div>
          </div>
          
        </div>
      </div>


      {/* Hidden SEO Paragraph for bots */}
      <div className="sr-only">
        <p>Looking to book a singer online for your next celebration? Whether you want to hire a singer for an intimate gathering or need a professional wedding singer to create magical moments, we offer a seamless singer booking platform. Explore our diverse roster of verified singers ranging from soulful Bollywood performers to high-energy corporate event singers and house party singers. Enjoy transparent pricing and hire a professional singer instantly. Let us help you find the perfect birthday party singer or live artist. Book artists online with complete peace of mind today.</p>
      </div>
    </section>
  )
}
