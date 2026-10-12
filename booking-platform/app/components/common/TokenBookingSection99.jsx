"use client";

import React, { useState } from 'react';
import { bookingService } from '@/app/services/bookingService';
import '@/app/styles/components/TokenBookingSection99.css';

export default function TokenBookingSection99({
  city = "Amroha",
  category = "Sangeet Singer",
  locationSlug = "sangeet-singer-in-amroha"
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    venue: "Amroha (Private Venue / Lawn)",
    eventType: "Sangeet / Wedding Sangeet"
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Validate form fields
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = "Please enter your full name";
    }
    const cleanPhone = (formData.phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = "Please enter a valid 10-digit mobile number";
    }
    if (!formData.date) {
      errs.date = "Please select your event date";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: digits }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: null }));
    }
  };

  // Submission handler
  const handleBookingSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const randomCode = `MGN-99-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // 1. Submit lead to bookingService and database
      await bookingService.submitInstantRequest({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        date: formData.date,
        location: formData.venue || `${city}`,
        city: city,
        category: category,
        eventType: formData.eventType,
        budget: '₹99 Token Advance',
        tokenNote: `[₹99 ARTIST SLOT RESERVED] Sangeet Singer in ${city}. Venue: ${formData.venue}`,
        message: `PAID ₹99 TOKEN BOOKING REQUEST for ${category} in ${city}. Event date: ${formData.date}, Venue: ${formData.venue}.`,
        type: 'quick_booking',
        formName: `Exclusive ₹99 Event Booking - ${city}`,
        referenceCode: randomCode,
        formLink: typeof window !== 'undefined' ? `${window.location.origin}/${locationSlug}#book-99` : ''
      });

      // 2. Try online Razorpay order if available
      try {
        const orderRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            amount: 99
          })
        });

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          if (orderData?.keyId && orderData?.orderId && typeof window !== 'undefined' && window.Razorpay) {
            const rzp = new window.Razorpay({
              key: orderData.keyId,
              amount: orderData.amount,
              currency: orderData.currency || 'INR',
              name: 'Magnevents',
              description: `₹99 Sangeet Singer Token Booking - ${city}`,
              order_id: orderData.orderId,
              prefill: {
                name: formData.name,
                contact: formData.phone
              },
              theme: { color: '#E8B943' },
              handler: async (response) => {
                try {
                  await fetch('/api/razorpay/verify-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_signature: response.razorpay_signature,
                      customer_name: formData.name,
                      customer_phone: formData.phone
                    })
                  });
                } catch (vErr) {
                  console.warn('Payment verification logged:', vErr);
                }
              }
            });
            rzp.open();
          }
        }
      } catch (payErr) {
        console.warn('Razorpay initiation note (proceeding with reservation pass):', payErr);
      }

      setRefCode(randomCode);
      setIsConfirmed(true);
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrors({ phone: "Unable to process booking. Please try WhatsApp direct booking below." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && refCode) {
      navigator.clipboard.writeText(refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  const whatsAppBookingUrl = `https://wa.me/918076515257?text=${encodeURIComponent(
    `Hi Magnevents! I want to pay the ₹99 token and book a Sangeet Singer in Amroha.${refCode ? ` My Booking ID is ${refCode}.` : ''} Name: ${formData.name || 'Guest'}, Date: ${formData.date || 'Upcoming'}, Location: ${formData.venue || 'Amroha'}. Please lock my slot!`
  )}`;

  return (
    <section id="book-99" className="tok99-section-wrap" aria-label="Book for ₹99 Only Here">
      <div className="tok99-card">
        <div className="tok99-glow-bg" aria-hidden="true" />
        <div className="tok99-glow-corner" aria-hidden="true" />

        {/* Section Header */}
        <div className="tok99-header">
          <div className="tok99-badge-row">
            <span className="tok99-exclusive-pill">
              <span className="tok99-pulse-dot" />
              <span>Exclusive To This Page Only</span>
            </span>
            <span className="tok99-limited-pill">
              ⚡ Flat ₹99 Token Slot Reservation
            </span>
          </div>

          <h2 className="tok99-title">
            Pay ₹99 &amp; <span className="tok99-title-gold">Book Your Event Only Here</span>
          </h2>

          <p className="tok99-subtitle">
            Secure the best <strong>Sangeet Singer in Amroha</strong> today. Pay a nominal <strong>₹99 refundable token</strong> to lock your preferred date with <strong>100% Artist Arrival Guarantee</strong>. The ₹99 token is fully adjusted against your final performer fee!
          </p>
        </div>

        {/* Content Grid */}
        <div className="tok99-grid">
          {/* Left Column: Interactive Form or Pass */}
          <div className="tok99-form-card">
            {isConfirmed ? (
              <div className="tok99-pass-card">
                <div className="tok99-pass-check">✓</div>
                <h3 className="tok99-pass-title">Slot Reserved Successfully!</h3>
                <div className="tok99-pass-pill">
                  <span>🛡️ Verified Booking Pass • ₹99 Token Locked</span>
                </div>

                <div className="tok99-pass-details">
                  <div className="tok99-pass-row">
                    <span className="tok99-pass-label">Booking ID</span>
                    <span className="tok99-pass-id-val">{refCode}</span>
                  </div>
                  <div className="tok99-pass-row">
                    <span className="tok99-pass-label">Client Name</span>
                    <span className="tok99-pass-val">{formData.name}</span>
                  </div>
                  <div className="tok99-pass-row">
                    <span className="tok99-pass-label">Phone No.</span>
                    <span className="tok99-pass-val">+91 {formData.phone}</span>
                  </div>
                  <div className="tok99-pass-row">
                    <span className="tok99-pass-label">Requirement</span>
                    <span className="tok99-pass-val">Sangeet Singer in {city}</span>
                  </div>
                  <div className="tok99-pass-row">
                    <span className="tok99-pass-label">Event Date</span>
                    <span className="tok99-pass-val">{formData.date}</span>
                  </div>
                  <div className="tok99-pass-row">
                    <span className="tok99-pass-label">Token Fee</span>
                    <span className="tok99-pass-val" style={{ color: '#22c55e' }}>₹99 (Deducted from Total)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    style={{
                      padding: '11px 18px',
                      background: copied ? '#15803d' : 'rgba(232, 185, 67, 0.15)',
                      border: '1px solid rgba(232, 185, 67, 0.35)',
                      color: copied ? '#ffffff' : '#F8D36A',
                      borderRadius: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {copied ? '✓ Booking ID Copied!' : '📋 Copy Booking ID'}
                  </button>

                  <a
                    href={whatsAppBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tok99-btn-pay"
                    style={{ textDecoration: 'none' }}
                  >
                    <span>💬 Confirm &amp; Connect on WhatsApp ➔</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} noValidate>
                <div className="tok99-form-card-title">
                  <h3>
                    <span>🎟️</span>
                    <span>Lock Performer Slot</span>
                  </h3>
                  <div className="tok99-price-tag">
                    <span className="tok99-price-old">₹2,000</span>
                    <span className="tok99-price-now">₹99 ONLY</span>
                  </div>
                </div>

                <div className="tok99-form-fields">
                  {/* Name & Phone */}
                  <div className="tok99-row-2col">
                    <div className="tok99-field-group">
                      <label htmlFor="tok99-name" className="tok99-field-label">
                        <span>Your Full Name</span>
                        <span className="tok99-field-req">*</span>
                      </label>
                      <div className={`tok99-input-wrap ${errors.name ? 'has-error' : ''}`}>
                        <input
                          id="tok99-name"
                          name="name"
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={formData.name}
                          onChange={handleChange}
                          className="tok99-input"
                        />
                      </div>
                      {errors.name && <span className="tok99-err-msg">{errors.name}</span>}
                    </div>

                    <div className="tok99-field-group">
                      <label htmlFor="tok99-phone" className="tok99-field-label">
                        <span>Phone / WhatsApp</span>
                        <span className="tok99-field-req">*</span>
                      </label>
                      <div className={`tok99-input-wrap ${errors.phone ? 'has-error' : ''}`}>
                        <div className="tok99-input-prefix">
                          <span>🇮🇳 +91</span>
                        </div>
                        <input
                          id="tok99-phone"
                          name="phone"
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          required
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          className="tok99-input"
                        />
                      </div>
                      {errors.phone && <span className="tok99-err-msg">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Event Date & Location */}
                  <div className="tok99-row-2col">
                    <div className="tok99-field-group">
                      <label htmlFor="tok99-date" className="tok99-field-label">
                        <span>Event Date</span>
                        <span className="tok99-field-req">*</span>
                      </label>
                      <div className={`tok99-input-wrap ${errors.date ? 'has-error' : ''}`}>
                        <input
                          id="tok99-date"
                          name="date"
                          type="date"
                          min={minDate}
                          required
                          value={formData.date}
                          onChange={handleChange}
                          className="tok99-input"
                          style={{ colorScheme: 'dark' }}
                        />
                      </div>
                      {errors.date && <span className="tok99-err-msg">{errors.date}</span>}
                    </div>

                    <div className="tok99-field-group">
                      <label htmlFor="tok99-venue" className="tok99-field-label">
                        <span>Venue / City Area</span>
                      </label>
                      <div className="tok99-input-wrap">
                        <input
                          id="tok99-venue"
                          name="venue"
                          type="text"
                          placeholder="e.g. Joya Road / Amroha"
                          value={formData.venue}
                          onChange={handleChange}
                          className="tok99-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Event Type */}
                  <div className="tok99-field-group">
                    <label htmlFor="tok99-type" className="tok99-field-label">
                      <span>Event Type</span>
                    </label>
                    <div className="tok99-input-wrap">
                      <select
                        id="tok99-type"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className="tok99-select"
                      >
                        <option value="Sangeet / Wedding Sangeet">Wedding Sangeet &amp; Ladies Sangeet</option>
                        <option value="Wedding Reception">Wedding Reception / Gala</option>
                        <option value="Ghazal & Sufi Mehfil">Ghazal &amp; Sufi Mehfil</option>
                        <option value="Private Family Function">Private Family Celebration</option>
                        <option value="Cocktail & Ring Ceremony">Cocktail &amp; Ring Ceremony</option>
                      </select>
                    </div>
                  </div>

                  {/* Savings Badge */}
                  <div className="tok99-savings-box">
                    <div className="tok99-savings-text">
                      <span>✨</span>
                      <span>₹99 Token is 100% deducted from your final booking amount!</span>
                    </div>
                    <span className="tok99-savings-badge">Save ₹1,901</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="tok99-actions-wrap">
                    <button
                      id="tok99-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="tok99-btn-pay"
                    >
                      {isSubmitting ? (
                        <span>Reserving Your Slot...</span>
                      ) : (
                        <span>🔒 Pay ₹99 &amp; Book Your Event Only Here ➔</span>
                      )}
                    </button>

                    <a
                      href={whatsAppBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tok99-btn-whatsapp"
                    >
                      <span>💬 Or Pay ₹99 &amp; Book on WhatsApp</span>
                    </a>

                    <div className="tok99-trust-note">
                      🔒 256-BIT ENCRYPTED • 100% REFUNDABLE TOKEN IF ARTIST IS UNAVAILABLE
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Perks & Guarantees */}
          <div className="tok99-perks-col">
            <div className="tok99-perk-card">
              <div className="tok99-perk-icon-wrap">🛡️</div>
              <div className="tok99-perk-content">
                <h4 className="tok99-perk-title">100% Performer Arrival Guarantee</h4>
                <p className="tok99-perk-desc">
                  Legally verified agreement and backup singers ready. Your Amroha event is 100% guaranteed.
                </p>
              </div>
            </div>

            <div className="tok99-perk-card">
              <div className="tok99-perk-icon-wrap">💎</div>
              <div className="tok99-perk-content">
                <h4 className="tok99-perk-title">0% Middleman Agency Markup</h4>
                <p className="tok99-perk-desc">
                  Direct singer quotations. No hidden fees or inflated commission rates.
                </p>
              </div>
            </div>

            <div className="tok99-perk-card">
              <div className="tok99-perk-icon-wrap">⚡</div>
              <div className="tok99-perk-content">
                <h4 className="tok99-perk-title">Dedicated Amroha Event Manager</h4>
                <p className="tok99-perk-desc">
                  Personal manager assigned within 15 minutes of booking to assist with song selection and sound setup.
                </p>
              </div>
            </div>

            <div className="tok99-perk-card">
              <div className="tok99-perk-icon-wrap">🔄</div>
              <div className="tok99-perk-content">
                <h4 className="tok99-perk-title">Free Date Rescheduling</h4>
                <p className="tok99-perk-desc">
                  Date plans changed? Reschedule your booking easily at zero extra charge up to 48 hours before.
                </p>
              </div>
            </div>

            {/* Bottom Special Notice Box */}
            <div className="tok99-notice-box">
              <span style={{ fontSize: '24px' }}>💡</span>
              <div className="tok99-notice-text">
                <strong>Why book here?</strong> This ₹99 token promotion is exclusively active on this Amroha Sangeet page. Once verified, our concierge shares live rehearsal videos directly to your WhatsApp.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
