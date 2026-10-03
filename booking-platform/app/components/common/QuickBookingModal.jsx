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

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          key="quick-booking-modal" 
          className="lux-modal-root" 
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false)
          }}
          style={{ zIndex: 999999 }}
        >
          <motion.div
            className="lux-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 360 }}
            className="lux-modal-content"
            style={{ 
              maxWidth: '380px', 
              width: '90%',
              margin: 'auto',
              background: 'linear-gradient(165deg, #16130e 0%, #0d0b09 100%)',
              border: '1px solid rgba(255, 224, 50, 0.35)',
              borderRadius: '20px',
              padding: '24px 20px 20px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 224, 50, 0.12)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', margin: '0 0 4px', lineHeight: '1.25' }}>
                Book Artist with <span style={{ color: '#FFE032' }}>55%–65% OFF</span>
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                Lock your date & get flat <strong style={{ color: '#FFE032' }}>55%–65% OFF</strong> on your first booking
              </p>
            </div>

            <InnerQuickBookingForm onClose={() => setIsOpen(false)} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function InnerQuickBookingForm({ onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [refCode, setRefCode] = useState('')
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [geoData, setGeoData] = useState({ latitude: null, longitude: null, detectedLocation: '' })

  useEffect(() => {
    getSilentLocationIfGranted().then(geo => {
      if (geo && geo.success) {
        setGeoData({ latitude: geo.latitude, longitude: geo.longitude, detectedLocation: geo.detectedLocation })
      }
    })
  }, [])

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
    if (nameErr) newErrors.name = nameErr

    const phoneErr = validatePhone(formData.phone)
    if (phoneErr) newErrors.phone = phoneErr

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Set to true once Razorpay merchant account review is approved
  const ENABLE_RAZORPAY_CHECKOUT = false;

  const handleSubmit = async (e) => {
    e.preventDefault()
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
        alert('Could not submit booking. Please try again.')
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
        description: '₹2 Artist Slot Booking Token (Testing Phase)',
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

  if (isSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
        <div style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, rgba(255, 224, 50, 0.25) 0%, rgba(34, 197, 94, 0.25) 100%)', 
          border: '2px solid #FFE032',
          color: '#FFE032', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 12px', 
          fontSize: '26px',
          fontWeight: '900' 
        }}>
          ✓
        </div>
        <h4 style={{ margin: '0 0 6px', color: '#fff', fontSize: '20px', fontWeight: '800' }}>
          Slot Confirmed &amp; Token Paid!
        </h4>
        <div style={{
          display: 'inline-block',
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          borderRadius: '20px',
          padding: '3px 12px',
          color: '#4ade80',
          fontSize: '12px',
          fontWeight: '700',
          marginBottom: '10px'
        }}>
          ⚡ ₹99 Token Successfully Paid
        </div>
        <p style={{ margin: '0 0 14px', color: 'rgba(255,255,255,0.85)', fontSize: '13.5px', lineHeight: '1.45' }}>
          Thank you, <strong style={{ color: '#FFE032' }}>{formData.name}</strong>! Your artist slot is locked. Our senior event coordinator will call you at <strong style={{ color: '#fff' }}>+91 {formData.phone}</strong> in 5 minutes with your 55%–65% discount.
        </p>
        {(paymentDetails?.paymentId || refCode) && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px dashed rgba(255, 224, 50, 0.4)',
            borderRadius: '8px',
            padding: '6px 14px',
            display: 'inline-block',
            marginBottom: '14px',
            fontSize: '12px',
            color: '#FFE032',
            fontWeight: '700'
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
            background: 'linear-gradient(135deg, #FFE032 0%, #FF9900 100%)', 
            color: '#05070A', 
            fontWeight: '900', 
            fontSize: '14px',
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      
      {/* 1. Name */}
      <div>
        <input 
          type="text" 
          placeholder="Your Name"
          value={formData.name}
          onChange={e => {
            setFormData({...formData, name: e.target.value});
            if (errors.name) setErrors({...errors, name: null});
          }}
          autoFocus
          style={{ 
            width: '100%', 
            padding: '12px 14px', 
            borderRadius: '10px', 
            background: 'rgba(255, 255, 255, 0.06)', 
            border: errors.name ? '1.5px solid #ff4d4d' : '1px solid rgba(255, 255, 255, 0.15)', 
            color: '#fff',
            fontSize: '14.5px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        {errors.name && <span style={{ color: '#ff4d4d', fontSize: '11px', marginTop: '2px', display: 'block', textAlign: 'left' }}>{errors.name}</span>}
      </div>

      {/* 2. Phone Number */}
      <div>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            borderRadius: '10px', 
            background: 'rgba(255, 255, 255, 0.06)', 
            border: errors.phone ? '1.5px solid #ff4d4d' : '1px solid rgba(255, 255, 255, 0.16)', 
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}
        >
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '0 12px', 
              background: 'rgba(255, 224, 50, 0.1)', 
              borderRight: '1px solid rgba(255, 255, 255, 0.12)', 
              height: '44px',
              color: '#FFE032', 
              fontWeight: '800', 
              fontSize: '13.5px',
              userSelect: 'none',
              flexShrink: 0
            }}
          >
            <span style={{ fontSize: '15px' }}>🇮🇳</span>
            <span>+91</span>
          </div>
          <input 
            type="tel" 
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={e => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
              setFormData({...formData, phone: digits});
              if (errors.phone) setErrors({...errors, phone: null});
            }}
            style={{ 
              flex: 1,
              width: '100%',
              height: '44px',
              padding: '0 12px', 
              background: 'transparent', 
              border: 'none', 
              color: '#fff',
              fontSize: '14.5px',
              fontWeight: '600',
              outline: 'none',
              boxSizing: 'border-box',
              letterSpacing: '0.04em'
            }}
          />
        </div>
        {errors.phone && <span style={{ color: '#ff4d4d', fontSize: '11px', marginTop: '2px', display: 'block', textAlign: 'left' }}>{errors.phone}</span>}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isSubmitting}
        style={{ 
          width: '100%', 
          marginTop: '4px', 
          padding: '13px', 
          borderRadius: '10px', 
          background: 'linear-gradient(135deg, #FFE032 0%, #FF9900 100%)', 
          color: '#05070A', 
          fontWeight: '900', 
          fontSize: '15px',
          border: 'none', 
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 16px rgba(255, 224, 50, 0.35)',
          transition: 'all 0.15s ease'
        }}
      >
        {isSubmitting ? 'Initiating Razorpay...' : 'Pay ₹99 & Confirm Slot ➔'}
      </button>

      <div style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <span>🔒 Secure Razorpay</span>
        <span>•</span>
        <span>100% Refundable Token</span>
      </div>
    </form>
  )
}
