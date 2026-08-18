"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { bookingService } from '@/app/services/bookingService'
import '@/app/styles/components/ContactModal.css'

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false)

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
        <div key="lead-modal" className="lux-modal-root" style={{ zIndex: 9999 }}>
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

            <div className="lux-modal-header" style={{ position: 'relative', paddingTop: '32px' }}>
              <div className="header-badge" style={{ margin: 0, display: 'inline-block' }}>
                QUICK INQUIRY
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '32px', marginTop: '12px' }}>
                Find Your Perfect Artist
              </h3>
              <p>Let us know what you're looking for, and we'll help you secure the best talent for your event.</p>
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
      formType: 'lead_capture' 
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
      <div className="lux-form-group full-width">
        <label htmlFor="lead-name">Name</label>
        <input id="lead-name" type="text" required placeholder="e.g. Arjun Sharma" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      </div>
      
      <div className="lux-form-group full-width">
        <label htmlFor="lead-phone">Phone no.</label>
        <input id="lead-phone" type="tel" required placeholder="+91 9XXX-XXXXXX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/[^0-9+]/g, '')})} />
      </div>

      <div className="lux-form-group full-width" style={{ marginTop: '16px' }}>
        <label htmlFor="lead-req">What are you looking for?</label>
        <textarea 
          id="lead-req" 
          rows="3"
          placeholder="E.g. A sufi band for a wedding in Delhi on 15th Nov..." 
          value={formData.requirement} 
          onChange={(e) => setFormData({...formData, requirement: e.target.value})} 
          style={{ 
            width: '100%', 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            borderRadius: '12px', 
            padding: '14px 16px', 
            color: '#fff', 
            fontSize: '15px',
            resize: 'none',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s ease, background 0.2s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent)';
            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.background = 'rgba(255, 255, 255, 0.03)';
          }}
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
