"use client";

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import VideoModal from './VideoModal'
import TrustEmblems from './TrustEmblems'

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
  const mobileCarouselRef = useRef(null)
  const isScrollingProgrammatically = useRef(false)
  const scrollRafRef = useRef(null)

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

  // Initially show first 4 video cards; unlock all created cards after 14s (10-15s) or after cycling
  const availablePosters = hasUnlockedCreatedCards ? EVENT_POSTERS : EVENT_POSTERS.slice(0, 4)
  const safePosterIndex = posterIndex % availablePosters.length
  const currentCard = availablePosters[safePosterIndex] || availablePosters[0]

  const isUserInteracting = useRef(false)
  const scrollTimeout = useRef(null)
  const isMouseDown = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollLeft = useRef(0)
  const hasMovedDrag = useRef(false)

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

    if (scrollTimeout.current) {
      window.clearTimeout(scrollTimeout.current)
    }
    scrollTimeout.current = window.setTimeout(() => {
      isUserInteracting.current = false
      setIsPosterHovered(false)
    }, 1200)
  }

  const scrollToPoster = (idx, smooth = true) => {
    const targetIdx = (idx + availablePosters.length) % availablePosters.length
    setPosterIndex(targetIdx)
    if (!mobileCarouselRef.current) return
    const track = mobileCarouselRef.current
    const cards = track.children
    if (cards && cards[targetIdx]) {
      const card = cards[targetIdx]
      const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2
      isScrollingProgrammatically.current = true
      track.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' })
      setTimeout(() => {
        isScrollingProgrammatically.current = false
      }, 500)
    }
  }

  // Mouse Drag-To-Scroll handlers (for desktop testing, trackpad, and touch emulators)
  const handleMouseDown = (e) => {
    if (!mobileCarouselRef.current) return
    isMouseDown.current = true
    hasMovedDrag.current = false
    dragStartX.current = e.pageX - mobileCarouselRef.current.offsetLeft
    dragScrollLeft.current = mobileCarouselRef.current.scrollLeft
    isUserInteracting.current = true
    setIsPosterHovered(true)
  }

  const handleMouseMove = (e) => {
    if (!isMouseDown.current || !mobileCarouselRef.current) return
    e.preventDefault()
    const x = e.pageX - mobileCarouselRef.current.offsetLeft
    const walk = (x - dragStartX.current) * 1.3
    if (Math.abs(walk) > 4) {
      hasMovedDrag.current = true
    }
    mobileCarouselRef.current.scrollLeft = dragScrollLeft.current - walk
  }

  const handleMouseUpOrLeave = () => {
    if (!isMouseDown.current) return
    isMouseDown.current = false
    setTimeout(() => {
      hasMovedDrag.current = false
      isUserInteracting.current = false
      setIsPosterHovered(false)
    }, 400)
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }
    const id = window.setInterval(() => {
      setHeroSlide(prev => (prev + 1) % HERO_SPOTLIGHT_SLIDES.length)
    }, 8000)
    return () => window.clearInterval(id)
  }, [])

  // Unlock created cards if user stays on website for 14 seconds (10-15s)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHasUnlockedCreatedCards(true)
    }, 14000)
    return () => window.clearTimeout(timer)
  }, [])

  // Auto-advance cards smoothly when user is not interacting
  useEffect(() => {
    if (isPosterHovered || isUserInteracting.current || !isVideoMuted || !isVideoPlaying) return
    const duration = currentCard?.videoUrl ? 12000 : 6000
    const id = window.setTimeout(() => {
      const next = (posterIndex + 1) % availablePosters.length
      if (next >= 4 && !hasUnlockedCreatedCards) {
        setHasUnlockedCreatedCards(true)
      }
      scrollToPoster(next, true)
    }, duration)
    return () => window.clearTimeout(id)
  }, [isPosterHovered, isVideoMuted, isVideoPlaying, currentCard?.videoUrl, hasUnlockedCreatedCards, posterIndex, availablePosters.length])

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
            <div
              className="hp-sw-badge"
              suppressHydrationWarning
            >
              <span className="hp-sw-badge-text" suppressHydrationWarning>
                India&apos;s Premium Live Artist Booking Platform
              </span>
              <span className="hp-sw-badge-dot" suppressHydrationWarning>•</span>
              <span className="hp-sw-badge-highlight" suppressHydrationWarning>Direct Pricing • 0% Agency Fees</span>
            </div>

            {/* 2. MAIN HEADLINE (THREE LINES) */}
            <h1 className="hp-sw-h1">
              <span className="hp-sw-h1-lead">Book Singer for</span>
              <br className="hp-sw-br" />
              <span className="hp-sw-h1-gold">House Party</span>
              <br className="hp-sw-br" />
              <span className="hp-sw-h1-gold">in Delhi &amp; NCR</span>
            </h1>

            {/* 6. PRIMARY ACTION BUTTONS */}
            <div className="hp-sw-actions">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }));
                  }
                }}
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
            </div>

          </div>

          {/* RIGHT: INTERACTIVE LIVE SOUNDCHECK PASS CARD (DESKTOP) */}
          <div className="hp-sw-artist-showcase-card">
            <div className="hp-sw-card-img-wrap" style={{ height: '370px' }}>
              {HERO_SPOTLIGHT_SLIDES.map((slideSrc, sIdx) => (
                <div
                  key={typeof slideSrc === 'string' ? slideSrc : sIdx}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: heroSlide === sIdx ? 1 : 0,
                    transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: heroSlide === sIdx ? 1 : 0
                  }}
                >
                  <Image
                    src={typeof slideSrc === 'object' ? slideSrc?.src : slideSrc}
                    alt="Live artist performing at an event"
                    fill
                    priority={sIdx === 0}
                    unoptimized
                    sizes="(min-width: 1024px) 480px, 100vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>



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


          {/* PROMOTIONAL OFFER BANNER (UPPER PART OF VIDEOS) */}
          <div className="hp-mob-section hp-mob-top-promo-wrap" style={{ padding: '0 16px', marginBottom: '8px' }}>
            <div 
              className="hp-mob-promo-top-banner"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }));
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Pre-Book Diwali & Get 55%-65% OFF"
            >
              <div className="hp-mob-promo-top-left">
                <span className="hp-mob-promo-badge-tag">
                  🪔 DIWALI OFFER
                </span>
                <span className="hp-mob-promo-top-text">
                  Get <strong>55%–65% OFF!</strong>
                </span>
              </div>
              <button 
                type="button"
                className="hp-mob-promo-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }));
                  }
                }}
                aria-label="Claim Diwali Offer"
              >
                CLAIM ➔
              </button>
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
                  <div className="hp-poster-carousel-wrapper" style={{ position: 'relative' }}>

                    {/* True Native Horizontal Scroll Carousel Track */}
                    <div
                      ref={mobileCarouselRef}
                      onScroll={handleMobileScroll}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUpOrLeave}
                      onMouseLeave={handleMouseUpOrLeave}
                      className="hp-mob-carousel-scroll"
                      style={{
                        display: 'flex',
                        alignItems: 'stretch',
                        gap: '12px',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        padding: '8px calc((100vw - min(310px, 80vw)) / 2) 8px calc((100vw - min(310px, 80vw)) / 2)',
                        userSelect: 'none',
                        touchAction: 'pan-x pan-y'
                      }}
                      onTouchStart={() => {
                        isUserInteracting.current = true;
                        setIsPosterHovered(true);
                      }}
                      onTouchEnd={() => {
                        setTimeout(() => {
                          isUserInteracting.current = false;
                          setIsPosterHovered(false);
                        }, 1500);
                      }}
                    >
                      {availablePosters.map((posterItem, idx) => {
                        const isActive = safeIndex === idx;
                        return (
                          <div
                            key={posterItem.id || `mob-card-${idx}`}
                            onClick={(e) => {
                              if (hasMovedDrag.current) return;
                              if (e.target.closest('button')) return;
                              if (!isActive) {
                                scrollToPoster(idx);
                              } else {
                                if (typeof window !== 'undefined') {
                                  window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }));
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
                                    window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }));
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label={`Book verified artists for ${posterItem.title}`}
                              >
                                <div className="hp-poster-feature-block">
                                  <span className="hp-poster-feature-highlight">★ 100% Artist Arrival Guarantee</span>
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

                    {/* Sliding Fluid Dots Indicator with Integrated Scroll Arrows at Both Ends */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '10px',
                      marginBottom: '6px',
                      userSelect: 'none'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 10px',
                        background: 'rgba(41, 39, 42, 0.88)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                        borderRadius: '100px',
                        border: '1px solid rgba(216, 196, 183, 0.3)',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(245, 240, 233, 0.1)'
                      }}>
                        {/* Left Scroll Arrow */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToPoster(safeIndex - 1);
                          }}
                          aria-label="Previous video"
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(232, 185, 67, 0.4)',
                            color: '#E8B943',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '15px',
                            fontWeight: 800,
                            lineHeight: 1,
                            transition: 'all 0.2s ease',
                            flexShrink: 0
                          }}
                        >
                          ‹
                        </button>

                        {/* Dots Track with Sliding Active Pill */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          {/* Sliding Active Pill */}
                          <div
                            style={{
                              position: 'absolute',
                              top: '0px',
                              left: '0px',
                              width: '18px',
                              height: '6px',
                              borderRadius: '100px',
                              background: 'linear-gradient(90deg, #E8B943 0%, #E45F60 100%)',
                              boxShadow: '0 0 10px rgba(232, 185, 67, 0.7)',
                              transform: `translateX(${safeIndex * 14}px)`,
                              transition: 'transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1.15)',
                              pointerEvents: 'none',
                              zIndex: 2
                            }}
                          />

                          {/* Fixed Background Dots */}
                          {availablePosters.map((_, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => scrollToPoster(pIdx)}
                              aria-label={`Go to slide ${pIdx + 1}`}
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
                                  background: 'rgba(255, 255, 255, 0.32)',
                                  opacity: safeIndex === pIdx ? 0 : 1,
                                  transition: 'opacity 0.2s ease'
                                }}
                              />
                            </button>
                          ))}
                        </div>

                        {/* Right Scroll Arrow */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollToPoster(safeIndex + 1);
                          }}
                          aria-label="Next video"
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(232, 185, 67, 0.4)',
                            color: '#E8B943',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '15px',
                            fontWeight: 800,
                            lineHeight: 1,
                            transition: 'all 0.2s ease',
                            flexShrink: 0
                          }}
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Section 4: DIRECT ACTION BUTTONS (BELOW VIDEOS) */}
          <div className="hp-mob-section hp-mob-cta-section">
            <div className="hp-mob-dual-btn-row">
              <a 
                href="tel:+918076515257" 
                className="hp-mob-phone-btn"
                aria-label="Call +91 80765 15257 for instant artist booking"
              >
                <span className="hp-mob-phone-icon">📞</span>
                <span className="hp-mob-phone-num">+91 80765 15257</span>
              </a>
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
