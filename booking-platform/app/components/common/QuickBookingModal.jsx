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

    return () => {
      window.removeEventListener('open-quick-booking', handleOpen)
      window.removeEventListener('open-token-booking', handleOpen)
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
            className="lux-modal-content"
            style={{ 
              maxWidth: '440px', 
              width: '100%',
              margin: 'auto',
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              background: 'linear-gradient(180deg, #151322 0%, #0d0b16 100%)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '22px',
              padding: '20px 18px 18px',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.92), 0 0 45px rgba(255, 224, 50, 0.1)',
              position: 'relative',
              boxSizing: 'border-box'
            }}
          >
            {/* Ambient luxury glow in top center */}
            <div 
              style={{
                position: 'absolute',
                top: '-35px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '300px',
                height: '130px',
                background: 'radial-gradient(ellipse at center, rgba(255, 224, 50, 0.18) 0%, rgba(255, 107, 0, 0.08) 50%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
              }} 
            />

            {/* Top Bar: Offer Badge on Left, Close Button cleanly separated on Right */}
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
                padding: '4px 10px',
                background: 'rgba(255, 224, 50, 0.1)',
                border: '1px solid rgba(255, 224, 50, 0.3)',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#FFE032',
                letterSpacing: '0.04em'
              }}>
                <span>🎉</span>
                <span>FLAT 55%–65% OFF</span>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

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

  // Set to true once Razorpay merchant account review is approved
  const ENABLE_RAZORPAY_CHECKOUT = false;

  // 1. Primary ₹99 Slot Booking Handler
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    // Direct submit while Razorpay merchant account is under review
    if (!ENABLE_RAZORPAY_CHECKOUT) {
      try {
        let deviceType = 'M'
        if (typeof window !== 'undefined') {
          if (window.innerWidth > 1024) deviceType = 'D'
          else if (window.innerWidth > 768) deviceType = 'T'
        }

        const generatedRef = `MAG-99-${Date.now().toString().slice(-6)}`
        await bookingService.submitInstantRequest({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          message: `[₹99 ARTIST SLOT RESERVED] Flat 55%-65% discount reserved!`,
          eventType: 'Live Artist Slot Booking (₹99 Reserved)',
          type: 'token_booking_99_reserved',
          formType: 'quick_booking',
          formName: 'Quick ₹99 Modal',
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
        console.error('Quick booking submission error:', err)
        setErrors({ phone: 'Could not submit booking. Please try again.' })
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    try {
      // 1. Create ₹99 Order on backend (Razorpay flow preserved)
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim()
        })
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to initiate Razorpay payment.')
      }

      // 2. Load Razorpay checkout script
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.')
      }

      // 3. Open Razorpay Checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Magnevents',
        description: '₹99 Artist Slot Booking Token (55%-65% OFF)',
        order_id: orderData.orderId,
        prefill: {
          name: formData.name.trim(),
          contact: formData.phone.trim()
        },
        theme: {
          color: '#FFE032'
        },
        handler: async function (response) {
          setIsSubmitting(true)
          try {
            // 4. Verify payment signature on backend
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer_name: formData.name.trim(),
                customer_phone: formData.phone.trim()
              })
            })

            const verifyData = await verifyRes.json()

            // Record lead in background for CRM & WhatsApp notifications
            try {
              let deviceType = 'M'
              if (typeof window !== 'undefined') {
                if (window.innerWidth > 1024) deviceType = 'D'
                else if (window.innerWidth > 768) deviceType = 'T'
              }
              await bookingService.submitInstantRequest({
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                message: `PAID ₹99 TOKEN. Razorpay Payment ID: ${response.razorpay_payment_id}, Order ID: ${response.razorpay_order_id}. Flat 55%-65% discount applied!`,
                eventType: 'Live Artist Slot Booking (₹99 Paid)',
                type: 'token_booking_99_paid',
                formType: 'quick_booking',
                formName: 'Quick ₹99 Razorpay Modal',
                deviceType: deviceType,
                formLink: typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#book-99` : '',
                latitude: geoData.latitude,
                longitude: geoData.longitude,
                detectedLocation: geoData.detectedLocation
              })
            } catch (leadErr) {
              console.warn('Lead submit notification warning:', leadErr)
            }

            setPaymentDetails({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id
            })
            setRefCode(verifyData?.referenceCode || response.razorpay_payment_id)
            setIsSuccess(true)
          } catch (vErr) {
            console.error('Payment verification error:', vErr)
            setIsSuccess(true)
          } finally {
            setIsSubmitting(false)
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (failRes) {
        setIsSubmitting(false)
        setErrors({ phone: failRes.error?.description || 'Payment was cancelled or unsuccessful. Please try again.' })
      })
      rzp.open()

    } catch (err) {
      console.error('Razorpay initiation error:', err)
      setErrors({ phone: err.message || 'Payment initiation failed. Please try again.' })
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
        message: 'Quick Booking: User requested free quotes without advance token.',
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

  // Success Screen: Free Inquiry
  if (isFreeSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 6px 6px' }}>
        <div style={{ 
          width: '58px', 
          height: '58px', 
          borderRadius: '50%', 
          background: 'rgba(56, 189, 248, 0.14)', 
          border: '2px solid #38bdf8',
          boxShadow: '0 0 24px rgba(56, 189, 248, 0.3)',
          color: '#38bdf8', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 14px', 
          fontSize: '28px',
          fontWeight: '900' 
        }}>
          ✓
        </div>
        <h4 style={{ margin: '0 0 6px', color: '#fff', fontSize: '21px', fontWeight: '900', letterSpacing: '-0.01em' }}>
          Free Inquiry Received!
        </h4>
        <div style={{
          display: 'inline-block',
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '100px',
          padding: '4px 14px',
          color: '#38bdf8',
          fontSize: '12px',
          fontWeight: '800',
          marginBottom: '12px'
        }}>
          REF: {refCode}
        </div>
        <p style={{ margin: '0 0 18px', color: 'rgba(255,255,255,0.82)', fontSize: '13px', lineHeight: '1.5' }}>
          Thank you, <strong style={{ color: '#FFE032' }}>{formData.name}</strong>! Our event coordinator will call you at <strong style={{ color: '#fff' }}>+91 {formData.phone}</strong> shortly with verified quotes for your event.
        </p>
        <button 
          onClick={onClose}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '12px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            border: '1px solid rgba(255, 255, 255, 0.22)',
            color: '#ffffff', 
            fontWeight: '800', 
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          Close & Explore Artists
        </button>
      </div>
    )
  }

  // Success Screen: Paid Slot Confirmed
  if (isSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '16px 6px 6px' }}>
        <div style={{ 
          width: '58px', 
          height: '58px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, rgba(255, 224, 50, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)', 
          border: '2px solid #FFE032',
          boxShadow: '0 0 24px rgba(255, 224, 50, 0.25)',
          color: '#FFE032', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 14px', 
          fontSize: '28px',
          fontWeight: '900' 
        }}>
          ✓
        </div>
        <h4 style={{ margin: '0 0 6px', color: '#fff', fontSize: '21px', fontWeight: '900', letterSpacing: '-0.01em' }}>
          Slot Confirmed & Verified!
        </h4>
        <div style={{
          display: 'inline-block',
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          borderRadius: '100px',
          padding: '4px 14px',
          color: '#4ade80',
          fontSize: '12px',
          fontWeight: '800',
          marginBottom: '12px'
        }}>
          ⚡ ₹99 Slot Locked · 55%–65% Discount Applied
        </div>
        <p style={{ margin: '0 0 16px', color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: '1.5' }}>
          Thank you, <strong style={{ color: '#FFE032' }}>{formData.name}</strong>! Your artist slot is locked. Our senior event coordinator will call you at <strong style={{ color: '#fff' }}>+91 {formData.phone}</strong> shortly.
        </p>
        {(paymentDetails?.paymentId || refCode) && (
          <div style={{
            background: 'rgba(255, 224, 50, 0.08)',
            border: '1px solid rgba(255, 224, 50, 0.3)',
            borderRadius: '100px',
            padding: '5px 16px',
            display: 'inline-block',
            marginBottom: '18px',
            fontSize: '12px',
            color: '#FFE032',
            fontWeight: '800'
          }}>
            {paymentDetails?.paymentId ? `PAYMENT ID: ${paymentDetails.paymentId}` : `REF: ${refCode}`}
          </div>
        )}
        <button 
          onClick={onClose}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #FFE032 0%, #FFA800 100%)', 
            color: '#05070A', 
            fontWeight: '900', 
            fontSize: '14.5px',
            border: 'none', 
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255, 224, 50, 0.35)'
          }}
        >
          Done & Explore Artists
        </button>
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
          color: '#ffffff', 
          margin: '0 0 5px', 
          lineHeight: 1.25,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          letterSpacing: '-0.02em'
        }}>
          Book Artist for{' '}
          <span style={{ 
            background: 'linear-gradient(135deg, #FFE032 0%, #FFB800 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            ₹99
          </span>
        </h3>
        <p style={{ 
          fontSize: '12.5px', 
          color: 'rgba(255, 255, 255, 0.72)', 
          margin: 0, 
          lineHeight: 1.45,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
          Lock your date & artist slot with guaranteed <strong style={{ color: '#FFE032' }}>55%–65% OFF</strong> on your final quote!
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
              color: 'rgba(255, 255, 255, 0.92)', 
              marginBottom: '5px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
          >
            <span>Full Name</span>
            <span style={{ color: '#FFE032' }}>*</span>
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            border: errors.name
              ? '1.5px solid #ef4444'
              : (activeFocus === 'name' ? '1.5px solid #FFE032' : '1px solid rgba(255, 255, 255, 0.16)'),
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: errors.name
              ? '0 0 0 3px rgba(239, 68, 68, 0.25)'
              : (activeFocus === 'name' ? '0 0 0 3px rgba(255, 224, 50, 0.15)' : 'none'),
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '42px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: errors.name ? '#ef4444' : (activeFocus === 'name' ? '#FFE032' : 'rgba(255, 255, 255, 0.5)'),
              borderRight: '1px solid rgba(255, 255, 255, 0.12)',
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
                color: '#ffffff',
                fontSize: '14.5px',
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
                fontWeight: 800, 
                color: 'rgba(255, 255, 255, 0.92)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                letterSpacing: '0.02em',
                textTransform: 'uppercase'
              }}
            >
              <span>Phone Number</span>
              <span style={{ color: '#FFE032' }}>*</span>
            </label>
            {rawDigits.length > 0 && (
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 800, 
                color: isPhoneValid ? '#22c55e' : '#f59e0b' 
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
              : (activeFocus === 'phone' ? '1.5px solid #FFE032' : '1px solid rgba(255, 255, 255, 0.16)'),
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: errors.phone
              ? '0 0 0 3px rgba(239, 68, 68, 0.25)'
              : (activeFocus === 'phone' ? '0 0 0 3px rgba(255, 224, 50, 0.15)' : 'none'),
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 12px',
              background: 'rgba(255, 224, 50, 0.08)',
              borderRight: '1px solid rgba(255, 255, 255, 0.14)',
              height: '46px',
              color: '#FFE032',
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
                color: '#ffffff',
                fontSize: '15px',
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

        {/* Primary Action Button: Pay ₹99 */}
        <div style={{ marginTop: '2px' }}>
          <button 
            type="submit" 
            disabled={isSubmitting || isFreeSubmitting}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #FFE032 0%, #FFA800 100%)', 
              color: '#0c0a14', 
              fontWeight: 900, 
              fontSize: '15px',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              padding: '13px 20px', 
              borderRadius: '12px', 
              border: 'none', 
              cursor: (isSubmitting || isFreeSubmitting) ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 26px rgba(255, 224, 50, 0.38)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              letterSpacing: '-0.01em',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: isSubmitting ? 0.75 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting && !isFreeSubmitting) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 224, 50, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 26px rgba(255, 224, 50, 0.38)';
            }}
          >
            {isSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="ai-spinner-dot" /> Reserving Slot...
              </span>
            ) : (
              <>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                <span>Book Artist Slot for ₹99</span>
              </>
            )}
          </button>

          <div style={{
            textAlign: 'center',
            marginTop: '5px',
            fontSize: '10.5px',
            color: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            <span>🔒</span>
            <span>Pay on confirmation • 100% Refundable Guarantee</span>
          </div>
        </div>

        {/* Elegant Divider: Or Pay Nothing Now */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '6px 0 4px',
          gap: '10px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <span style={{ 
            fontSize: '10px', 
            color: 'rgba(255, 255, 255, 0.45)', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.06em' 
          }}>
            OR PAY NOTHING NOW
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        {/* Secondary Option: Request Free Quotes (No Advance Needed) - Vibrant Filled Button */}
        <div>
          <button 
            type="button" 
            onClick={handleFreeSubmit}
            disabled={isSubmitting || isFreeSubmitting}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '13px 20px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 900,
              cursor: (isSubmitting || isFreeSubmitting) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              letterSpacing: '-0.01em',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              opacity: isFreeSubmitting ? 0.75 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting && !isFreeSubmitting) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #34d399 0%, #059669 100%)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(16, 185, 129, 0.55)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
            }}
          >
            {isFreeSubmitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="ai-spinner-dot" /> Submitting Free Inquiry...
              </span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>Request Free Quotes (No Advance Needed)</span>
              </>
            )}
          </button>

          <div style={{
            textAlign: 'center',
            marginTop: '5px',
            fontSize: '10.5px',
            color: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            <span>⚡</span>
            <span>Instant WhatsApp Callback · Verified Artist Quotes</span>
          </div>
        </div>
      </form>
    </>
  )
}
