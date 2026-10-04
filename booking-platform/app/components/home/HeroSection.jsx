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
  const [posterIndex, setPosterIndex] = useState(0)
  const [hasUnlockedCreatedCards, setHasUnlockedCreatedCards] = useState(false)
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
    const nextPlaying = !isVideoPlaying
    setIsVideoPlaying(nextPlaying)
    if (activeVideoRef.current) {
      if (nextPlaying) {
        activeVideoRef.current.play().catch(() => {})
      } else {
        activeVideoRef.current.pause()
      }
    }
  }

  const mobileCarouselRef = useRef(null)
  const isScrollingProgrammatically = useRef(false)
  const scrollRafRef = useRef(null)

  const handleMobileScroll = () => {
    if (isScrollingProgrammatically.current || !mobileCarouselRef.current) return

    if (scrollRafRef.current) {
      window.cancelAnimationFrame(scrollRafRef.current)
    }

    scrollRafRef.current = window.requestAnimationFrame(() => {
      const track = mobileCarouselRef.current
      if (!track) return
      const cards = track.children
      if (!cards || cards.length === 0) return

      const trackCenter = track.scrollLeft + track.clientWidth / 2
      let closestIdx = 0
      let closestDist = Infinity

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i]
        const cardCenter = card.offsetLeft + card.clientWidth / 2
        const dist = Math.abs(trackCenter - cardCenter)
        if (dist < closestDist) {
          closestDist = dist
          closestIdx = i
        }
      }

      if (closestIdx !== safePosterIndex && closestIdx < availablePosters.length) {
        setPosterIndex(closestIdx)
      }
    })
  }

  const scrollToPoster = (idx, smooth = true) => {
    setPosterIndex(idx)
    if (!mobileCarouselRef.current) return
    const track = mobileCarouselRef.current
    const cards = track.children
    if (cards && cards[idx]) {
      const card = cards[idx]
      const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2
      isScrollingProgrammatically.current = true
      track.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' })
      setTimeout(() => {
        isScrollingProgrammatically.current = false
      }, 450)
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

  // Initially show first 4 video cards; unlock all created cards after 14s (10-15s) or after cycling
  const availablePosters = hasUnlockedCreatedCards ? EVENT_POSTERS : EVENT_POSTERS.slice(0, 4)

  // Unlock created cards if user stays on website for 14 seconds (10-15s)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHasUnlockedCreatedCards(true)
    }, 14000)
    return () => window.clearTimeout(timer)
  }, [])

  const safePosterIndex = posterIndex % availablePosters.length
  const currentCard = availablePosters[safePosterIndex] || availablePosters[0]

  // Auto-advance cards: 12 seconds for videos (10-15s), 6 seconds for created image cards
  useEffect(() => {
    if (isPosterHovered || !isVideoMuted || !isVideoPlaying) return
    const duration = currentCard?.videoUrl ? 12000 : 6000
    const id = window.setTimeout(() => {
      setPosterIndex(prev => {
        const next = prev + 1
        if (next >= 4 && !hasUnlockedCreatedCards) {
          setHasUnlockedCreatedCards(true)
        }
        return next
      })
    }, duration)
    return () => window.clearTimeout(id)
  }, [isPosterHovered, isVideoMuted, isVideoPlaying, currentCard?.videoUrl, hasUnlockedCreatedCards, posterIndex, availablePosters.length])

  // Auto-center horizontal scroll track when poster index changes from timer or external action
  useEffect(() => {
    if (mobileCarouselRef.current && !isPosterHovered && !isScrollingProgrammatically.current) {
      scrollToPoster(safePosterIndex, true)
    }
  }, [safePosterIndex])

  return (
    <section className="hp-hero-wrapper" suppressHydrationWarning>
      {/* BACKGROUND (Shared for both) */}
      <div className="hp-hero-bg" style={{ pointerEvents: 'none' }}>
        {HERO_SPOTLIGHT_SLIDES.map((src, idx) => (
          <div
            key={typeof src === 'string' ? `${src}-${idx}` : idx}
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
              <span className="hp-sw-badge-highlight" suppressHydrationWarning>Flat 55%–65% OFF First Booking</span>
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
                <span>Book Verified Artists (Confirmed)</span>
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
                aria-label="Book verified artist slot online"
              >
                <span className="hp-sw-why-icon">⚡</span>
                <div className="hp-sw-why-text">
                  <strong>Flat 55%–65% OFF First Booking</strong>
                  <span>Instant slot confirmation with 100% money-back guarantee</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent('open-quick-booking'));
                  }}
                  className="hp-sw-why-cta-btn"
                  aria-label="Book artist slot"
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
        {/* Dynamic Ambient Blurred Backdrop - Shows active live celebration image with soft blur and glowing live effect */}
        <div className="hp-mob-ambient-backdrop" aria-hidden="true">
          {availablePosters.map((posterItem, idx) => {
            const isActive = safePosterIndex === idx;
            return (
              <div
                key={posterItem.id || `ambient-${idx}`}
                className={`hp-mob-ambient-layer ${isActive ? 'is-active' : ''}`}
                style={{
                  opacity: isActive ? 1 : 0,
                  visibility: isActive ? 'visible' : 'hidden',
                  transition: 'opacity 0.75s ease, visibility 0.75s ease'
                }}
              >
                <Image
                  src={posterItem.poster}
                  alt=""
                  fill
                  sizes="100vw"
                  className="hp-mob-ambient-img"
                  unoptimized
                  priority={idx === 0}
                />
              </div>
            );
          })}
          {/* Translucent Dark Scrim with Gaussian Blur for High Contrast & Readability */}
          <div className="hp-mob-ambient-scrim" />
          {/* Edge Vignette for Cinematic Glow */}
          <div className="hp-mob-ambient-vignette" />
        </div>

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
              aria-label="Book verified artists online"
            >
              <div className="hp-mob-promo-top-left">
                <span className="hp-mob-promo-badge-tag">EXCLUSIVE OFFER</span>
                <span className="hp-mob-promo-top-text">
                  🎉 Get <strong>55%–65% OFF</strong> on your 1st booking!
                </span>
              </div>
              <span className="hp-mob-promo-pill">CLAIM ➔</span>
            </div>
          </div>

          {/* 10 LUXURY EVENT SHOWCASE CARDS (MAIN MOBILE CENTERPIECE) */}
          <div className="hp-mob-section">
            <div className="hp-posters-showcase">
              {/* Main Swipeable Reel/Video Card with Visible Peek Stage */}
              {(() => {
                const safeIndex = posterIndex % availablePosters.length;
                const current = availablePosters[safeIndex] || availablePosters[0];
                const nextIndex = (safeIndex + 1) % availablePosters.length;
                const nextPoster = availablePosters[nextIndex];
                const prevIndex = (safeIndex - 1 + availablePosters.length) % availablePosters.length;
                const prevPoster = availablePosters[prevIndex];

                return (
                  <div className="hp-poster-carousel-wrapper">
                    {/* True Native Horizontal Scroll Carousel Track */}
                    <div
                      ref={mobileCarouselRef}
                      onScroll={handleMobileScroll}
                      className="hp-mob-carousel-scroll"
                      style={{
                        display: 'flex',
                        alignItems: 'stretch',
                        gap: '12px',
                        overflowX: 'auto',
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        padding: '8px calc((100vw - min(310px, 80vw)) / 2) 16px calc((100vw - min(310px, 80vw)) / 2)',
                        userSelect: 'none',
                        scrollBehavior: 'smooth'
                      }}
                      onTouchStart={() => setIsPosterHovered(true)}
                      onTouchEnd={() => setTimeout(() => setIsPosterHovered(false), 2500)}
                    >
                      {availablePosters.map((posterItem, idx) => {
                        const isActive = safeIndex === idx;
                        return (
                          <div
                            key={posterItem.id || `mob-card-${idx}`}
                            onClick={(e) => {
                              if (e.target.closest('button')) return;
                              if (!isActive) {
                                scrollToPoster(idx);
                              } else {
                                if (typeof window !== 'undefined') {
                                  window.dispatchEvent(new CustomEvent('open-quick-booking'));
                                }
                              }
                            }}
                            className={`hp-poster-card-wrapper ${isActive ? 'is-active' : ''}`}
                            style={{
                              flex: '0 0 min(310px, 80vw)',
                              width: 'min(310px, 80vw)',
                              height: 'clamp(370px, 51dvh, 430px)',
                              position: 'relative',
                              borderRadius: '22px',
                              overflow: 'hidden',
                              scrollSnapAlign: 'center',
                              cursor: 'pointer',
                              border: isActive ? '1.8px solid rgba(255, 224, 50, 0.75)' : '1px solid rgba(255, 255, 255, 0.14)',
                              boxShadow: isActive
                                ? '0 16px 45px rgba(0, 0, 0, 0.95), 0 0 30px rgba(255, 224, 50, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.25)'
                                : '0 8px 24px rgba(0, 0, 0, 0.6)',
                              transform: isActive ? 'scale(1)' : 'scale(0.93)',
                              opacity: isActive ? 1 : 0.65,
                              transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease',
                              background: '#000',
                              flexShrink: 0
                            }}
                          >
                            {/* Inline Performance Video Player or Image */}
                            <div 
                              className="hp-poster-img-container hp-poster-media-container"
                              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                            >
                              {isActive && posterItem.videoUrl ? (
                                <video
                                  ref={activeVideoRef}
                                  key={posterItem.videoUrl + posterItem.id}
                                  src={posterItem.videoUrl}
                                  poster={posterItem.poster}
                                  autoPlay
                                  loop
                                  muted={isVideoMuted}
                                  playsInline
                                  preload="auto"
                                  className="hp-poster-video-elem"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  onPlay={() => setIsVideoPlaying(true)}
                                  onPause={() => setIsVideoPlaying(false)}
                                />
                              ) : (
                                <Image
                                  src={posterItem.poster}
                                  alt={`${posterItem.title} - Magnevents Verified Live Artists`}
                                  fill
                                  sizes="(max-width: 768px) 85vw, 400px"
                                  priority={idx === 0}
                                  className="hp-poster-img"
                                  style={{ objectFit: 'cover' }}
                                />
                              )}
                            </div>

                            {/* Luxury Cinematic Vignette Overlay */}
                            <div className="hp-poster-vignette" />

                            {/* Top Floating Controls Bar - ONLY on Active Video Card */}
                            {isActive && posterItem.videoUrl && (
                              <div 
                                className="hp-poster-top-bar"
                                style={{
                                  position: 'absolute',
                                  top: '14px',
                                  left: '14px',
                                  right: '14px',
                                  width: 'calc(100% - 28px)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  zIndex: 10,
                                  pointerEvents: 'none'
                                }}
                              >
                                <div className="hp-poster-top-left" style={{ pointerEvents: 'auto' }}>
                                  <button
                                    type="button"
                                    className={`hp-poster-glass-btn ${!isVideoMuted ? 'is-active' : ''}`}
                                    onClick={toggleMute}
                                    aria-label={isVideoMuted ? "Unmute sound" : "Mute sound"}
                                    title={isVideoMuted ? "Tap to Unmute" : "Tap to Mute"}
                                  >
                                    {isVideoMuted ? (
                                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.25"/>
                                        <line x1="23" y1="9" x2="17" y2="15"/>
                                        <line x1="17" y1="9" x2="23" y2="15"/>
                                      </svg>
                                    ) : (
                                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.25"/>
                                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                                      </svg>
                                    )}
                                  </button>
                                </div>

                                <div className="hp-poster-top-right" style={{ marginLeft: 'auto', pointerEvents: 'auto' }}>
                                  <button
                                    type="button"
                                    className={`hp-poster-glass-btn ${!isVideoPlaying ? 'is-paused' : ''}`}
                                    onClick={togglePlayPause}
                                    aria-label={isVideoPlaying ? "Pause video" : "Play video"}
                                    title={isVideoPlaying ? "Tap to Pause" : "Tap to Play"}
                                  >
                                    {isVideoPlaying ? (
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <rect x="6" y="4" width="4" height="16" rx="1.5" />
                                        <rect x="14" y="4" width="4" height="16" rx="1.5" />
                                      </svg>
                                    ) : (
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '1px' }}>
                                        <polygon points="6 4 20 12 6 20 6 4" />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Bottom Card Content */}
                            <div className="hp-poster-bottom">
                              <div className="hp-poster-title-row">
                                <h4 className="hp-poster-card-title">{posterItem.title}</h4>
                              </div>

                              {/* Booking Action Bar */}
                              <div 
                                className="hp-poster-value-bar"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (typeof window !== 'undefined') {
                                    window.dispatchEvent(new CustomEvent('open-quick-booking'));
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label={`Book verified artists for ${posterItem.title}`}
                              >
                                <div className="hp-poster-feature-block">
                                  <span className="hp-poster-feature-highlight">🎉 Flat 55%–65% OFF</span>
                                </div>
                                <div className="hp-poster-feature-badge">
                                  <span>Book Now ➔</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Sliding Fluid Dots Indicator - Zero layout shift, silky smooth glide */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '16px',
                      marginBottom: '8px',
                      userSelect: 'none'
                    }}>
                      <div style={{
                        position: 'relative',
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: '100px',
                        border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}>
                        {/* Smooth Sliding Active Pill Indicator */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '4px',
                            left: '2px',
                            width: '18px',
                            height: '6px',
                            borderRadius: '100px',
                            background: 'linear-gradient(90deg, #FFE032 0%, #FF9900 100%)',
                            boxShadow: '0 0 12px rgba(255, 224, 50, 0.8)',
                            transform: `translateX(${safeIndex * 14}px)`,
                            transition: 'transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1.15)',
                            pointerEvents: 'none',
                            zIndex: 2
                          }}
                        />

                        {/* Fixed Background Dots */}
                        {availablePosters.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => scrollToPoster(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            style={{
                              width: '14px',
                              height: '6px',
                              padding: 0,
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              zIndex: 1
                            }}
                          >
                            <span
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.28)',
                                opacity: safeIndex === idx ? 0 : 1,
                                transition: 'opacity 0.2s ease'
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
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
              aria-label="Book Verified Artists Online with Special Offer"
            >
              <div className="mob-btn-offer-content">
                <div className="mob-btn-offer-text-group">
                  <span className="mob-btn-offer-sub">⚡ FIRST BOOKING SPECIAL</span>
                  <span className="mob-btn-offer-title">Book Verified Live Artists</span>
                </div>
                <div className="mob-btn-offer-pill">
                  <span>55%–65% OFF</span>
                  <span>➔</span>
                </div>
              </div>
            </button>
            <div className="hp-mob-dual-btn-row">
              <a 
                href="tel:+918076515257" 
                className="hp-mob-phone-btn"
                aria-label="Call +91 80765 15257 for instant artist booking"
              >
                <span className="hp-mob-phone-icon">📞</span>
                <span className="hp-mob-phone-num">+91 80765 15257</span>
              </a>
              <Link 
                href="/artists" 
                className="hp-mob-browse-btn"
                aria-label="Browse 1600+ verified artists"
              >
                <span className="hp-mob-browse-text">Browse 1600+</span>
                <span className="hp-mob-browse-arrow">➔</span>
              </Link>
            </div>
          </div>

          {/* Section 5: PROMOTIONAL TRUST & VALUE HIGHLIGHTS */}
          <div className="hp-mob-section">
            <div className="hp-mob-trust-grid">
              <div className="mob-trust-card"><span className="mob-check">⚡</span> Instant Slot Confirmation</div>
              <div className="mob-trust-card"><span className="mob-check">💎</span> Direct Artist Connect</div>
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
