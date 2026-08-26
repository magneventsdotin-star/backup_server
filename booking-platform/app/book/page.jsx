"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { bookingService } from '@/app/services/bookingService';
import { validateName, validateEmail, validatePhone } from '@helpers/validation';
import '@/app/styles/components/ContactModal.css';
import '@/app/styles/pages/Register.css';

export default function BookPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [selectedArtistTypes, setSelectedArtistTypes] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    location: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const sanitizedValue = value.replace(/[^\d+]/g, '');
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const copyToClipboard = () => {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://www.magnevents.in/book';
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    const nameVal = formData.name || '';
    const phoneVal = formData.phone || '';
    const emailVal = formData.email || '';

    if (!phoneVal && !emailVal) {
      return setFormError('Please provide either a Phone number or an Email ID.');
    }
    if (nameVal) {
      const nameErr = validateName(nameVal);
      if (nameErr) return setFormError(nameErr);
    }
    if (phoneVal) {
      const phoneErr = validatePhone(phoneVal);
      if (phoneErr) return setFormError(phoneErr);
    }
    if (emailVal) {
      const emailErr = validateEmail(emailVal);
      if (emailErr) return setFormError(emailErr);
    }

    let deviceType = 'D';
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 768) deviceType = 'M';
      else if (window.innerWidth <= 1024) deviceType = 'T';
    }

    const submissionData = {
      ...formData,
      eventType: selectedEventType,
      artistType: selectedArtistTypes,
      budget: selectedBudget,
      deviceType
    };

    setIsSubmitting(true);

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', { event_category: 'form', event_label: 'book_page_submit' });
    }

    bookingService.submitRequest({ ...submissionData, formType: 'booking', formName: 'Single Page Booking Form' })
      .then(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('magnevents-form-filled', 'true');
          window.dispatchEvent(new Event('form-filled'));
        }
        setSubmitted(true);
        setTimeout(() => {
          router.push('/thank-you');
        }, 1500);
      })
      .catch(error => {
        console.error('Booking error:', error);
        setFormError('Failed to submit. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <main className="register-page" style={{ paddingTop: '100px', paddingBottom: '60px', minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, rgba(0, 212, 255, 0.12) 0%, #050505 70%)' }}>
      <div className="lux-container" style={{ maxWidth: '720px', margin: '0 auto', padding: '0 16px' }}>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="lux-modal-success" style={{ background: 'rgba(12, 14, 18, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '48px 24px', textAlign: 'center' }}>
            <div className="lux-success-ring" style={{ margin: '0 auto 20px' }}><div className="lux-success-check">✓</div></div>
            <h4 style={{ color: '#fff', fontSize: '28px', marginBottom: '12px' }}>Submission Received!</h4>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', maxWidth: '440px', margin: '0 auto 24px' }}>Your details have been securely sent. A booking concierge will reach out to you within 24 hours.</p>
          </motion.div>
        ) : (
          <div className="lux-modal-content booking is-page" style={{ position: 'relative', width: '100%', background: 'rgba(12, 14, 18, 0.95)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '36px 28px', boxShadow: '0 40px 100px rgba(0,0,0,0.9)' }}>
            <div className="modal-glow-bg" />

            <div className="lux-modal-header" style={{ position: 'relative', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div className="header-badge" style={{ margin: 0 }}>
                  DIRECT SUPPORT
                </div>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  Copy Link
                </button>
              </div>

              <h1 style={{ fontFamily: 'var(--font-display, serif)', color: '#fff', fontSize: 'clamp(28px, 5vw, 36px)', marginTop: '4px', marginBottom: '8px', fontWeight: '800' }}>
                Booking form
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '1.5', margin: 0 }}>
                Tell us your vision, and we will find the perfect stage presence for you.
              </p>
            </div>

            <form className="lux-modal-form" onSubmit={handleSubmit}>
              <div className="lux-form-row">
                <div className="lux-form-group">
                  <label htmlFor="sp-name">Name</label>
                  <input id="sp-name" name="name" type="text" required placeholder="e.g. Arjun Sharma" value={formData.name} onChange={handleChange} autoComplete="name" />
                </div>
                <div className="lux-form-group">
                  <label htmlFor="sp-phone">Phone no.</label>
                  <input id="sp-phone" name="phone" type="tel" required placeholder="+91 9XXX-XXXXXX" value={formData.phone} onChange={handleChange} autoComplete="tel" />
                </div>
              </div>

              <div className="lux-form-row">
                <div className="lux-form-group">
                  <label htmlFor="sp-email">Email ID</label>
                  <input id="sp-email" name="email" type="email" placeholder="name@email.com" value={formData.email} onChange={handleChange} autoComplete="email" />
                </div>
                <div className="lux-form-group">
                  <label htmlFor="sp-event-type">Event Type</label>
                  <select id="sp-event-type" required value={selectedEventType} onChange={(e) => setSelectedEventType(e.target.value)}>
                    <option value="" disabled>Select event type...</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Sangeet">Sangeet</option>
                    <option value="Corporate">Corporate Event</option>
                    <option value="College">College Fest</option>
                    <option value="Private">Private Party</option>
                    <option value="Concert">Concert / Festival</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="lux-form-row">
                <div className="lux-form-group">
                  <label htmlFor="sp-date">Event Date</label>
                  <input id="sp-date" name="date" type="date" required value={formData.date} min={new Date().toISOString().split('T')[0]} max="2030-12-31" onChange={handleChange} onClick={(e) => e.target.showPicker && e.target.showPicker()} />
                </div>
                <div className="lux-form-group">
                  <label htmlFor="sp-location">Location</label>
                  <input id="sp-location" name="location" type="text" required placeholder="Delhi, Mumbai, Lucknow..." value={formData.location} onChange={handleChange} />
                </div>
              </div>

              <div className="lux-form-row">
                <div className="lux-form-group full-width">
                  <label>Artist Type (Multiple allowed)</label>
                  <div className="artist-type-grid">
                    {['Singer', 'Music Band', 'DJ', 'Musician', 'Comedian', 'Anchor', 'Dancer', 'Magician'].map(type => (
                      <button key={type} type="button" className={`artist-chip ${selectedArtistTypes.includes(type) ? 'active' : ''}`} onClick={() => { setSelectedArtistTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]) }}>{type}</button>
                    ))}
                  </div>
                </div>
                <div className="lux-form-group full-width">
                  <label htmlFor="sp-budget">Budget range</label>
                  <select id="sp-budget" required value={selectedBudget} onChange={(e) => setSelectedBudget(e.target.value)}>
                    <option value="" disabled>Select Budget</option>
                    <option value="5k_10k">5000-10000</option>
                    <option value="10k_20k">10000-20000</option>
                    <option value="20k_35k">20000-35000</option>
                    <option value="35k_50k">35000-50000</option>
                    <option value="50k_80k">50000-80000</option>
                    <option value="80k_1.2L">80000-1.2L</option>
                    <option value="1.2L_1.5L">1.2L-1.5L</option>
                    <option value="1.5L_2L">1.5L-2L</option>
                    <option value="2L_3L">2L-3L</option>
                    <option value="3L_5L">3L-5L</option>
                    <option value="5L_plus">5L+</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div style={{ color: '#D65050', fontSize: '13px', marginTop: '5px', marginBottom: '15px', padding: '10px 14px', background: 'rgba(214, 80, 80, 0.1)', borderRadius: '8px', border: '1px solid rgba(214, 80, 80, 0.2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  {formError}
                </div>
              )}

              <div className="lux-modal-footer" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                <button type="submit" className="btn-submit-premium" disabled={isSubmitting}>
                  <span className="btn-text">{isSubmitting ? 'Processing...' : 'Request Booking'}</span>
                  <div className="btn-glow" />
                </button>
                <a href={`https://wa.me/918076515257?text=Hi%20Magnevents,%20I'm%20interested%20in%20booking%20an%20artist!`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp-premium">
                  <span className="whatsapp-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.437 0 9.857-4.403 9.86-9.809.001-2.618-1.01-5.08-2.858-6.93C16.528 2.015 14.07 1.006 11.453 1.006c-5.434 0-9.852 4.403-9.855 9.81-.001 2.062.54 4.079 1.566 5.86l-.99 3.613 3.712-.977zm11.304-6.816c-.302-.15-1.788-.882-2.066-.983-.277-.101-.478-.15-.678.15-.2.3-.775.983-.95 1.185-.175.201-.35.227-.652.076-.302-.15-1.274-.469-2.427-1.498-.897-.8-1.502-1.788-1.678-2.09-.175-.302-.019-.465.132-.615.136-.135.302-.35.454-.526.15-.176.2-.302.302-.503.101-.2.05-.376-.026-.526-.075-.15-.678-1.636-.93-2.243-.244-.59-.493-.51-.678-.518-.176-.008-.377-.01-.578-.01-.2 0-.527.075-.803.376-.277.301-1.055 1.031-1.055 2.516 0 1.485 1.079 2.921 1.229 3.122.15.2 2.125 3.245 5.148 4.549.719.311 1.28.497 1.717.637.722.23 1.38.197 1.901.12.58-.087 1.788-.73 2.04-1.435.252-.703.252-1.306.176-1.435-.076-.13-.277-.201-.578-.352z"/>
                    </svg>
                  </span>
                  <span className="btn-text">Or Chat on WhatsApp</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
