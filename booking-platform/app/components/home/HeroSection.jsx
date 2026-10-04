"use client";

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import VideoModal from './VideoModal'

import { HERO_SPOTLIGHT_SLIDES } from '@/app/constants'
import { FEATURED_IMAGE_CARDS } from '@/app/constants/eventPosters'

export default function HeroSection() {
  const router = useRouter()
  const [heroSlide, setHeroSlide] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState(null)

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
    <section className="hp-hero-wrapper" suppressHydrationWarning>
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
              suppressHydrationWarning
            >
              <span className="hp-sw-badge-trophy" suppressHydrationWarning>🏆</span>
              <span className="hp-sw-badge-text" suppressHydrationWarning>
                India&apos;s #1 Live Artist &amp; Singer Booking Platform
              </span>
              <span className="hp-sw-badge-dot" suppressHydrationWarning>•</span>
              <span className="hp-sw-badge-highlight" suppressHydrationWarning>0% Commission Markup</span>
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
                <span>Pay ₹99 &amp; Book Your Slot (Confirmed)</span>
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
              <div 
                className="hp-sw-why-item hp-sw-why-item-promo"
                onClick={() => window.dispatchEvent(new CustomEvent('open-quick-booking'))}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                aria-label="Book slot for only 99 rupees"
              >
                <span className="hp-sw-why-icon">⚡</span>
                <div className="hp-sw-why-text">
                  <strong>Only ₹99 to Book &amp; Fix Your Slot</strong>
                  <span>Instant slot confirmation with 100% money-back guarantee</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent('open-quick-booking'));
                  }}
                  className="hp-sw-why-cta-btn"
                  aria-label="Book slot for ₹99"
                >
                  <span>Book Now</span>
                  <span className="hp-sw-why-arrow">➔</span>
                </button>
              </div>

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
      <div className="hp-mobile-hero" suppressHydrationWarning>
        <div className="hp-mobile-content" suppressHydrationWarning>
          
          {/* SEO Accessible Heading */}
          <h1 className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
            Book Verified Artists for House Parties &amp; Events
          </h1>

          {/* TOP PROMOTIONAL BANNER */}
          <div className="hp-mob-section">
            <div 
              className="hp-mob-promo-top-banner"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-quick-booking'));
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Claim first booking offer: 55% to 65% OFF - Book for 99 rupees"
            >
              <div className="hp-mob-promo-top-left">
                <span className="hp-mob-promo-badge-tag">EXCLUSIVE OFFER</span>
                <span className="hp-mob-promo-top-text">
                  🔥 <strong>55%–65% OFF</strong> First Booking
                </span>
              </div>
              <span className="hp-mob-promo-pill">₹99 TOKEN ➔</span>
            </div>
          </div>

          {/* CURATED CELEBRATION MOMENTS (MAIN MOBILE CENTERPIECE) */}
          <div className="hp-mob-section">
            <div className="media-section-head" style={{ marginBottom: '16px' }}>
              <div className="media-section-badge">
                <span>🌟</span>
                <span>CURATED CELEBRATION MOMENTS</span>
              </div>
              <h2 className="media-section-title">
                Trending Celebrations &amp; <span>Live Experiences</span>
              </h2>
              <p className="media-section-subtitle">
                Verified live artist setups with professional acoustic sound gear · Direct 0% commission rates
              </p>
            </div>

            <div className="media-image-grid-5">
              {FEATURED_IMAGE_CARDS.map((item, idx) => (
                <div
                  key={item.id}
                  className="media-image-card"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(
                        new CustomEvent('open-quick-booking', {
                          detail: {
                            category: item.category,
                            packageTitle: item.title,
                            preferredBudget: item.price,
                          },
                        })
                      );
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View and book ${item.title}`}
                >
                  <div className="media-card-thumb">
                    <Image
                      src={item.image}
                      alt={`${item.title} - Magnevents Verified Artist`}
                      fill
                      sizes="(max-width: 640px) 270px, 300px"
                      priority={idx === 0}
                      className="media-card-img"
                    />
                    <div className="media-card-gradient" />
                    
                    {/* Floating Badges */}
                    <div className="media-card-top-badges">
                      <span className="media-badge-tag">{item.tag}</span>
                      <span className="media-badge-rating">{item.rating}</span>
                    </div>

                    {/* Feature Pill */}
                    <div className="media-card-feature-pill">
                      <span>✓</span>
                      <span>{item.badge}</span>
                    </div>
                  </div>

                  <div className="media-card-body">
                    <span className="media-card-category">{item.category}</span>
                    <h3 className="media-card-title">{item.title}</h3>
                    <p className="media-card-subtitle">{item.subtitle}</p>

                    <div className="media-card-pricing-strip">
                      <div>
                        <span className="media-price-cut">{item.regularPrice}</span>
                        <span className="media-price-val">{item.price}</span>
                      </div>
                      <span className="media-discount-pill">{item.discount}</span>
                    </div>

                    <button
                      type="button"
                      className="media-card-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (typeof window !== 'undefined') {
                          window.dispatchEvent(
                            new CustomEvent('open-quick-booking', {
                              detail: {
                                category: item.category,
                                packageTitle: item.title,
                                preferredBudget: item.price,
                              },
                            })
                          );
                        }
                      }}
                      aria-label={`Book ${item.title} for 99 rupees`}
                    >
                      <span>⚡ Book for ₹99</span>
                      <span>➔</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: CLEAR CALL-TO-ACTIONS */}
          <div className="hp-mob-section hp-mob-cta-section">
            <button 
              className="mob-btn-primary mob-btn-offer-pulse"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-quick-booking'));
                }
              }}
              aria-label="Book Now for 99 rupees with 55% to 65% off"
            >
              <div className="mob-btn-offer-content">
                <span className="mob-btn-offer-title">Book Now — Only ₹99</span>
                <span className="mob-btn-offer-badge">CLAIM 55%–65% OFF ➔</span>
              </div>
            </button>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <Link href="/artists" className="mob-btn-secondary" style={{ flex: 1, height: '48px', fontSize: '13.5px' }}>
                Browse 1500+ Artists
              </Link>
              <a href="tel:+918076515257" className="mob-btn-secondary" style={{ flex: 1, height: '48px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                📞 +91 80765 15257
              </a>
            </div>
          </div>

          {/* Section 5: PROMOTIONAL TRUST & VALUE HIGHLIGHTS */}
          <div className="hp-mob-section">
            <div className="hp-mob-trust-grid">
              <div className="mob-trust-card"><span className="mob-check">⚡</span> Book for Just ₹99</div>
              <div className="mob-trust-card"><span className="mob-check">🏷️</span> Flat 55%–65% Off</div>
              <div className="mob-trust-card"><span className="mob-check">✓</span> 1500+ Verified Artists</div>
              <div className="mob-trust-card"><span className="mob-check">🛡️</span> 100% Arrival Guarantee</div>
            </div>
          </div>

          
        </div>
      </div>


      {/* Hidden SEO Paragraph for bots */}
      <div className="sr-only">
        <p>Looking to book a singer online for your next celebration? Whether you want to hire a singer for an intimate gathering or need a professional wedding singer to create magical moments, we offer a seamless singer booking platform. Explore our diverse roster of verified singers ranging from soulful Bollywood performers to high-energy corporate event singers and house party singers. Enjoy transparent pricing and hire a professional singer instantly. Let us help you find the perfect birthday party singer or live artist. Book artists online with complete peace of mind today.</p>
      </div>

      {/* Live Video Performance Modal */}
      <VideoModal
        isOpen={!!selectedVideo}
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  )
}
