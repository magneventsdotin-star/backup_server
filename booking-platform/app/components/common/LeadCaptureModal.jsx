"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { bookingService } from '@/app/services/bookingService'
import { getSilentLocationIfGranted } from '@/app/utils/geolocation'
import '@/app/styles/components/ContactModal.css'

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('open-lead-capture', handleOpenModal);

    if (typeof window !== 'undefined') {
      if (window.location.hash === '#offers' || window.location.hash === '#lead-capture' || window.location.search.includes('open=offers')) {
        setIsOpen(true);
      }
    }

    const hasSeenModal = sessionStorage.getItem('magnevents_lead_captured')
    
    if (!hasSeenModal) {
      sessionStorage.setItem('magnevents_lead_captured', 'true')
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 3200)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('open-lead-capture', handleOpenModal);
      }
    }

    return () => window.removeEventListener('open-lead-capture', handleOpenModal);
  }, [])

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="lead-modal" className="lux-modal-root" style={{ zIndex: 100000 }}>
          <motion.div
            className="lux-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="lux-modal-content booking"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            style={{
              maxWidth: '520px',
              padding: '24px 22px 20px',
              borderRadius: '20px',
              background: 'linear-gradient(180deg, #13111e 0%, #0d0b16 100%)',
              border: '1px solid rgba(255, 224, 50, 0.22)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), 0 0 40px rgba(255, 224, 50, 0.12)',
              position: 'relative'
            }}
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
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
                zIndex: 10
              }}
            >
              ✕
            </button>

            {/* Prominent Top Banner: 55% - 65% OFF First Booking */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.25) 0%, rgba(255, 224, 50, 0.28) 50%, rgba(255, 75, 43, 0.25) 100%)',
              border: '1px solid rgba(255, 224, 50, 0.45)',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              boxShadow: '0 4px 20px rgba(255, 107, 0, 0.15)',
              backdropFilter: 'blur(8px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🎉</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#FFE032', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                    Flat 55% – 65% OFF
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
                    On Your First Booking • Limited Period
                  </div>
                </div>
              </div>
              <div style={{
                background: '#FFE032',
                color: '#0a0a0c',
                fontWeight: 900,
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '100px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(255, 224, 50, 0.4)'
              }}>
                Save 65%
              </div>
            </div>

            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                background: 'rgba(255, 224, 50, 0.1)',
                border: '1px solid rgba(255, 224, 50, 0.25)',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#FFE032',
                marginBottom: '8px'
              }}>
                <span>⭐</span>
                <span>EXCLUSIVE ARTIST OFFER</span>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', margin: '0 0 6px', lineHeight: 1.25 }}>
                Book Artist for <span style={{ color: '#FFE032' }}>₹99</span>
              </h3>
              <p style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.72)', margin: 0, lineHeight: 1.45 }}>
                Pay ₹99 token to lock your date & artist slot with guaranteed <strong style={{ color: '#FFE032' }}>55%–65% OFF</strong> on your final quote!
              </p>
            </div>

            <InnerLeadForm onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function InnerLeadForm({ onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({ name: '', phone: '', requirement: '' })
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    
    const trimmedName = formData.name.trim()
    if (!trimmedName || trimmedName.length < 2) {
      setFormError('Please enter your full name.')
      return
    }

    const cleanPhone = (formData.phone || '').replace(/[^0-9]/g, '').slice(0, 10)
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Create Order on backend
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          phone: cleanPhone
        })
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to initiate Razorpay payment. Please try again.')
      }

      // 2. Load Razorpay script
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        throw new Error('Could not load payment gateway. Please check your internet connection.')
      }

      // 3. Open Razorpay Checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Magnevents',
        description: '₹99 Artist Slot Booking Token (55%-65% OFF Applied)',
        order_id: orderData.orderId,
        prefill: {
          name: trimmedName,
          contact: cleanPhone
        },
        theme: {
          color: '#FFE032'
        },
        handler: async function (response) {
          setIsSubmitting(true)
          try {
            // 4. Verify payment on backend
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer_name: trimmedName,
                customer_phone: cleanPhone
              })
            })

            const verifyData = await verifyRes.json()

            // 5. Submit lead with requirement note to CRM & WhatsApp in background
            try {
              let deviceType = 'M'
              if (typeof window !== 'undefined') {
                if (window.innerWidth > 1024) deviceType = 'D'
                else if (window.innerWidth > 768) deviceType = 'T'
              }
              await bookingService.submitInstantRequest({
                name: trimmedName,
                phone: cleanPhone,
                message: `[PAID ₹99 TOKEN] Req: ${formData.requirement || 'Not specified'}. Razorpay Payment ID: ${response.razorpay_payment_id}, Order ID: ${response.razorpay_order_id}. Flat 55%-65% discount applied!`,
                eventType: 'Live Artist Slot Booking (₹99 Paid)',
                type: 'token_booking_99_paid',
                formType: 'quick_booking',
                formName: 'Lead Capture ₹99 Modal',
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
        setFormError(failRes.error?.description || 'Payment was cancelled or failed.')
      })
      rzp.open()
    } catch (err) {
      console.error('Payment process error:', err)
      setFormError(err.message || 'Payment initiation failed. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="lux-modal-success"
        style={{ padding: '24px 10px', textAlign: 'center' }}
      >
        <div style={{
          width: '60px',
          height: '60px',
          margin: '0 auto 16px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)',
          border: '2px solid #22c55e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          color: '#22c55e'
        }}>
          ✓
        </div>
        <h4 style={{ color: '#ffffff', fontSize: '22px', fontWeight: 800, margin: '0 0 6px' }}>
          Slot Confirmed & Payment Verified!
        </h4>
        <p style={{ color: '#FFE032', fontSize: '13px', fontWeight: 700, margin: '0 0 14px' }}>
          🎉 Flat 55%–65% Discount Locked For Your Event
        </p>

        {refCode && (
          <div style={{
            display: 'inline-block',
            margin: '0 auto 14px',
            padding: '6px 16px',
            background: 'rgba(255, 224, 50, 0.12)',
            border: '1px solid rgba(255, 224, 50, 0.35)',
            borderRadius: '100px',
            fontSize: '12.5px',
            fontWeight: 800,
            color: '#FFE032',
            letterSpacing: '0.04em'
          }}>
            REF: {refCode}
          </div>
        )}

        {paymentDetails?.paymentId && (
          <p style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.6)', margin: '0 0 16px', fontFamily: 'monospace' }}>
            Payment ID: {paymentDetails.paymentId}
          </p>
        )}

        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', lineHeight: 1.5, maxWidth: '380px', margin: '0 auto 20px' }}>
          Our event coordinator is assigning the best verified live artists in your city. You will receive an official confirmation call & WhatsApp shortly.
        </p>

        <button
          onClick={onClose}
          style={{
            padding: '10px 24px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '100px',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Close & Explore Artists
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Full Name */}
      <div className="lux-form-group full-width" style={{ margin: 0 }}>
        <label htmlFor="lead-name" style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>Full Name</span>
          <span style={{ color: '#FFE032' }}>*</span>
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', opacity: 0.6, pointerEvents: 'none' }}>
            👤
          </span>
          <input 
            id="lead-name" 
            type="text" 
            required 
            placeholder="e.g. Arjun Sharma" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            style={{
              width: '100%',
              padding: '12px 14px 12px 40px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>
      
      {/* Phone Number */}
      <div className="lux-form-group full-width" style={{ margin: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <label htmlFor="lead-phone" style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Phone Number (For Booking Confirmation)</span>
            <span style={{ color: '#FFE032' }}>*</span>
          </label>
          {rawDigits.length > 0 && (
            <span style={{ fontSize: '11px', fontWeight: 700, color: isPhoneValid ? '#22c55e' : '#f59e0b' }}>
              {isPhoneValid ? '✓ 10 Digits' : `${rawDigits.length}/10 digits`}
            </span>
          )}
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{
            position: 'absolute',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '13px',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.7)',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            <span>🇮🇳</span>
            <span>+91</span>
          </div>
          <input 
            id="lead-phone" 
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
            }} 
            style={{
              width: '100%',
              padding: '12px 14px 12px 64px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Requirement / Note */}
      <div className="lux-form-group full-width" style={{ margin: 0 }}>
        <label htmlFor="lead-req" style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '5px', display: 'block' }}>
          <span>Event Details / Requirement (Optional)</span>
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '14px', fontSize: '14px', opacity: 0.6, pointerEvents: 'none' }}>
            🎤
          </span>
          <textarea 
            id="lead-req" 
            rows="2"
            placeholder="e.g. Singer/Band for wedding or house party on 20th Dec..." 
            value={formData.requirement} 
            onChange={(e) => setFormData({ ...formData, requirement: e.target.value })} 
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {formError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '8px',
          padding: '8px 12px',
          color: '#fca5a5',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>{formError}</span>
        </div>
      )}

      {/* Submit & Pay ₹99 Button */}
      <div style={{ marginTop: '4px' }}>
        <button 
          type="submit" 
          disabled={isSubmitting} 
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FFE032 0%, #FFA500 100%)',
            color: '#0a0a0c',
            fontWeight: 900,
            fontSize: '15px',
            padding: '14px 20px',
            borderRadius: '12px',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 24px rgba(255, 224, 50, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            opacity: isSubmitting ? 0.75 : 1
          }}
        >
          {isSubmitting ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="ai-spinner-dot" /> Processing Checkout...
            </span>
          ) : (
            <>
              <span>⚡</span>
              <span>Pay ₹99 & Lock Your Slot</span>
            </>
          )}
        </button>
      </div>

      {/* Trust Guarantee Badges */}
      <div style={{
        marginTop: '6px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>🛡️</span>
          <span>100% Artist Arrival</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>💎</span>
          <span>55%–65% Flat OFF</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>🔒</span>
          <span>Secure Razorpay</span>
        </div>
      </div>
    </form>
  )
}
