"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { validateName, validatePhone } from '@helpers/validation'
import { bookingService } from '@/app/services/bookingService'
import { getSilentLocationIfGranted } from '@/app/utils/geolocation'
import '@/app/styles/components/ContactModal.css'

// Module-scoped flag: isolated to each individual browser tab's JavaScript runtime
let hasAutoOpenedInCurrentTab = false

export default function QuickBookingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-quick-booking', handleOpen)
    window.addEventListener('open-token-booking', handleOpen)
    window.addEventListener('open-instant-form', handleOpen)
    window.addEventListener('open-instant-booking', handleOpen)

    const checkHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash
        const search = window.location.search
        if (
          hash === '#book-99' ||
          hash === '#instant-form' ||
          hash === '#quick-booking' ||
          hash === '#quick-contact' ||
          search.includes('quick-booking') ||
          search.includes('instant-form')
        ) {
          setIsOpen(true)
        }
      }
    }

    checkHash()
    window.addEventListener('hashchange', checkHash)

    // Clear legacy permanent localStorage blocker if set from previous visits/submissions
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('mgn_popup_form_submitted')
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('open-quick-booking', handleOpen)
      window.removeEventListener('open-token-booking', handleOpen)
      window.removeEventListener('open-instant-form', handleOpen)
      window.removeEventListener('open-instant-booking', handleOpen)
      window.removeEventListener('hashchange', checkHash)
    }
  }, [])

  // Auto-open mandatory form once per tab/session:
  // Home page timing is 6 seconds (6000ms), other pages timing is 4 seconds (4000ms)
  useEffect(() => {
    if (hasAutoOpenedInCurrentTab) return

    const isHomePage = !pathname || pathname === '/' || pathname === ''
    const delay = isHomePage ? 6000 : 4000

    const autoOpenTimer = setTimeout(() => {
      if (!hasAutoOpenedInCurrentTab) {
        setIsOpen(true)
        hasAutoOpenedInCurrentTab = true
      }
    }, delay)

    return () => {
      clearTimeout(autoOpenTimer)
    }
  }, [pathname])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

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
    hasAutoOpenedInCurrentTab = true
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          key="quick-booking-modal" 
          className="lux-modal-root" 
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
          style={{ 
            zIndex: 999999,
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
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="lux-modal-content qb-beige-modal-card"
            style={{ 
              maxWidth: '440px', 
              width: '100%',
              margin: 'auto',
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              background: '#D8C4B7',
              border: '1.5px solid rgba(126, 48, 68, 0.25)',
              borderRadius: '24px',
              padding: '22px 20px 20px',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            {/* Ambient subtle glow in top center */}
            <div 
              style={{
                position: 'absolute',
                top: '-35px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '300px',
                height: '130px',
                background: 'radial-gradient(ellipse at center, rgba(126, 48, 68, 0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
              }} 
            />

            {/* Top Bar: Diwali Offer Badge on Left & Close Button on Right */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                background: 'linear-gradient(135deg, rgba(126, 48, 68, 0.12) 0%, rgba(217, 119, 6, 0.16) 100%)',
                border: '1px solid rgba(126, 48, 68, 0.28)',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#7E3044',
                letterSpacing: '0.03em',
                boxShadow: '0 2px 8px rgba(126, 48, 68, 0.08)'
              }}>
                <span style={{ fontSize: '13px', filter: 'drop-shadow(0 1px 2px rgba(217, 119, 6, 0.35))' }}>🪔</span>
                <span>DIWALI OFFER: 55%–65% OFF</span>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(126, 48, 68, 0.1)',
                  border: '1px solid rgba(126, 48, 68, 0.22)',
                  color: '#7E3044',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(126, 48, 68, 0.2)'
                  e.currentTarget.style.color = '#7E3044'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(126, 48, 68, 0.1)'
                  e.currentTarget.style.color = '#7E3044'
                }}
              >
                ✕
              </button>
            </div>

            <InnerQuickBookingForm onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function InnerQuickBookingForm({ onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', eventDetails: '' })
  const [errors, setErrors] = useState({})
  const [refCode, setRefCode] = useState('')
  const [geoData, setGeoData] = useState({ latitude: null, longitude: null, detectedLocation: '' })
  const [activeFocus, setActiveFocus] = useState(null)

  useEffect(() => {
    getSilentLocationIfGranted().then(geo => {
      if (geo && geo.success) {
        setGeoData({ latitude: geo.latitude, longitude: geo.longitude, detectedLocation: geo.detectedLocation })
      }
    })
  }, [])

  const rawDigits = (formData.phone || '').replace(/[^0-9]/g, '')
  const isPhoneValid = rawDigits.length >= 10

  const validate = () => {
    const newErrors = {}
    const nameErr = validateName(formData.name)
    if (nameErr) {
      newErrors.name = nameErr
      const el = document.getElementById('qb-name')
      if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }

    const phoneErr = validatePhone(formData.phone)
    if (phoneErr && !newErrors.name) {
      newErrors.phone = phoneErr
      const el = document.getElementById('qb-phone')
      if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    } else if (phoneErr) {
      newErrors.phone = phoneErr
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Primary Slot Booking Handler
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      let deviceType = 'M'
      if (typeof window !== 'undefined') {
        if (window.innerWidth > 1024) deviceType = 'D'
        else if (window.innerWidth > 768) deviceType = 'T'
      }

      const randomSixDigit = Math.floor(100000 + Math.random() * 900000)
      const generatedRef = `MGN-${randomSixDigit}`
      const eventInfo = (formData.eventDetails || '').trim()

      await bookingService.submitInstantRequest({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        message: eventInfo,
        tokenNote: eventInfo ? `Event: ${eventInfo}` : 'Claimed Flat 55%–65% Diwali Special Discount',
        eventType: eventInfo || 'Diwali Live Artist Slot Booking (55%–65% OFF)',
        type: 'quick_booking',
        formName: 'Quick Booking Modal',
        deviceType: deviceType,
        formLink: typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#quick-booking` : '',
        referenceCode: generatedRef,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        detectedLocation: geoData.detectedLocation
      })

      if (typeof window !== 'undefined') {
        try {
          hasAutoOpenedInCurrentTab = true
          sessionStorage.setItem('mgn_last_booking_ref', generatedRef)
        } catch (e) {}
      }

      setRefCode(generatedRef)
      setIsSuccess(true)
    } catch (err) {
      console.error('Quick booking submission error:', err)
      setErrors({ phone: 'Could not submit booking. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Copy booking ID helper
  const [copied, setCopied] = useState(false)
  const handleCopyId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && refCode) {
      navigator.clipboard.writeText(refCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // High-Contrast, Luxury Thank You Screen matching the Card Palette with Authentic Booking Pass
  if (isSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '6px 2px 2px' }}>
        {/* Celebration Checkmark */}
        <div style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '50%', 
          background: 'rgba(126, 48, 68, 0.12)', 
          border: '2px solid #7E3044',
          boxShadow: '0 8px 24px rgba(126, 48, 68, 0.18)',
          color: '#7E3044', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 14px', 
          fontSize: '26px',
          fontWeight: '900' 
        }}>
          ✓
        </div>

        <h4 style={{ 
          margin: '0 0 6px', 
          color: '#7E3044', 
          fontSize: '21px', 
          fontWeight: 900, 
          letterSpacing: '-0.02em',
          lineHeight: 1.25,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
          Slot Reserved Successfully!
        </h4>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(126, 48, 68, 0.08)',
          border: '1px solid rgba(126, 48, 68, 0.22)',
          borderRadius: '100px',
          padding: '4px 14px',
          color: '#7E3044',
          fontSize: '11.5px',
          fontWeight: '800',
          marginBottom: '12px'
        }}>
          <span>🪔</span>
          <span>Diwali Offer Flat 55%–65% OFF Locked</span>
        </div>

        <p style={{ 
          margin: '0 0 16px', 
          color: '#1C1A1E', 
          fontSize: '13px', 
          lineHeight: '1.5',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
          Thank you, <strong style={{ color: '#7E3044' }}>{formData.name}</strong>! Your inquiry &amp; special discount have been secured. Our senior event coordinator will call you at <strong style={{ color: '#7E3044' }}>+91 {formData.phone}</strong> shortly with verified quotes for your event.
        </p>

        {/* AUTHENTIC ORIGINAL-LOOKING BOOKING PASS CARD */}
        {refCode && (
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid rgba(126, 48, 68, 0.2)',
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(126, 48, 68, 0.08)',
            textAlign: 'left',
            position: 'relative'
          }}>
            {/* Pass Top Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: 'rgba(126, 48, 68, 0.75)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                🛡️ Verified Booking Pass
              </span>
              <span style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#16a34a',
                background: 'rgba(22, 163, 74, 0.1)',
                border: '1px solid rgba(22, 163, 74, 0.25)',
                padding: '2px 8px',
                borderRadius: '100px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ fontSize: '8px' }}>●</span> Confirmed
              </span>
            </div>

            {/* Dotted Perforated Divider */}
            <div style={{
              borderTop: '1px dashed rgba(126, 48, 68, 0.2)',
              margin: '0 -16px 12px',
              position: 'relative'
            }} />

            {/* Booking ID & Copy Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(126, 48, 68, 0.05)',
              border: '1px solid rgba(126, 48, 68, 0.15)',
              borderRadius: '10px',
              padding: '8px 12px'
            }}>
              <div>
                <div style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  color: 'rgba(126, 48, 68, 0.65)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '2px'
                }}>
                  Booking ID
                </div>
                <div style={{
                  fontFamily: "'SF Mono', Monaco, Consolas, 'Liberation Mono', monospace",
                  fontSize: '17px',
                  fontWeight: 900,
                  color: '#7E3044',
                  letterSpacing: '0.06em'
                }}>
                  {refCode}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyId}
                style={{
                  background: copied ? '#16a34a' : '#7E3044',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {copied ? '✓ Copied' : '📋 Copy ID'}
              </button>
            </div>

            {/* Bottom Benefit Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '10px',
              fontSize: '11px',
              color: 'rgba(126, 48, 68, 0.8)',
              fontWeight: 600
            }}>
              <span>🏷️ 55%–65% Discount Applied</span>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ Verified</span>
            </div>
          </div>
        )}

        {/* WhatsApp Direct Connect & Done Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href={`https://wa.me/918076515257?text=${encodeURIComponent(`Hi Magnevents, I just booked my artist slot with Booking ID: ${refCode}. Please connect me with the event coordinator and share artist quotes!`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '12px',
              background: '#25D366',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(37, 211, 102, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
          >
            <span>💬</span>
            <span>Connect on WhatsApp with ID</span>
          </a>

          <button 
            onClick={onClose}
            style={{ 
              width: '100%', 
              padding: '12px 18px', 
              borderRadius: '12px', 
              background: '#7E3044', 
              color: '#ffffff', 
              fontWeight: 800, 
              fontSize: '14px',
              border: 'none', 
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(126, 48, 68, 0.35)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#672535'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#7E3044'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Done &amp; Explore Artists
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Modal Heading Section */}
      <div style={{ textAlign: 'center', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        <h3 style={{ 
          fontSize: '22px', 
          fontWeight: 900, 
          color: '#7E3044', 
          margin: '0 0 5px', 
          lineHeight: 1.25,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          letterSpacing: '-0.02em'
        }}>
          Book Verified{' '}
          <span style={{ 
            color: '#7E3044',
            display: 'inline-block',
            fontWeight: 900
          }}>
            Live Artists
          </span>
        </h3>
        <p style={{ 
          fontSize: '12.5px', 
          color: 'rgba(126, 48, 68, 0.85)', 
          margin: 0, 
          lineHeight: 1.45,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
          Connect with 1500+ verified performers across India.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* 1. Full Name */}
        <div>
          <label 
            htmlFor="qb-name" 
            style={{ 
              fontSize: '11px', 
              fontWeight: 800, 
              color: '#7E3044', 
              marginBottom: '5px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
          >
            <span>Full Name</span>
            <span style={{ color: '#7E3044' }}>*</span>
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#FFFFFF',
            border: errors.name
              ? '1.5px solid #7E3044'
              : (activeFocus === 'name' ? '1.5px solid #7E3044' : '1px solid rgba(126, 48, 68, 0.25)'),
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: errors.name
              ? '0 0 0 3px rgba(126, 48, 68, 0.2)'
              : (activeFocus === 'name' ? '0 0 0 3px rgba(126, 48, 68, 0.15)' : 'none'),
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '42px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: errors.name ? '#7E3044' : (activeFocus === 'name' ? '#7E3044' : 'rgba(126, 48, 68, 0.65)'),
              borderRight: '1px solid rgba(126, 48, 68, 0.18)',
              background: 'rgba(126, 48, 68, 0.05)',
              flexShrink: 0
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <input 
              id="qb-name" 
              type="text" 
              required 
              placeholder="e.g. Arjun Sharma" 
              value={formData.name} 
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (errors.name) setErrors({ ...errors, name: null })
              }} 
              onFocus={() => setActiveFocus('name')}
              onBlur={() => setActiveFocus(null)}
              style={{
                flex: 1,
                width: '100%',
                height: '46px',
                padding: '0 14px',
                background: 'transparent',
                border: 'none',
                color: '#7E3044',
                fontSize: '14.5px',
                fontWeight: 600,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {errors.name && (
            <span style={{ color: '#7E3044', fontSize: '11px', marginTop: '3px', display: 'block', fontWeight: 700 }}>
              {errors.name}
            </span>
          )}
        </div>
        
        {/* 2. Phone Number */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <label 
              htmlFor="qb-phone" 
              style={{ 
                fontSize: '11px', 
                fontWeight: 800, 
                color: '#7E3044', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}
            >
              <span>Phone Number</span>
              <span style={{ color: '#7E3044' }}>*</span>
            </label>
            {rawDigits.length > 0 && (
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 800, 
                color: isPhoneValid ? '#7E3044' : '#b45309' 
              }}>
                {isPhoneValid ? '✓ 10 Digits' : `${rawDigits.length}/10 digits`}
              </span>
            )}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#FFFFFF',
            border: errors.phone
              ? '1.5px solid #7E3044'
              : (activeFocus === 'phone' ? '1.5px solid #7E3044' : '1px solid rgba(126, 48, 68, 0.25)'),
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: errors.phone
              ? '0 0 0 3px rgba(126, 48, 68, 0.2)'
              : (activeFocus === 'phone' ? '0 0 0 3px rgba(126, 48, 68, 0.15)' : 'none'),
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 12px',
              background: 'rgba(126, 48, 68, 0.08)',
              borderRight: '1px solid rgba(126, 48, 68, 0.18)',
              height: '46px',
              color: '#7E3044',
              fontWeight: 800,
              fontSize: '13.5px',
              userSelect: 'none',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '15px' }}>🇮🇳</span>
              <span>+91</span>
            </div>
            <input 
              id="qb-phone" 
              type="tel" 
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              required 
              placeholder="9876543210" 
              value={formData.phone} 
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                setFormData({ ...formData, phone: digits })
                if (errors.phone) setErrors({ ...errors, phone: null })
              }} 
              onFocus={() => setActiveFocus('phone')}
              onBlur={() => setActiveFocus(null)}
              style={{
                flex: 1,
                width: '100%',
                height: '46px',
                padding: '0 14px',
                background: 'transparent',
                border: 'none',
                color: '#7E3044',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
                letterSpacing: '0.04em'
              }}
            />
          </div>
          {errors.phone && (
            <span style={{ color: '#7E3044', fontSize: '11px', marginTop: '3px', display: 'block', fontWeight: 700 }}>
              {errors.phone}
            </span>
          )}
        </div>

        {/* 3. Event Details */}
        <div>
          <label 
            htmlFor="qb-event-details" 
            style={{ 
              fontSize: '11px', 
              fontWeight: 800, 
              color: '#7E3044', 
              marginBottom: '5px', 
              display: 'block',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
          >
            Event Details
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#FFFFFF',
            border: activeFocus === 'eventDetails' ? '1.5px solid #7E3044' : '1px solid rgba(126, 48, 68, 0.25)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: activeFocus === 'eventDetails' ? '0 0 0 3px rgba(126, 48, 68, 0.15)' : 'none',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '42px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: activeFocus === 'eventDetails' ? '#7E3044' : 'rgba(126, 48, 68, 0.65)',
              borderRight: '1px solid rgba(126, 48, 68, 0.18)',
              background: 'rgba(126, 48, 68, 0.05)',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '15px' }}>📅</span>
            </div>
            <input 
              id="qb-event-details" 
              type="text" 
              placeholder="e.g. House party on 25th Nov in Delhi" 
              value={formData.eventDetails || ''} 
              onChange={(e) => setFormData({ ...formData, eventDetails: e.target.value })} 
              onFocus={() => setActiveFocus('eventDetails')}
              onBlur={() => setActiveFocus(null)}
              style={{
                flex: 1,
                width: '100%',
                height: '46px',
                padding: '0 14px',
                background: 'transparent',
                border: 'none',
                color: '#7E3044',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Single Primary Action Button */}
        <div style={{ marginTop: '4px' }}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              background: '#7E3044', 
              color: '#ffffff', 
              fontWeight: 800, 
              fontSize: '15px',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              padding: '14px 20px', 
              borderRadius: '12px', 
              border: 'none', 
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 22px rgba(126, 48, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              letterSpacing: '-0.01em',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: isSubmitting ? 0.75 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.background = '#672535'
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(126, 48, 68, 0.55)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.background = '#7E3044'
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(126, 48, 68, 0.4)'
            }}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="ai-spinner-dot" /> Reserving Slot &amp; Applying Discount...
              </span>
            ) : (
              <span>Book Slot &amp; Get 55%–65% OFF ➔</span>
            )}
          </button>
        </div>
      </form>
    </>
  )
}
