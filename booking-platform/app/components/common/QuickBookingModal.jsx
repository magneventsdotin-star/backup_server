"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { validateName, validatePhone } from '@helpers/validation'
import '@/app/styles/components/ContactModal.css'

export default function QuickBookingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', location: '' })
  const [errors, setErrors] = useState({})
  
  const pathname = usePathname()
  const modalRef = useRef(null)

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      setIsSuccess(false)
      setFormData({ name: '', phone: '', location: '' })
      setErrors({})
    }
    window.addEventListener('open-quick-booking', handleOpen)
    return () => window.removeEventListener('open-quick-booking', handleOpen)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.classList.add('modal-open')
    else document.body.classList.remove('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [isOpen])

  const validate = () => {
    const newErrors = {}
    if (!validateName(formData.name)) newErrors.name = 'Please enter a valid name'
    if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid 10-digit number'
    if (!formData.location.trim()) newErrors.location = 'Please provide an event location'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="cm-overlay" onClick={() => setIsOpen(false)}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="cm-backdrop"
          />

          <div className="cm-container">
            <motion.div
              ref={modalRef}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="cm-content-wrap"
              style={{ padding: 0, maxWidth: '440px', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setIsOpen(false)} className="cm-close-btn" aria-label="Close modal">
                ×
              </button>

              <div style={{ padding: '32px 24px', background: 'var(--brand-dark)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--brand-primary)' }} />
                
                <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#fff' }}>
                  Get a Quick Quote
                </h3>
                <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                  Provide brief details and our booking expert will contact you within minutes.
                </p>

                {isSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    style={{ textAlign: 'center', padding: '32px 0' }}
                  >
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 224, 50, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '32px' }}>
                      ✓
                    </div>
                    <h4 style={{ margin: '0 0 8px', color: '#fff', fontSize: '20px' }}>Request Received!</h4>
                    <p style={{ margin: '0', color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>We will contact you shortly with the best options.</p>
                    <button 
                      onClick={() => setIsOpen(false)}
                      style={{ marginTop: '24px', width: '100%', padding: '14px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div className="cm-field">
                      <label className="cm-label">Full Name</label>
                      <input 
                        type="text" 
                        className={`cm-input ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => {
                          setFormData({...formData, name: e.target.value});
                          if (errors.name) setErrors({...errors, name: null});
                        }}
                      />
                      {errors.name && <span className="cm-error">{errors.name}</span>}
                    </div>

                    <div className="cm-field">
                      <label className="cm-label">Mobile Number</label>
                      <input 
                        type="tel" 
                        className={`cm-input ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={e => {
                          setFormData({...formData, phone: e.target.value});
                          if (errors.phone) setErrors({...errors, phone: null});
                        }}
                      />
                      {errors.phone && <span className="cm-error">{errors.phone}</span>}
                    </div>

                    <div className="cm-field">
                      <label className="cm-label">Event Location</label>
                      <input 
                        type="text" 
                        className={`cm-input ${errors.location ? 'is-invalid' : ''}`}
                        placeholder="e.g. Delhi NCR, Mumbai..."
                        value={formData.location}
                        onChange={e => {
                          setFormData({...formData, location: e.target.value});
                          if (errors.location) setErrors({...errors, location: null});
                        }}
                      />
                      {errors.location && <span className="cm-error">{errors.location}</span>}
                    </div>

                    <button 
                      type="submit" 
                      className="cm-submit-btn" 
                      disabled={isSubmitting}
                      style={{ marginTop: '8px' }}
                    >
                      {isSubmitting ? <span className="cm-spinner" /> : 'Get Free Quote'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
