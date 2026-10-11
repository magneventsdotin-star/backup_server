"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { validateName, validatePhone } from '@helpers/validation'
import { bookingService } from '@/app/services/bookingService'
import { getSilentLocationIfGranted } from '@/app/utils/geolocation'
import '@/app/styles/components/ContactModal.css'

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

    // Auto-open instant form after 6 seconds
    const autoOpenTimer = setTimeout(() => {
      setIsOpen((prev) => {
        if (!prev) return true
        return prev
      })
    }, 6000)

    return () => {
      clearTimeout(autoOpenTimer)
      window.removeEventListener('open-quick-booking', handleOpen)
      window.removeEventListener('open-token-booking', handleOpen)
      window.removeEventListener('open-instant-form', handleOpen)
      window.removeEventListener('open-instant-booking', handleOpen)
      window.removeEventListener('hashchange', checkHash)
    }
  }, [])

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

  const onClose = () => setIsOpen(false)

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
            className="lux-modal-content qb-minimal-modal-card"
            style={{ 
              maxWidth: '410px', 
              width: '100%',
              margin: 'auto',
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              background: '#1F1D22',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              padding: '22px 22px 20px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            {/* Top Bar: Minimal Close Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginBottom: '6px',
              position: 'relative',
              zIndex: 2
            }}>
              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
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
  const [isFreeSubmitting, setIsFreeSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFreeSuccess, setIsFreeSuccess] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [refCode, setRefCode] = useState('')
  const [paymentDetails, setPaymentDetails] = useState(null)
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

  // Primary Slot Booking Handler (Direct submission without payment gateway)
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

      const generatedRef = `MAG-QB-${Date.now().toString().slice(-6)}`

      await bookingService.submitInstantRequest({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        message: '',
        tokenNote: 'Claimed Flat 55%–65% First Booking Discount',
        eventType: 'Live Artist Slot Booking (55%–65% OFF)',
        type: 'quick_booking',
        formName: 'Quick Booking Modal',
        deviceType: deviceType,
        formLink: typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#quick-booking` : '',
        referenceCode: generatedRef,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        detectedLocation: geoData.detectedLocation
      })

      setRefCode(generatedRef)
      setIsSuccess(true)
    } catch (err) {
      console.error('Quick booking submission error:', err)
      setErrors({ phone: 'Could not submit booking. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 2. Secondary Zero-Advance Quote Request Handler
  const handleFreeSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!validate()) return

    setIsFreeSubmitting(true)
    try {
      let deviceType = 'M'
      if (typeof window !== 'undefined') {
        if (window.innerWidth > 1024) deviceType = 'D'
        else if (window.innerWidth > 768) deviceType = 'T'
      }

      const generatedRef = `MAG-FREE-${Date.now().toString().slice(-6)}`
      await bookingService.submitInstantRequest({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        message: '',
        tokenNote: 'Quick Booking: User requested free quotes without advance token.',
        eventType: 'Live Artist Booking (Free Inquiry)',
        type: 'free_quote_request',
        formType: 'quick_booking',
        formName: 'Quick Booking (Free Quote Option)',
        deviceType: deviceType,
        formLink: typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#free-quote` : '',
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        detectedLocation: geoData.detectedLocation
      })

      setRefCode(generatedRef)
      setIsFreeSuccess(true)
    } catch (err) {
      console.error('Free quote request error:', err)
      setErrors({ phone: 'Could not submit inquiry. Please try again.' })
    } finally {
      setIsFreeSubmitting(false)
    }
  }

  // Success Screen (Unified Minimalist)
  if (isSuccess || isFreeSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 8px 8px' }}>
        <div style={{ 
          width: '52px', 
          height: '52px', 
          borderRadius: '50%', 
          background: 'rgba(232, 185, 67, 0.12)', 
          border: '1.5px solid #E8B943',
          color: '#E8B943', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 16px', 
          fontSize: '24px',
          fontWeight: '900' 
        }}>
          ✓
        </div>
        <h4 style={{ margin: '0 0 8px', color: '#FFFFFF', fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em' }}>
          Slot Request Confirmed
        </h4>
        <p style={{ margin: '0 0 16px', color: 'rgba(255, 255, 255, 0.72)', fontSize: '13.5px', lineHeight: '1.5' }}>
          Thank you, <strong style={{ color: '#E8B943' }}>{formData.name}</strong>! Our event coordinator will call you at <strong style={{ color: '#FFFFFF' }}>+91 {formData.phone}</strong> shortly.
        </p>
        {refCode && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '100px',
            padding: '5px 16px',
            display: 'inline-block',
            marginBottom: '20px',
            fontSize: '11.5px',
            color: '#E8B943',
            fontWeight: '700',
            letterSpacing: '0.04em'
          }}>
            REF: {refCode}
          </div>
        )}
        <button 
          onClick={onClose}
          style={{ 
            width: '100%', 
            padding: '13px', 
            borderRadius: '12px', 
            background: '#E8B943', 
            color: '#1C1A1E', 
            fontWeight: '800', 
            fontSize: '14.5px',
            border: 'none', 
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
        >
          Done &amp; Explore Artists
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Modal Heading Section */}
      <div style={{ textAlign: 'center', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        <h3 style={{ 
          fontSize: '21px', 
          fontWeight: 800, 
          color: '#FFFFFF', 
          margin: '0 0 5px', 
          lineHeight: 1.25,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          letterSpacing: '-0.02em'
        }}>
          Book Verified Live Artists
        </h3>
        <p style={{ 
          fontSize: '12.5px', 
          color: 'rgba(255, 255, 255, 0.65)', 
          margin: 0, 
          lineHeight: 1.45,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
          Direct artist pricing with 0% agency fees across Delhi &amp; NCR.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* 1. Full Name */}
        <div>
          <label 
            htmlFor="qb-name" 
            style={{ 
              fontSize: '11px', 
              fontWeight: 750, 
              color: 'rgba(255, 255, 255, 0.8)', 
              marginBottom: '5px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            <span>Full Name</span>
            <span style={{ color: '#E8B943' }}>*</span>
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: errors.name
              ? '1.5px solid #ef4444'
              : (activeFocus === 'name' ? '1.5px solid #E8B943' : '1px solid rgba(255, 255, 255, 0.12)'),
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: errors.name
              ? '0 0 0 3px rgba(239, 68, 68, 0.2)'
              : (activeFocus === 'name' ? '0 0 0 3px rgba(232, 185, 67, 0.15)' : 'none'),
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '42px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: errors.name ? '#ef4444' : (activeFocus === 'name' ? '#E8B943' : 'rgba(255, 255, 255, 0.5)'),
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.02)',
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
                color: '#FFFFFF',
                fontSize: '14.5px',
                fontWeight: 500,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {errors.name && (
            <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '3px', display: 'block', fontWeight: 600 }}>
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
                fontWeight: 750, 
                color: 'rgba(255, 255, 255, 0.8)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              <span>Phone Number</span>
              <span style={{ color: '#E8B943' }}>*</span>
            </label>
            {rawDigits.length > 0 && (
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 700, 
                color: isPhoneValid ? '#4ade80' : '#E8B943' 
              }}>
                {isPhoneValid ? '✓ 10 Digits' : `${rawDigits.length}/10 digits`}
              </span>
            )}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: errors.phone
              ? '1.5px solid #ef4444'
              : (activeFocus === 'phone' ? '1.5px solid #E8B943' : '1px solid rgba(255, 255, 255, 0.12)'),
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: errors.phone
              ? '0 0 0 3px rgba(239, 68, 68, 0.2)'
              : (activeFocus === 'phone' ? '0 0 0 3px rgba(232, 185, 67, 0.15)' : 'none'),
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 12px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              height: '46px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 700,
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
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
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
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 500,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
                letterSpacing: '0.04em'
              }}
            />
          </div>
          {errors.phone && (
            <span style={{ color: '#ef4444', fontSize: '11px', marginTop: '3px', display: 'block', fontWeight: 600 }}>
              {errors.phone}
            </span>
          )}
        </div>

        {/* Single Primary Action Button */}
        <div style={{ marginTop: '6px' }}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              background: '#E8B943', 
              color: '#1C1A1E', 
              fontWeight: 800, 
              fontSize: '15px',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              padding: '14px 20px', 
              borderRadius: '12px', 
              border: 'none', 
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              letterSpacing: '-0.01em',
              transition: 'all 0.2s ease',
              opacity: isSubmitting ? 0.75 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.filter = 'brightness(1.08)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'none';
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
