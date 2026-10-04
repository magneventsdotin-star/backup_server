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
  const videoRef = useRef(null)

  // Auto-run carousel so user easily sees all cards and videos
  useEffect(() => {
    if (!isOpen || isInteracting || !isVideoMuted) return

    const timer = setInterval(() => {
      setCardIndex(prev => (prev + 1) % EVENT_POSTERS.length)
    }, 4500)

    return () => clearInterval(timer)
  }, [isOpen, isInteracting, isVideoMuted])

  useEffect(() => {
    const handleOpen = (e) => {
      if (e?.detail?.index !== undefined && e.detail.index >= 0 && e.detail.index < EVENT_POSTERS.length) {
        setCardIndex(e.detail.index)
      } else if (e?.detail?.category || e?.detail?.eventType || e?.detail?.packageTitle) {
        const term = (e?.detail?.packageTitle || e?.detail?.category || e?.detail?.eventType || '').toLowerCase()
        const found = EVENT_POSTERS.findIndex(p => 
          p.category.toLowerCase().includes(term) ||
          p.title.toLowerCase().includes(term) ||
          p.tab.toLowerCase().includes(term) ||
          term.includes(p.category.toLowerCase()) ||
          term.includes(p.title.toLowerCase())
        )
        if (found !== -1) setCardIndex(found)
      }
      setIsOpen(true)
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

  const handlePrevCard = () => {
    setCardIndex(prev => (prev - 1 + EVENT_POSTERS.length) % EVENT_POSTERS.length)
  }

  const handleNextCard = () => {
    setCardIndex(prev => (prev + 1) % EVENT_POSTERS.length)
  }

  const current = EVENT_POSTERS[cardIndex] || EVENT_POSTERS[0]

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
              WebkitOverflowScrolling: 'touch',
              background: 'linear-gradient(180deg, #161325 0%, #0d0b17 100%)',
              border: '1px solid rgba(255, 224, 50, 0.35)',
              borderRadius: '24px',
              padding: '18px 16px 20px',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.95), 0 0 45px rgba(255, 224, 50, 0.15)',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            {/* Top ambient luxury glow */}
            <div
              style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '320px',
                height: '140px',
                background: 'radial-gradient(ellipse at center, rgba(255, 224, 50, 0.22) 0%, rgba(255, 107, 0, 0.08) 50%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
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
                padding: '4px 11px',
                background: 'rgba(255, 224, 50, 0.12)',
                border: '1px solid rgba(255, 224, 50, 0.4)',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#FFE032',
                letterSpacing: '0.04em'
              }}>
                <span>🔥</span>
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
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
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
                Book Live Artists for <span style={{ color: '#FFE032' }}>Only ₹99</span>
              </h3>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.65)',
                margin: 0,
                lineHeight: 1.4
              }}>
                Lock any verified artist slot today. 100% refundable with artist arrival guarantee.
              </p>
            </div>

            {/* Quick Format Categories Selector */}
            <div style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingBottom: '4px',
              marginBottom: '12px',
              position: 'relative',
              zIndex: 2
            }}>
              {EVENT_POSTERS.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setCardIndex(idx)
                    setIsInteracting(true)
                    setTimeout(() => setIsInteracting(false), 5000)
                  }}
                  style={{
                    padding: '5px 11px',
                    borderRadius: '999px',
                    border: cardIndex === idx ? '1px solid #FFE032' : '1px solid rgba(255, 255, 255, 0.12)',
                    background: cardIndex === idx ? 'rgba(255, 224, 50, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                    color: cardIndex === idx ? '#FFE032' : 'rgba(255, 255, 255, 0.7)',
                    fontSize: '11px',
                    fontWeight: cardIndex === idx ? 800 : 600,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>{p.tab}</span>
                  {idx < 4 && (
                    <span style={{
                      fontSize: '8.5px',
                      background: 'rgba(239, 68, 68, 0.3)',
                      color: '#FCA5A5',
                      borderRadius: '4px',
                      padding: '1px 4px',
                      fontWeight: 800,
                      letterSpacing: '0.04em'
                    }}>
                      VIDEO
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ══════════════════════════════════════════════════════════
                SHOWCASE CARD (AUTO-RUN WITH AUDITION SOUND & CAROUSEL)
                ══════════════════════════════════════════════════════════ */}
            <div 
              onMouseEnter={() => setIsInteracting(true)}
              onMouseLeave={() => setIsInteracting(false)}
              onTouchStart={() => setIsInteracting(true)}
              onTouchEnd={() => setTimeout(() => setIsInteracting(false), 2500)}
              style={{
                position: 'relative',
                borderRadius: '18px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 215, 0, 0.35)',
                background: '#07060B',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8)',
                marginBottom: '14px',
                aspectRatio: '3 / 3.4',
                maxHeight: '340px'
              }}
            >
              {/* Story-Style Auto-Advance Progress Indicators */}
              <div style={{
                position: 'absolute',
                top: '6px',
                left: '10px',
                right: '10px',
                display: 'flex',
                gap: '4px',
                zIndex: 6
              }}>
                {EVENT_POSTERS.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCardIndex(idx)
                      setIsInteracting(true)
                      setTimeout(() => setIsInteracting(false), 4000)
                    }}
                    style={{
                      flex: 1,
                      height: '2.5px',
                      borderRadius: '2px',
                      background: cardIndex > idx ? '#FFE032' : cardIndex === idx ? '#FFE032' : 'rgba(255, 255, 255, 0.25)',
                      boxShadow: cardIndex === idx ? '0 0 6px rgba(255, 224, 50, 0.8)' : 'none',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>

              {/* Media: Video (GIF-like seamless autoPlay loop, muted by default) or Poster */}
              <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {current.mediaType === 'video' && current.videoUrl ? (
                  <video
                    ref={videoRef}
                    key={current.videoUrl + current.id}
                    src={current.videoUrl}
                    poster={current.poster}
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
                    src={current.poster}
                    alt={current.title}
                    fill
                    sizes="460px"
                    style={{ objectFit: 'cover' }}
                    unoptimized
                    priority
                  />
                )}
              </div>

              {/* Vignette Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.7) 60%, rgba(8,7,12,0.96) 95%)',
                pointerEvents: 'none'
              }} />

              {/* Top Controls Bar */}
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '12px',
                right: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 4
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    background: 'rgba(8, 8, 14, 0.85)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    border: '1px solid rgba(255, 224, 50, 0.45)',
                    color: '#FFE032',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '5px 12px',
                    borderRadius: '100px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
                  }}>
                    {current.tab.replace(/^[^\s]+\s/, '')}
                  </span>
                  {current.mediaType === 'video' ? (
                    <span style={{
                      background: 'rgba(239, 68, 68, 0.25)',
                      border: '1px solid rgba(239, 68, 68, 0.55)',
                      color: '#FCA5A5',
                      fontSize: '9.5px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                      LIVE VIDEO
                    </span>
                  ) : (
                    <span style={{
                      background: 'rgba(59, 130, 246, 0.25)',
                      border: '1px solid rgba(59, 130, 246, 0.55)',
                      color: '#93C5FD',
                      fontSize: '9.5px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '100px',
                    }}>
                      📸 ARTIST POSTER
                    </span>
                  )}
                </div>

                {/* Audition Audio Toggle for Videos */}
                {current.mediaType === 'video' ? (
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isVideoMuted ? "Unmute live audition sound" : "Mute audition sound"}
                    title={isVideoMuted ? "Tap to listen to live audition sound" : "Mute audition sound"}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '32px',
                      padding: '0 11px',
                      borderRadius: '100px',
                      background: isVideoMuted ? 'rgba(8, 8, 14, 0.88)' : 'linear-gradient(135deg, #FFE032 0%, #FFB800 100%)',
                      backdropFilter: 'blur(14px)',
                      border: isVideoMuted ? '1px solid rgba(255, 224, 50, 0.45)' : '1px solid #FFE032',
                      color: isVideoMuted ? '#FFE032' : '#000000',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{isVideoMuted ? '🔇' : '🔊'}</span>
                    <span>{isVideoMuted ? 'Live Sound' : 'Audition On'}</span>
                  </button>
                ) : (
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '100px',
                    background: 'rgba(8, 8, 14, 0.75)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '10.5px',
                    fontWeight: 700
                  }}>
                    Card {cardIndex + 1}/{EVENT_POSTERS.length}
                  </div>
                )}
              </div>

              {/* Floating Left and Right Arrow Navigation Overlays */}
              <button
                type="button"
                onClick={handlePrevCard}
                aria-label="Previous event card"
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '45%',
                  transform: 'translateY(-50%)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 4
                }}
              >
                ◀
              </button>

              <button
                type="button"
                onClick={handleNextCard}
                aria-label="Next event card"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '45%',
                  transform: 'translateY(-50%)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 4
                }}
              >
                ▶
              </button>

              {/* Card Bottom Overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px 14px 14px 14px',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: 'linear-gradient(180deg, rgba(8, 8, 14, 0) 0%, rgba(8, 8, 14, 0.88) 25%, #08080e 100%)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{
                    background: 'rgba(255, 224, 50, 0.12)',
                    border: '1px solid rgba(255, 224, 50, 0.4)',
                    color: '#FFE032',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    {current.tag}
                  </span>
                  {current.rating && (
                    <span style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '10.5px',
                      fontWeight: 700
                    }}>
                      ⭐ {current.rating}
                    </span>
                  )}
                </div>

                <div>
                  <h4 style={{
                    fontSize: '17px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: 0,
                    lineHeight: 1.25,
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
                  }}>
                    {current.title}
                  </h4>
                </div>

                {/* Pricing Strip */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(18, 18, 26, 0.88)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 215, 0, 0.25)',
                  borderRadius: '12px',
                  padding: '7px 11px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '10.5px', color: '#64748B', textDecoration: 'line-through' }}>
                      {current.regularPrice}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 900, color: '#FFE032' }}>
                        {current.offerPrice}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #FFE032 0%, #FFB800 100%)',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: '11px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(255, 224, 50, 0.35)',
                    letterSpacing: '0.2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>⚡ LOCK SLOT ₹99</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots Counter */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '14px'
            }}>
              {EVENT_POSTERS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCardIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    width: cardIndex === idx ? '18px' : '6px',
                    height: '6px',
                    borderRadius: '999px',
                    background: cardIndex === idx ? '#FFE032' : 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>

            {/* ══════════════════════════════════════════════════════════
                MINIMAL 2-FIELD FORM (NAME + PHONE NUMBER ONLY)
                ══════════════════════════════════════════════════════════ */}
            <MinimalBookingForm currentCard={current} onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function MinimalBookingForm({ currentCard, onClose }) {
  const [formData, setFormData] = useState({ name: '', phone: '' })
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

      const generatedRef = `MAG-99-${Date.now().toString().slice(-6)}`
      await bookingService.submitInstantRequest({
        name: trimmedName,
        phone: cleanPhone,
        message: `[₹99 SPECIAL POPUP] Reserved: ${currentCard.title} (${currentCard.category}). Offer: ${currentCard.offerPrice} (Regular: ${currentCard.regularPrice}). Discount: ${currentCard.discount}. Lock slot for ₹99 requested.`,
        eventType: currentCard.category || 'Live Artist Booking (₹99 Special)',
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
          Slot Lock Reserved!
        </h4>
        <p style={{ margin: '0 0 10px', color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
          Your 55%–65% discount is locked for <strong>{currentCard.title}</strong>.
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
            href={`https://wa.me/918076515257?text=${encodeURIComponent(`Hi Magnevents, I just locked the ₹99 slot for ${currentCard.title} (Ref: ${refCode}). Please share available artist profiles and confirm my slot!`)}`}
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Selected Format Highlight */}
      <div style={{
        background: 'rgba(255, 224, 50, 0.08)',
        border: '1px solid rgba(255, 224, 50, 0.22)',
        borderRadius: '10px',
        padding: '7px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11.5px',
        color: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🎤</span>
          <span>Selected: <strong style={{ color: '#FFE032' }}>{currentCard.tab.replace(/^[^\s]+\s/, '')}</strong></span>
        </div>
        <span style={{ color: '#34D399', fontWeight: 800 }}>Only ₹99</span>
      </div>

      {/* Field 1: Name */}
      <div>
        <input
          id="popup-lead-name"
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }))
            if (errorMsg) setErrorMsg('')
          }}
          placeholder="Your Full Name (e.g. Rahul Sharma)"
          style={{
            width: '100%',
            height: '44px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '12px',
            padding: '0 14px',
            color: '#FFFFFF',
            fontSize: '13.5px',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => { e.target.style.borderColor = '#FFE032' }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)' }}
        />
      </div>

      {/* Field 2: Phone */}
      <div>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '13px',
            color: '#94A3B8',
            fontWeight: 700
          }}>
            🇮🇳 +91
          </span>
          <input
            id="popup-lead-phone"
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
              height: '44px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '12px',
              padding: '0 14px 0 68px',
              color: '#FFFFFF',
              fontSize: '13.5px',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => { e.target.style.borderColor = '#FFE032' }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)' }}
          />
        </div>
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
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #FFE032 0%, #FF9900 100%)',
          color: '#080A0E',
          fontSize: '14px',
          fontWeight: 900,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          boxShadow: '0 6px 20px rgba(255, 224, 50, 0.35)',
          transition: 'all 0.2s ease',
          marginTop: '2px'
        }}
      >
        <span>{isSubmitting ? 'Locking Slot...' : `⚡ Book for ₹99 & Claim 60% OFF ➔`}</span>
      </button>

      {/* Trust & Guarantee Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '10.5px',
        color: 'rgba(255, 255, 255, 0.55)',
        marginTop: '2px',
        flexWrap: 'wrap'
      }}>
        <span>🛡️ 100% Arrival Guarantee</span>
        <span>•</span>
        <span>💎 0% Markup</span>
        <span>•</span>
        <span>💬 Instant WhatsApp Connect</span>
      </div>
    </form>
  )
}
