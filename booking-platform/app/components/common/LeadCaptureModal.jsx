"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { EVENT_POSTERS } from '@/app/constants/eventPosters'
import { bookingService } from '@/app/services/bookingService'
import { getSilentLocationIfGranted } from '@/app/utils/geolocation'
import '@/app/styles/components/ContactModal.css'

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [isInteracting, setIsInteracting] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)
  const videoRef = useRef(null)
  const carouselRef = useRef(null)
  const isProgrammaticScroll = useRef(false)
  const scrollTimeoutRef = useRef(null)

  // Smooth scroll carousel to target card index
  const scrollToCard = (index, smooth = true) => {
    setCardIndex(index)
    const container = carouselRef.current
    if (!container) return
    const cardEl = container.children[index]
    if (!cardEl) return
    const targetLeft = cardEl.offsetLeft - (container.clientWidth - cardEl.offsetWidth) / 2
    isProgrammaticScroll.current = true
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: smooth ? 'smooth' : 'auto'
    })
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 450)
  }

  // Detect which card is centered while user scrolls horizontally on mobile/desktop
  const handleCarouselScroll = () => {
    if (isProgrammaticScroll.current) return
    const container = carouselRef.current
    if (!container) return
    const center = container.scrollLeft + container.clientWidth / 2
    const children = Array.from(container.children)
    let closestIndex = 0
    let minDistance = Infinity
    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2
      const dist = Math.abs(center - childCenter)
      if (dist < minDistance) {
        minDistance = dist
        closestIndex = idx
      }
    })
    if (closestIndex !== cardIndex) {
      setCardIndex(closestIndex)
    }
  }

  // Mouse drag support for desktop/devtools
  const handleMouseDown = (e) => {
    setIsInteracting(true)
    dragStartXRef.current = e.pageX
  }

  const handleMouseMove = (e) => {}

  const handleMouseUp = (e) => {
    setIsInteracting(false)
    if (dragStartXRef.current && e?.pageX) {
      const diff = dragStartXRef.current - e.pageX
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          handleNextCard(e)
        } else {
          handlePrevCard(e)
        }
      }
    }
  }

  const handleMouseLeave = () => {
    setIsInteracting(false)
  }

  const handleTouchStart = (e) => {
    setIsInteracting(true)
    if (e.touches && e.touches[0]) {
      setTouchStartX(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = (e) => {
    setTimeout(() => setIsInteracting(false), 2500)
    if (e.changedTouches && e.changedTouches[0]) {
      const diff = touchStartX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          handleNextCard(e)
        } else {
          handlePrevCard(e)
        }
      }
    }
  }

  // Auto-run circular carousel so user easily sees all cards and videos
  useEffect(() => {
    if (!isOpen || isInteracting || !isVideoMuted) return

    const timer = setInterval(() => {
      setCardIndex(prev => (prev + 1) % EVENT_POSTERS.length)
    }, 4800)

    return () => clearInterval(timer)
  }, [isOpen, isInteracting, isVideoMuted])

  // Center active card when modal opens
  useEffect(() => {
    if (isOpen) {
      const modalEl = document.querySelector('.lux-modal-content')
      if (modalEl) modalEl.scrollLeft = 0
      const timer = setTimeout(() => {
        if (modalEl) modalEl.scrollLeft = 0
        scrollToCard(cardIndex, false)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    const handleOpen = (e) => {
      let targetIdx = 0
      if (e?.detail?.index !== undefined && e.detail.index >= 0 && e.detail.index < EVENT_POSTERS.length) {
        targetIdx = e.detail.index
        setCardIndex(targetIdx)
      } else if (e?.detail?.category || e?.detail?.eventType || e?.detail?.packageTitle) {
        const term = (e?.detail?.packageTitle || e?.detail?.category || e?.detail?.eventType || '').toLowerCase()
        const found = EVENT_POSTERS.findIndex(p => 
          p.category.toLowerCase().includes(term) ||
          p.title.toLowerCase().includes(term) ||
          p.tab.toLowerCase().includes(term) ||
          term.includes(p.category.toLowerCase()) ||
          term.includes(p.title.toLowerCase())
        )
        if (found !== -1) {
          targetIdx = found
          setCardIndex(targetIdx)
        }
      }
      setIsOpen(true)
      setTimeout(() => {
        scrollToCard(targetIdx, false)
      }, 120)
    }

    window.addEventListener('open-lead-capture', handleOpen)
    window.addEventListener('open-quick-booking', handleOpen)

    // Open automatically on website arrival after 2.2 seconds if not previously dismissed in this session
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      const search = window.location.search
      if (hash === '#offers' || hash === '#book-99' || hash === '#lead-capture' || search.includes('open=offers')) {
        setIsOpen(true)
      } else {
        const hasSeen = sessionStorage.getItem('magnevents_welcome_modal_seen')
        if (!hasSeen) {
          sessionStorage.setItem('magnevents_welcome_modal_seen', 'true')
          const timer = setTimeout(() => {
            setIsOpen(true)
          }, 2200)
          return () => {
            clearTimeout(timer)
            window.removeEventListener('open-lead-capture', handleOpen)
            window.removeEventListener('open-quick-booking', handleOpen)
          }
        }
      }
    }

    return () => {
      window.removeEventListener('open-lead-capture', handleOpen)
      window.removeEventListener('open-quick-booking', handleOpen)
    }
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('modal-open')
    } else {
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
  }, [isOpen])

  const onClose = () => {
    setIsOpen(false)
  }

  const toggleMute = (e) => {
    e?.stopPropagation()
    const nextMuted = !isVideoMuted
    setIsVideoMuted(nextMuted)
    if (videoRef.current) {
      videoRef.current.muted = nextMuted
    }
  }

  const togglePlayPause = (e) => {
    e?.stopPropagation()
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {})
      setIsVideoPlaying(true)
    } else {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    }
  }

  const handlePrevCard = (e) => {
    e?.stopPropagation()
    const prev = (cardIndex - 1 + EVENT_POSTERS.length) % EVENT_POSTERS.length
    setCardIndex(prev)
    scrollToCard(prev, true)
  }

  const handleNextCard = (e) => {
    e?.stopPropagation()
    const next = (cardIndex + 1) % EVENT_POSTERS.length
    setCardIndex(next)
    scrollToCard(next, true)
  }

  const handleSelectEvent = (index) => {
    setCardIndex(index)
    scrollToCard(index, true)
  }

  const current = EVENT_POSTERS[cardIndex] || EVENT_POSTERS[0]
  const prevIndex = (cardIndex - 1 + EVENT_POSTERS.length) % EVENT_POSTERS.length
  const nextIndex = (cardIndex + 1) % EVENT_POSTERS.length
  const prevCard = EVENT_POSTERS[prevIndex] || EVENT_POSTERS[0]
  const nextCard = EVENT_POSTERS[nextIndex] || EVENT_POSTERS[0]

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          key="welcome-popup-root"
          className="lux-modal-root"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
          style={{
            zIndex: 100000,
            padding: '16px 12px',
            alignItems: 'center',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          }}
        >
          <motion.div
            className="lux-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              background: 'rgba(6, 5, 12, 0.78)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          />

          <motion.div
            className="lux-modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.93, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 22 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            style={{
              maxWidth: '460px',
              width: '100%',
              margin: 'auto',
              maxHeight: 'calc(100vh - 28px)',
              overflowY: 'auto',
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch',
              background: 'linear-gradient(145deg, rgba(25, 20, 42, 0.78) 0%, rgba(12, 10, 24, 0.88) 100%)',
              backdropFilter: 'blur(36px) saturate(180%)',
              WebkitBackdropFilter: 'blur(36px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '24px',
              padding: '18px 16px 20px',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 224, 50, 0.14), inset 0 1px 1.5px rgba(255, 255, 255, 0.3)',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            {/* Top ambient glass glowing auroras */}
            <div
              style={{
                position: 'absolute',
                top: '-50px',
                left: '-30px',
                width: '260px',
                height: '220px',
                background: 'radial-gradient(circle, rgba(255, 224, 50, 0.22) 0%, rgba(255, 120, 0, 0.08) 50%, transparent 75%)',
                pointerEvents: 'none',
                zIndex: 0,
                filter: 'blur(30px)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-40px',
                right: '-30px',
                width: '240px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 75%)',
                pointerEvents: 'none',
                zIndex: 0,
                filter: 'blur(30px)'
              }}
            />
            {/* Specular glass reflection line at top */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '24px',
                right: '24px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 2
              }}
            />

            {/* Header Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                background: 'linear-gradient(135deg, rgba(255, 224, 50, 0.16) 0%, rgba(255, 153, 0, 0.08) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 224, 50, 0.45)',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#FFE032',
                letterSpacing: '0.04em',
                boxShadow: '0 4px 16px rgba(255, 224, 50, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.35)'
              }}>
                <span style={{ filter: 'drop-shadow(0 0 6px rgba(255, 180, 0, 0.8))' }}>🔥</span>
                <span>FIRST-TIME SPECIAL: 55%–65% OFF</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.25), 0 4px 12px rgba(0, 0, 0, 0.35)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Title & Subtitle */}
            <div style={{ marginBottom: '14px', position: 'relative', zIndex: 2 }}>
              <h3 style={{
                fontSize: '19px',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: '0 0 3px',
                lineHeight: 1.25,
                letterSpacing: '-0.02em'
              }}>
                Book Verified Live Artists <span style={{ color: '#FFE032' }}>Online</span>
              </h3>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.65)',
                margin: 0,
                lineHeight: 1.4
              }}>
                Connect with verified singers and live bands. 100% artist arrival guarantee.
              </p>
            </div>

            {/* ══════════════════════════════════════════════════════════
                HORIZONTAL SCROLLING SHOWCASE CAROUSEL
                ══════════════════════════════════════════════════════════ */}
            <div 
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              onMouseEnter={() => setIsInteracting(true)}
              onMouseLeave={() => setIsInteracting(false)}
              onTouchStart={() => setIsInteracting(true)}
              onTouchEnd={() => setTimeout(() => setIsInteracting(false), 3000)}
              className="lux-modal-carousel-scroll"
              style={{
                position: 'relative',
                marginBottom: '10px',
                width: 'calc(100% + 28px)',
                marginLeft: '-14px',
                marginRight: '-14px',
                display: 'flex',
                alignItems: 'stretch',
                gap: '12px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                padding: '8px 18px 12px 18px',
                userSelect: 'none',
                scrollBehavior: 'smooth'
              }}
            >
              {EVENT_POSTERS.map((card, idx) => {
                const isActive = cardIndex === idx;
                return (
                  <div
                    key={card.id || card.title || idx}
                    onClick={() => {
                      scrollToCard(idx, true);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${card.title}`}
                    style={{
                      flex: '0 0 min(255px, 74vw)',
                      maxWidth: '280px',
                      height: 'clamp(280px, 38vh, 325px)',
                      position: 'relative',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      scrollSnapAlign: 'center',
                      cursor: 'pointer',
                      border: isActive ? '1.8px solid #FFE032' : '1px solid rgba(255, 255, 255, 0.16)',
                      background: 'rgba(10, 8, 20, 0.95)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      boxShadow: isActive
                        ? '0 16px 40px rgba(0, 0, 0, 0.85), 0 0 24px rgba(255, 224, 50, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
                        : '0 8px 24px rgba(0, 0, 0, 0.6)',
                      opacity: isActive ? 1 : 0.65,
                      transform: isActive ? 'scale(1)' : 'scale(0.95)',
                      transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                      flexShrink: 0
                    }}
                  >
                    {/* Media: Video if active & has videoUrl, Poster otherwise */}
                    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                      {isActive && card.videoUrl ? (
                        <video
                          ref={videoRef}
                          key={card.videoUrl + card.id}
                          src={card.videoUrl}
                          poster={card.poster}
                          autoPlay
                          loop
                          muted={isVideoMuted}
                          playsInline
                          preload="auto"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onPlay={() => setIsVideoPlaying(true)}
                          onPause={() => setIsVideoPlaying(false)}
                        />
                      ) : (
                        <Image
                          src={card.poster}
                          alt={card.title}
                          fill
                          sizes="(max-width: 640px) 80vw, 300px"
                          style={{ objectFit: 'cover' }}
                          unoptimized
                          priority={idx <= 2}
                        />
                      )}
                    </div>

                    {/* Vignette Overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.65) 60%, rgba(8,7,12,0.96) 95%)',
                      pointerEvents: 'none'
                    }} />

                    {/* Top Controls Bar - Both icons in opposite corners on active video card */}
                    {isActive && card.videoUrl && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        right: '10px',
                        width: 'calc(100% - 20px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        zIndex: 4,
                        pointerEvents: 'none'
                      }}>
                        <button
                          type="button"
                          className={`hp-poster-glass-btn ${!isVideoMuted ? 'is-active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                          aria-label={isVideoMuted ? "Unmute sound" : "Mute sound"}
                          title={isVideoMuted ? "Tap to Unmute" : "Tap to Mute"}
                          style={{ width: '30px', height: '30px', pointerEvents: 'auto' }}
                        >
                          {isVideoMuted ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.25"/>
                              <line x1="23" y1="9" x2="17" y2="15"/>
                              <line x1="17" y1="9" x2="23" y2="15"/>
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.25"/>
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                            </svg>
                          )}
                        </button>

                        <button
                          type="button"
                          className={`hp-poster-glass-btn ${!isVideoPlaying ? 'is-paused' : ''}`}
                          onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
                          aria-label={isVideoPlaying ? "Pause video" : "Play video"}
                          title={isVideoPlaying ? "Tap to Pause" : "Tap to Play"}
                          style={{ width: '30px', height: '30px', marginLeft: 'auto', pointerEvents: 'auto' }}
                        >
                          {isVideoPlaying ? (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="6" y="4" width="4" height="16" rx="1.5" />
                              <rect x="14" y="4" width="4" height="16" rx="1.5" />
                            </svg>
                          ) : (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '1px' }}>
                              <polygon points="6 4 20 12 6 20 6 4" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Card Bottom Overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '24px 14px 12px 14px',
                      zIndex: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      background: 'linear-gradient(180deg, rgba(8, 8, 14, 0) 0%, rgba(8, 8, 14, 0.72) 45%, #08080e 100%)'
                    }}>
                      <h4 style={{
                        fontSize: '15px',
                        fontWeight: 800,
                        fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
                        color: '#FFFFFF',
                        margin: 0,
                        lineHeight: 1.25,
                        letterSpacing: '-0.01em',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)'
                      }}>
                        {card.title}
                      </h4>
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
              marginBottom: '14px',
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
                    transform: `translateX(${cardIndex * 14}px)`,
                    transition: 'transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1.15)',
                    pointerEvents: 'none',
                    zIndex: 2
                  }}
                />

                {/* Fixed Background Dots (Each 14px slot, dots never jump or shift) */}
                {EVENT_POSTERS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToCard(idx, true)}
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
                        opacity: cardIndex === idx ? 0 : 1,
                        transition: 'opacity 0.2s ease'
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════
                MINIMAL FORM (EVENT SELECTOR + NAME + PHONE NUMBER)
                ══════════════════════════════════════════════════════════ */}
            <MinimalBookingForm currentCard={current} onSelectEvent={handleSelectEvent} onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function MinimalBookingForm({ currentCard, onSelectEvent, onClose }) {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '',
    eventDetails: ''
  })
  const selectedEventType = currentCard?.tab || currentCard?.category || 'Live Artist Booking'
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [refCode, setRefCode] = useState('')
  const [geoData, setGeoData] = useState({ latitude: null, longitude: null, detectedLocation: '' })

  useEffect(() => {
    getSilentLocationIfGranted().then(geo => {
      if (geo && geo.success) {
        setGeoData({ latitude: geo.latitude, longitude: geo.longitude, detectedLocation: geo.detectedLocation })
      }
    })
  }, [])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setErrorMsg('')

    const trimmedName = formData.name.trim()
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg('Please enter your name.')
      const el = document.getElementById('popup-lead-name')
      if (el) el.focus()
      return
    }

    const cleanPhone = (formData.phone || '').replace(/[^0-9]/g, '').slice(-10)
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.')
      const el = document.getElementById('popup-lead-phone')
      if (el) el.focus()
      return
    }

    setIsSubmitting(true)
    try {
      let deviceType = 'M'
      if (typeof window !== 'undefined') {
        if (window.innerWidth > 1024) deviceType = 'D'
        else if (window.innerWidth > 768) deviceType = 'T'
      }

      const generatedRef = `MAG-ART-${Date.now().toString().slice(-6)}`
      await bookingService.submitInstantRequest({
        name: trimmedName,
        phone: cleanPhone,
        date: '',
        location: geoData.detectedLocation || '',
        eventDetails: formData.eventDetails?.trim() || '',
        message: `[ARTIST BOOKING REQUEST] ${selectedEventType}${formData.eventDetails ? ` | Details: ${formData.eventDetails.trim()}` : ''}. Reserved: ${currentCard.title} (${currentCard.category}). Check availability and confirm artist slot.`,
        eventType: selectedEventType || currentCard.category || 'Live Artist Booking',
        type: 'token_booking_99_reserved',
        formType: 'welcome_popup',
        formName: 'Welcome 10-Card Popup',
        deviceType: deviceType,
        formLink: typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#book-99` : '',
        referenceCode: generatedRef,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        detectedLocation: geoData.detectedLocation
      })

      setRefCode(generatedRef)
      setIsSuccess(true)
    } catch (err) {
      console.error('Welcome modal submit error:', err)
      setErrorMsg('Could not submit request. Please try again or WhatsApp us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '16px 10px 10px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        border: '1px solid rgba(16, 185, 129, 0.35)'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '2px solid #10B981',
          color: '#10B981',
          fontSize: '26px',
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 10px',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)'
        }}>
          ✓
        </div>
        <h4 style={{ margin: '0 0 4px', color: '#FFFFFF', fontSize: '18px', fontWeight: 900 }}>
          Artist Request Received!
        </h4>
        <p style={{ margin: '0 0 10px', color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
          Your artist request is locked for <strong>{currentCard.title}</strong>.
        </p>

        <div style={{
          display: 'inline-block',
          background: 'rgba(255, 224, 50, 0.12)',
          border: '1px dashed #FFE032',
          padding: '6px 14px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 800,
          color: '#FFE032',
          marginBottom: '14px'
        }}>
          REF: {refCode}
        </div>

        <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
          <a
            href={`https://wa.me/918076515257?text=${encodeURIComponent(`Hi Magnevents, I just requested a booking for ${currentCard.title} (Ref: ${refCode}). Please share available artist profiles and confirm my slot!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              height: '42px',
              borderRadius: '10px',
              background: '#25D366',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <span>💬 WhatsApp Concierge</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0 16px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Field 1: Name */}
      <div>
        <input
          id="popup-lead-name"
          className="popup-lead-input"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }))
            if (errorMsg) setErrorMsg('')
          }}
          placeholder="Your Full Name (e.g. Rahul Sharma)"
          style={{
            width: '100%',
            height: '46px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.2px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '13px',
            padding: '0 14px',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: 500,
            boxSizing: 'border-box',
            outline: 'none',
            boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            transition: 'all 0.25s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#FFE032'
            e.target.style.background = 'rgba(255, 255, 255, 0.12)'
            e.target.style.boxShadow = '0 0 20px rgba(255, 224, 50, 0.3), inset 0 2px 6px rgba(0, 0, 0, 0.3)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.22)'
            e.target.style.background = 'rgba(255, 255, 255, 0.08)'
            e.target.style.boxShadow = 'inset 0 2px 6px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
          }}
        />
      </div>

      {/* Field 2: Phone */}
      <div>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '12.5px',
            color: '#FFE032',
            fontWeight: 800,
            background: 'rgba(255, 224, 50, 0.14)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1.2px solid rgba(255, 224, 50, 0.45)',
            borderRadius: '8px',
            padding: '3px 8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
            zIndex: 2,
            letterSpacing: '0.02em'
          }}>
            🇮🇳 +91
          </span>
          <input
            id="popup-lead-phone"
            className="popup-lead-input"
            type="tel"
            maxLength={10}
            value={formData.phone}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
              setFormData(prev => ({ ...prev, phone: digits }))
              if (errorMsg) setErrorMsg('')
            }}
            placeholder="Mobile / WhatsApp Number"
            style={{
              width: '100%',
              height: '46px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1.2px solid rgba(255, 255, 255, 0.22)',
              borderRadius: '13px',
              padding: '0 14px 0 76px',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 500,
              boxSizing: 'border-box',
              outline: 'none',
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              transition: 'all 0.25s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#FFE032'
              e.target.style.background = 'rgba(255, 255, 255, 0.12)'
              e.target.style.boxShadow = '0 0 20px rgba(255, 224, 50, 0.3), inset 0 2px 6px rgba(0, 0, 0, 0.3)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.22)'
              e.target.style.background = 'rgba(255, 255, 255, 0.08)'
              e.target.style.boxShadow = 'inset 0 2px 6px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
            }}
          />
        </div>
      </div>

      {/* Field 3: Single Event Details Box */}
      <div>
        <textarea
          id="popup-lead-event-details"
          className="popup-lead-input"
          rows={2}
          value={formData.eventDetails}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, eventDetails: e.target.value }))
            if (errorMsg) setErrorMsg('')
          }}
          placeholder="📝 Event Details (e.g. 25 Oct, House Party in Delhi, Bollywood & Sufi)"
          style={{
            width: '100%',
            minHeight: '48px',
            maxHeight: '80px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.2px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '13px',
            padding: '10px 14px',
            color: '#FFFFFF',
            fontSize: '13px',
            lineHeight: '1.4',
            boxSizing: 'border-box',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            transition: 'all 0.25s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#FFE032'
            e.target.style.background = 'rgba(255, 255, 255, 0.12)'
            e.target.style.boxShadow = '0 0 20px rgba(255, 224, 50, 0.3), inset 0 2px 6px rgba(0, 0, 0, 0.3)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.22)'
            e.target.style.background = 'rgba(255, 255, 255, 0.08)'
            e.target.style.boxShadow = 'inset 0 2px 6px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
          }}
        />
      </div>

      {errorMsg && (
        <div style={{ color: '#FF6B6B', fontSize: '11.5px', fontWeight: 600 }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Primary Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          height: '50px',
          borderRadius: '13px',
          background: 'linear-gradient(135deg, #FFE032 0%, #FFB800 50%, #FF9900 100%)',
          color: '#080A0E',
          fontSize: '14px',
          fontWeight: 900,
          border: '1px solid rgba(255, 255, 255, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          boxShadow: '0 8px 25px rgba(255, 224, 50, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.7)',
          transition: 'all 0.25s ease',
          marginTop: '4px',
          letterSpacing: '0.01em',
          textShadow: '0 1px 1px rgba(255, 255, 255, 0.3)',
          whiteSpace: 'nowrap'
        }}
      >
        <span>{isSubmitting ? 'Reserving Slot & Claiming 55%–65% OFF...' : `⚡ Claim 55%–65% OFF & Book Slot ➔`}</span>
      </button>
    </form>
  )
}
