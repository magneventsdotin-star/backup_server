"use client";

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import VideoModal from './VideoModal'

import { HERO_SPOTLIGHT_SLIDES } from '@/app/constants'
import { EVENT_POSTERS } from '@/app/constants/eventPosters'

export default function HeroSection() {
  const router = useRouter()
  const [heroSlide, setHeroSlide] = useState(0)
  const [mobCardSlide, setMobCardSlide] = useState(0)
  const [posterIndex, setPosterIndex] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [touchStartX, setTouchStartX] = useState(0)
  const [isPosterHovered, setIsPosterHovered] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const activeVideoRef = useRef(null)

  const toggleMute = (e) => {
    e?.stopPropagation()
    const next = !isVideoMuted
    setIsVideoMuted(next)
    if (activeVideoRef.current) {
      activeVideoRef.current.muted = next
    }
  }

  const togglePlayPause = (e) => {
    e?.stopPropagation()
    if (!activeVideoRef.current) return
    if (activeVideoRef.current.paused) {
      activeVideoRef.current.play().catch(() => {})
      setIsVideoPlaying(true)
    } else {
      activeVideoRef.current.pause()
      setIsVideoPlaying(false)
    }
  }

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

  useEffect(() => {
    if (isPosterHovered) return
    const id = window.setInterval(() => {
      setPosterIndex(prev => (prev + 1) % EVENT_POSTERS.length)
    }, 6000)
    return () => window.clearInterval(id)
  }, [isPosterHovered])

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
          
          {/* Section 1: TOP PROMOTIONAL BANNER */}
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

          {/* Section 2: BOLD PROMOTIONAL HEADLINE */}
          <div className="hp-mob-section">
            <div className="hp-mob-offer-badge-pill">
              <span className="hp-mob-offer-badge-dot">●</span>
              <span>FIRST-TIME CLIENT SPECIAL</span>
            </div>
            <h1 className="hp-mob-h1 hp-mob-offer-h1">
              <span className="hp-mob-offer-main">Get 55%–65% OFF</span>
              <span className="hp-mob-offer-sub-title">
                Book Verified Artists for <span className="hp-mob-offer-price">Only ₹99</span>
              </span>
            </h1>
          </div>

          {/* Section 3: 10 LUXURY EVENT SHOWCASE CARDS (MAIN MOBILE CENTERPIECE) */}
          <div className="hp-mob-section">
            <div className="hp-posters-showcase">
              
              {/* Header */}
              <div className="hp-posters-header">
                <div className="hp-posters-heading-wrap">
                  <span className="hp-posters-badge">👑 TOP 10 CELEBRATION FORMATS</span>
                  <h3 className="hp-posters-title">
                    House Parties &amp; <span>Events Showcase</span>
                  </h3>
                </div>
              </div>

              {/* Category Quick Tabs (10 Categories) */}
              <div className="hp-posters-tabs" role="tablist">
                {EVENT_POSTERS.map((poster, idx) => (
                  <button
                    key={poster.id}
                    type="button"
                    role="tab"
                    aria-selected={posterIndex === idx}
                    className={`hp-poster-tab ${posterIndex === idx ? 'is-active' : ''}`}
                    onClick={() => setPosterIndex(idx)}
                  >
                    <span>{poster.tab}</span>
                  </button>
                ))}
              </div>

              {/* Main Swipeable Reel/Video Card */}
              {(() => {
                const current = EVENT_POSTERS[posterIndex];
                return (
                  <div
                    className="hp-poster-card-wrapper"
                    onMouseEnter={() => setIsPosterHovered(true)}
                    onMouseLeave={() => setIsPosterHovered(false)}
                    onTouchStart={(e) => {
                      setIsPosterHovered(true);
                      setTouchStartX(e.touches[0].clientX);
                    }}
                    onTouchEnd={(e) => {
                      setIsPosterHovered(false);
                      const diff = touchStartX - e.changedTouches[0].clientX;
                      if (Math.abs(diff) > 40) {
                        if (diff > 0) {
                          setPosterIndex((prev) => (prev + 1) % EVENT_POSTERS.length);
                        } else {
                          setPosterIndex((prev) => (prev - 1 + EVENT_POSTERS.length) % EVENT_POSTERS.length);
                        }
                      }
                    }}
                  >
                    {/* Inline Performance Video Player (Plays without music by default, loops seamlessly) */}
                    <div className="hp-poster-img-container hp-poster-media-container">
                      {current.videoUrl ? (
                        <video
                          ref={activeVideoRef}
                          key={current.videoUrl + current.id}
                          src={current.videoUrl}
                          poster={current.poster}
                          autoPlay
                          loop
                          muted={isVideoMuted}
                          playsInline
                          className="hp-poster-video-elem"
                          onPlay={() => setIsVideoPlaying(true)}
                          onPause={() => setIsVideoPlaying(false)}
                        />
                      ) : (
                        <Image
                          src={current.poster}
                          alt={`${current.title} - Magnevents Verified Live Artists`}
                          fill
                          sizes="(max-width: 768px) 100vw, 600px"
                          priority
                          className="hp-poster-img"
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                    </div>

                    {/* Gradient Vignette Overlay for Crisp Readability */}
                    <div className="hp-poster-vignette" />

                    {/* Top Floating Controls Bar */}
                    <div className="hp-poster-top-bar">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="hp-poster-category-pill">
                          {current.tab.replace(/^[^\s]+\s/, '')}
                        </span>
                        <div className="hp-poster-live-slot">
                          <span className="hp-poster-live-dot" />
                          <span>{current.slots}</span>
                        </div>
                      </div>

                      {/* Sound Toggle Button (Plays without music by default, tap to listen) */}
                      <button
                        type="button"
                        className="hp-poster-ctrl-circle hp-poster-audio-btn"
                        onClick={toggleMute}
                        aria-label={isVideoMuted ? "Unmute video (Turn sound on)" : "Mute video (Turn sound off)"}
                        title={isVideoMuted ? "Tap to listen with sound" : "Mute audio"}
                      >
                        <span className="hp-ctrl-icon">{isVideoMuted ? "🔇" : "🔊"}</span>
                      </button>
                    </div>

                    {/* Floating Play / Pause Control Button */}
                    <div className="hp-poster-mid-bar">
                      <span className="hp-poster-tag-badge">{current.tag}</span>

                      <button
                        type="button"
                        className="hp-poster-ctrl-circle hp-poster-playpause-btn"
                        onClick={togglePlayPause}
                        aria-label={isVideoPlaying ? "Pause video" : "Play video"}
                        title={isVideoPlaying ? "Pause video" : "Play video"}
                      >
                        <span className="hp-ctrl-icon">{isVideoPlaying ? "⏸" : "▶"}</span>
                      </button>
                    </div>

                    {/* Bottom Card Content */}
                    <div className="hp-poster-bottom">
                      <div className="hp-poster-title-row">
                        <h4 className="hp-poster-card-title">{current.title}</h4>
                        <p className="hp-poster-card-sub">{current.subtitle}</p>
                      </div>

                      {/* Pricing and Offer Strip */}
                      <div className="hp-poster-value-bar">
                        <div className="hp-poster-price-block">
                          <span className="hp-poster-regular-price">{current.regularPrice}</span>
                          <div className="hp-poster-offer-price">
                            <span>{current.offerPrice}</span>
                            <span className="hp-poster-discount-badge">{current.discount}</span>
                          </div>
                        </div>
                        <div className="hp-poster-token-badge">
                          <span className="hp-poster-token-top">Lock Slot</span>
                          <span className="hp-poster-token-amt">₹99 Only</span>
                        </div>
                      </div>

                      {/* High-Converting Full-Width ₹99 Booking Button (Matches User Screenshot) */}
                      <button
                        type="button"
                        className="hp-poster-cta-btn"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('open-quick-booking', {
                              detail: { eventType: current.title, category: current.category, item: current, index: posterIndex }
                            }));
                            window.dispatchEvent(new CustomEvent('open-lead-capture', {
                              detail: { eventType: current.title, category: current.category, item: current, index: posterIndex }
                            }));
                          }
                        }}
                        aria-label={`Book ${current.title} for 99 rupees`}
                      >
                        <span>⚡ Book {current.tab.replace(/^[^\s]+\s/, '')} for ₹99</span>
                        <span>➔</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Navigation Controls & Dot Indicators */}
              <div className="hp-poster-nav-bar">
                <button
                  type="button"
                  className="hp-poster-nav-btn"
                  onClick={() => setPosterIndex((prev) => (prev - 1 + EVENT_POSTERS.length) % EVENT_POSTERS.length)}
                  aria-label="Previous event poster"
                >
                  ◀
                </button>

                <div className="hp-poster-dots">
                  {EVENT_POSTERS.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`hp-poster-dot ${posterIndex === idx ? 'is-active' : ''}`}
                      onClick={() => setPosterIndex(idx)}
                      aria-label={`Go to event poster ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="hp-poster-nav-btn"
                  onClick={() => setPosterIndex((prev) => (prev + 1) % EVENT_POSTERS.length)}
                  aria-label="Next event poster"
                >
                  ▶
                </button>
              </div>

              {/* Value & Trust Guarantees */}
              <div className="hp-poster-guarantee-strip">
                <span>🛡️ <strong>100% Arrival Guarantee</strong></span>
                <span>•</span>
                <span>💎 <strong>0% Middleman Markup</strong></span>
                <span>•</span>
                <span>⭐ <strong>{EVENT_POSTERS[posterIndex].rating}</strong></span>
              </div>

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

          {/* Section 6: PROMOTIONAL SUBTITLE / OFFER DETAILS */}
          <div className="hp-mob-section">
            <p className="hp-mob-sub hp-mob-offer-sub">
              Fill the form to claim your offer &amp; book verified singers, live bands &amp; DJs for <strong>only ₹99 token amount</strong>. Enjoy flat <strong>55%–65% discount</strong> with 100% artist arrival guarantee across Delhi NCR.
            </p>
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
