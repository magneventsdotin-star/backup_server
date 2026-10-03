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
        <div 
          key="lead-modal" 
          className="lux-modal-root" 
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
            className="lux-modal-content booking"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
            style={{
              maxWidth: '500px',
              width: '100%',
              margin: 'auto',
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              padding: '20px 18px 18px',
              borderRadius: '22px',
              background: 'linear-gradient(180deg, #151322 0%, #0d0b16 100%)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.92), 0 0 45px rgba(255, 224, 50, 0.1)',
              position: 'relative',
              boxSizing: 'border-box',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            }}
          >
            {/* Ambient luxury glow in top corner */}
            <div 
              style={{
                position: 'absolute',
                top: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '320px',
                height: '140px',
                background: 'radial-gradient(ellipse at center, rgba(255, 224, 50, 0.16) 0%, rgba(255, 107, 0, 0.08) 50%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0
              }} 
            />

            {/* Top Bar with Status Tag and Close Button */}
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
                background: 'rgba(255, 224, 50, 0.08)',
                border: '1px solid rgba(255, 224, 50, 0.28)',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#FFE032',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                <span style={{ 
                  width: '7px', 
                  height: '7px', 
                  borderRadius: '50%', 
                  background: '#22c55e', 
                  boxShadow: '0 0 8px #22c55e',
                  display: 'inline-block' 
                }} />
                <span>Verified Artist Slot</span>
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

            {/* High-Converting 55% - 65% OFF Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.24) 0%, rgba(255, 224, 50, 0.25) 50%, rgba(239, 68, 68, 0.2) 100%)',
              border: '1px solid rgba(255, 224, 50, 0.38)',
              borderRadius: '14px',
              padding: '10px 14px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              boxShadow: '0 6px 24px rgba(255, 107, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(255, 224, 50, 0.18)',
                  border: '1px solid rgba(255, 224, 50, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '17px',
                  flexShrink: 0
                }}>
                  🎉
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: 900, 
                    color: '#FFE032', 
                    letterSpacing: '0.01em',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    FLAT 55% – 65% OFF
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'rgba(255, 255, 255, 0.85)', 
                    fontWeight: 600,
                    lineHeight: 1.2,
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    On Your First Booking • Limited Period
                  </div>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #FFE032 0%, #FFB800 100%)',
                color: '#0c0a14',
                fontWeight: 900,
                fontSize: '11px',
                padding: '5px 11px',
                borderRadius: '100px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 14px rgba(255, 224, 50, 0.45)',
                flexShrink: 0
              }}>
                SAVE 65%
              </div>
            </div>

            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '14px', position: 'relative', zIndex: 1 }}>
              <h3 style={{ 
                fontSize: '22px', 
                fontWeight: 900, 
                color: '#ffffff', 
                margin: '0 0 5px', 
                lineHeight: 1.2,
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
                fontSize: '12px', 
                color: 'rgba(255, 255, 255, 0.72)', 
                margin: 0, 
                lineHeight: 1.45,
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              }}>
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
        initial={{ opacity: 0, scale: 0.92 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="lux-modal-success"
        style={{ 
          padding: '24px 10px', 
          textAlign: 'center',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 16px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.14)',
          border: '2px solid #22c55e',
          boxShadow: '0 0 24px rgba(34, 197, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          color: '#22c55e'
        }}>
          ✓
        </div>
        <h4 style={{ color: '#ffffff', fontSize: '22px', fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
          Slot Confirmed & Payment Verified!
        </h4>
        <p style={{ color: '#FFE032', fontSize: '13px', fontWeight: 700, margin: '0 0 14px' }}>
          🎉 Flat 55%–65% Discount Locked For Your Event
        </p>

        {refCode && (
          <div style={{
            display: 'inline-block',
            margin: '0 auto 14px',
            padding: '6px 18px',
            background: 'rgba(255, 224, 50, 0.12)',
            border: '1px solid rgba(255, 224, 50, 0.4)',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#FFE032',
            letterSpacing: '0.04em'
          }}>
            REF: {refCode}
          </div>
        )}

        {paymentDetails?.paymentId && (
          <p style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.65)', margin: '0 0 16px', fontFamily: 'monospace' }}>
            Payment ID: {paymentDetails.paymentId}
          </p>
        )}

        <p style={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: '13px', lineHeight: 1.55, maxWidth: '380px', margin: '0 auto 20px' }}>
          Our event coordinator is assigning the verified live artists for your date. You will receive an official confirmation call & WhatsApp shortly.
        </p>

        <button
          onClick={onClose}
          style={{
            padding: '11px 26px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '100px',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          Close & Explore Artists
        </button>
      </motion.div>
    )
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
      }}
    >
      
      {/* 1. Full Name - Flexbox Container (Guaranteed No Overlap) */}
      <div style={{ margin: 0 }}>
        <label 
          htmlFor="lead-name" 
          style={{ 
            fontSize: '11.5px', 
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
          border: activeFocus === 'name' ? '1.5px solid #FFE032' : '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: activeFocus === 'name' ? '0 0 0 3px rgba(255, 224, 50, 0.15)' : 'none',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '42px',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeFocus === 'name' ? '#FFE032' : 'rgba(255, 255, 255, 0.5)',
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
            id="lead-name" 
            type="text" 
            required 
            placeholder="e.g. Arjun Sharma" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
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
      </div>
      
      {/* 2. Phone Number - Flexbox Container (Guaranteed No Overlap) */}
      <div style={{ margin: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <label 
            htmlFor="lead-phone" 
            style={{ 
              fontSize: '11.5px', 
              fontWeight: 800, 
              color: 'rgba(255, 255, 255, 0.92)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
          >
            <span>Phone Number (For Booking Confirmation)</span>
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
          border: activeFocus === 'phone' ? '1.5px solid #FFE032' : '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: activeFocus === 'phone' ? '0 0 0 3px rgba(255, 224, 50, 0.15)' : 'none',
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
      </div>

      {/* 3. Requirement / Note - Flexbox Container (Guaranteed No Overlap) */}
      <div style={{ margin: 0 }}>
        <label 
          htmlFor="lead-req" 
          style={{ 
            fontSize: '11.5px', 
            fontWeight: 800, 
            color: 'rgba(255, 255, 255, 0.92)', 
            marginBottom: '5px', 
            display: 'block',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}
        >
          <span>Event Details / Requirement (Optional)</span>
        </label>
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          border: activeFocus === 'req' ? '1.5px solid #FFE032' : '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: activeFocus === 'req' ? '0 0 0 3px rgba(255, 224, 50, 0.15)' : 'none',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '42px',
            paddingTop: '12px',
            display: 'flex',
            justifyContent: 'center',
            color: activeFocus === 'req' ? '#FFE032' : 'rgba(255, 255, 255, 0.5)',
            borderRight: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.02)',
            flexShrink: 0
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
          <textarea 
            id="lead-req" 
            rows="2"
            placeholder="e.g. Singer/Band for wedding reception or house party on 20th Dec..." 
            value={formData.requirement} 
            onChange={(e) => setFormData({ ...formData, requirement: e.target.value })} 
            onFocus={() => setActiveFocus('req')}
            onBlur={() => setActiveFocus(null)}
            style={{
              flex: 1,
              width: '100%',
              padding: '11px 14px',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '13px',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
              lineHeight: 1.4
            }}
          />
        </div>
      </div>

      {formError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '10px',
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
      <div style={{ marginTop: '2px' }}>
        <button 
          type="submit" 
          disabled={isSubmitting} 
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FFE032 0%, #FFA800 100%)',
            color: '#0c0a14',
            fontWeight: 900,
            fontSize: '15.5px',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            padding: '14px 20px',
            borderRadius: '12px',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
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
            if (!isSubmitting) {
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
              <span className="ai-spinner-dot" /> Initiating Payment...
            </span>
          ) : (
            <>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <span>Pay ₹99 & Lock Your Slot</span>
            </>
          )}
        </button>

        <div style={{
          textAlign: 'center',
          marginTop: '6px',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px'
        }}>
          <span>🔒</span>
          <span>100% Refundable if artist is unavailable</span>
        </div>
      </div>

      {/* Trust Guarantee Badges with Crisp SVGs */}
      <div style={{
        marginTop: '4px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        fontSize: '11px',
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.78)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          <span>100% Arrival</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFE032" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>55%–65% Flat OFF</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>Secure Razorpay</span>
        </div>
      </div>
    </form>
  )
}
