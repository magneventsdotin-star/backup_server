"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { bookingService } from '@/app/services/bookingService'
import '@/app/styles/components/ContactModal.css'

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [discountValue, setDiscountValue] = useState(null)

  useEffect(() => {
    fetch('/api/settings/top-ad')
      .then(r => r.json())
      .then(data => {
        if (data && data.textDesktop) {
          const match = data.textDesktop.match(/(\d+)%/);
          if (match) setDiscountValue(match[1]);
        }
      })
      .catch(err => console.error('Failed to fetch discount', err));
  }, []);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem('magnevents_lead_captured')
    
    if (!hasSeenModal) {
      sessionStorage.setItem('magnevents_lead_captured', 'true')
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 3200)
      return () => clearTimeout(timer)
    }
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
          >
            <div className="modal-glow-bg" />

            <button className="lux-modal-close" onClick={onClose} aria-label="Close modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div className="lux-modal-header lead-header">
              <div className="header-badge" style={{ margin: 0, display: 'inline-block' }}>
                QUICK INQUIRY
              </div>
              <h3 className="lead-title">
                Find Your Perfect Artist
              </h3>
              <p className="lead-subtitle">
                Let us know what you're looking for. First-time users get an <strong className="lead-discount">exclusive {discountValue ? `upto ${discountValue}% ` : ''}discount</strong> on their first booking!
              </p>
            </div>

            <InnerLeadForm onClose={onClose} discountValue={discountValue} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target end of day (midnight)
    const getNextMidnight = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      return midnight.getTime();
    };

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = getNextMidnight() - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (num) => num.toString().padStart(2, '0');

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginRight: '4px', fontWeight: '800', letterSpacing: '0.5px' }}>Ends In:</span>
      <span className="elegant-time-block">{pad(timeLeft.hours)}</span><span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '800' }}>:</span>
      <span className="elegant-time-block">{pad(timeLeft.minutes)}</span><span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '800' }}>:</span>
      <span className="elegant-time-block">{pad(timeLeft.seconds)}</span>
    </div>
  );
}

function InnerLeadForm({ onClose, discountValue }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState({ name: '', phone: '', requirement: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    
    if (!formData.name) {
      setFormError('Please enter your name.')
      return
    }
    if (!formData.phone) {
      setFormError('Please enter your phone number.')
      return
    }

    setIsSubmitting(true)

    let deviceType = 'D';
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 768) deviceType = 'M';
      else if (window.innerWidth <= 1024) deviceType = 'T';
    }
    
    bookingService.submitRequest({ 
      name: formData.name,
      phone: formData.phone,
      message: formData.requirement,
      deviceType: deviceType,
      formNumber: 'Form 4',
      formType: formData.claimOffer !== false ? 'offer' : 'lead_capture' 
    }).then(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('magnevents-form-filled', 'true');
        window.dispatchEvent(new Event('form-filled'));
      }
      setSubmitted(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    }).catch(error => {
      console.error("Booking error:", error)
    }).finally(() => {
      setIsSubmitting(false)
    })
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="lux-modal-success" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div className="lux-success-ring" style={{ margin: '0 auto 20px' }}><div className="lux-success-check">✓</div></div>
        <h4>Received!</h4>
        <p>We'll be in touch with you shortly.</p>
      </motion.div>
    )
  }

  return (
    <form className="lux-modal-form" onSubmit={handleSubmit}>
      <style jsx>{`
        @keyframes festiveGlow {
          0% { box-shadow: 0 0 0 0 rgba(255, 213, 74, 0.4); }
          50% { box-shadow: 0 0 20px rgba(255, 213, 74, 0.25); }
          100% { box-shadow: 0 0 0 0 rgba(255, 213, 74, 0.4); }
        }
        .elegant-promo-box {
          background: linear-gradient(145deg, rgba(255, 213, 74, 0.1) 0%, rgba(255, 153, 0, 0.05) 100%);
          border: 1px solid rgba(255, 213, 74, 0.4);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          animation: festiveGlow 2s infinite;
          position: relative;
          overflow: hidden;
        }
        
        .elegant-promo-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #FFD54A, transparent);
        }

        .elegant-time-block {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 213, 74, 0.4);
          color: #FFD54A;
          padding: 6px 8px;
          border-radius: 6px;
          font-family: monospace;
          font-weight: 800;
          font-size: 15px;
          min-width: 28px;
          text-align: center;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }
        
        .rakhi-highlight {
          color: #FFD54A;
          font-weight: 900;
          font-size: 15px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          text-shadow: 0 2px 10px rgba(255, 213, 74, 0.5);
          background: linear-gradient(90deg, #FFD54A, #FF9900);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
      
      <div className="lux-form-group full-width elegant-promo-box" style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1, flex: '1 1 min-content' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #FFD54A 0%, #FF9900 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 15px rgba(255, 213, 74, 0.5)' }}>
            <span style={{ fontSize: '24px' }}>🎁</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="rakhi-highlight">
              🎉 RAKSHA BANDHAN OFFER!
            </span>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: '700', letterSpacing: '0.3px' }}>
              {discountValue ? `Get UPTO ${discountValue}% OFF` : 'Get an Exclusive Discount'} on your booking.
            </span>
          </div>
        </div>
        
        <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1 1 auto' }}>
          <CountdownTimer />
        </div>
      </div>

      <div className="lux-form-group full-width">
        <label htmlFor="lead-name">Name</label>
        <input id="lead-name" type="text" required placeholder="e.g. Arjun Sharma" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      </div>
      
      <div className="lux-form-group full-width">
        <label htmlFor="lead-phone">Phone no.</label>
        <input id="lead-phone" type="tel" required placeholder="+91 9XXX-XXXXXX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/[^0-9+]/g, '')})} />
      </div>

      <div className="lux-form-group full-width">
        <label htmlFor="lead-req">What are you looking for?</label>
        <textarea 
          id="lead-req" 
          rows="2"
          placeholder="E.g. A sufi band for a wedding in Delhi on 15th Nov..." 
          value={formData.requirement} 
          onChange={(e) => setFormData({...formData, requirement: e.target.value})} 
          style={{ resize: 'none', width: '100%', fontFamily: 'inherit' }}
        />
      </div>



      {formError && (
        <div style={{ color: '#D65050', fontSize: '13px', marginTop: '16px', padding: '10px 14px', background: 'rgba(214, 80, 80, 0.1)', borderRadius: '8px', border: '1px solid rgba(214, 80, 80, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {formError}
        </div>
      )}

      <div className="lux-modal-footer" style={{ marginTop: '24px' }}>
        <button type="submit" className="btn-submit-premium" disabled={isSubmitting} style={{ width: '100%' }}>
          <span className="btn-text">{isSubmitting ? 'Sending...' : 'Submit Inquiry'}</span>
          <div className="btn-glow" />
        </button>
      </div>
    </form>
  )
}
