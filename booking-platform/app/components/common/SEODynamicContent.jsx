"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, CheckCircle, Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/app/styles/components/SEODynamicContent.css';

export default function SEODynamicContent({ category, city, overviewHtml, services, faqs, relatedLinks }) {
  const [openFaq, setOpenFaq] = useState(0);

  const handleOpenBookingModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('open-artist-booking', {
          detail: {
            service: `${category} in ${city}`
          }
        })
      );
      window.dispatchEvent(
        new CustomEvent('open-contact-modal', {
          detail: {
            type: 'booking',
            service: `${category} in ${city}`
          }
        })
      );
    }
  };

  const handleWhatsApp = () => {
    const text = `Hi Magnevents! I am looking to hire a ${category} in ${city}. Please share pricing and available performers.`;
    window.open(`https://wa.me/918076515257?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="seo-dynamic-content">
      <div className="seo-dynamic-container">
        
        {/* Overview Section */}
        {overviewHtml && (
          <section className="seo-overview-card">
            <span className="seo-section-tag">
              👑 LOCAL INSIGHTS &amp; GUIDE
            </span>
            <h2 className="seo-overview-title">
              About Hiring a {category} in {city}
            </h2>
            <div 
              className="seo-overview-body"
              dangerouslySetInnerHTML={{ __html: overviewHtml }} 
            />
          </section>
        )}

        {/* Services Section */}
        {services && services.length > 0 && (
          <section className="seo-services">
            <div className="seo-services-head">
              <span className="seo-section-tag">
                🎭 EVENT TYPES &amp; PACKAGES
              </span>
              <h2 className="seo-services-title">
                Popular Services for {category}s in {city}
              </h2>
            </div>
            <div className="seo-services-grid">
              {services.map((srv, idx) => (
                <div key={idx} className="seo-service-card">
                  <div className="seo-service-icon-wrap">
                    <CheckCircle size={24} />
                  </div>
                  <h3 className="seo-service-card-title">{srv.title}</h3>
                  <p className="seo-service-card-desc">{srv.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mid-content Concierge Quick Booking Callout */}
        <div className="seo-callout-card">
          <div className="seo-callout-left">
            <h3 className="seo-callout-title">
              Planning an event in {city}?
            </h3>
            <p className="seo-callout-desc">
              Let our expert entertainment concierges match you with the perfect verified {category} tailored to your venue and budget.
            </p>
          </div>
          <div className="seo-callout-actions">
            <button
              type="button"
              onClick={handleOpenBookingModal}
              className="seo-btn-concierge-primary"
            >
              <Sparkles size={16} />
              <span>Check Availability</span>
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="seo-btn-concierge-whatsapp"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Us</span>
            </button>
          </div>
        </div>

        {/* FAQs Section */}
        {faqs && faqs.length > 0 && (
          <section className="seo-faqs-wrap">
            <div className="seo-faqs-head">
              <span className="seo-section-tag">
                💡 ANSWERS &amp; INFORMATION
              </span>
              <h2 className="seo-faqs-title">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="seo-faqs-list">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={`seo-faq-item ${openFaq === idx ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="seo-faq-trigger"
                    aria-expanded={openFaq === idx}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={20} className="seo-faq-chevron" />
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="seo-faq-content">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Searches */}
        {relatedLinks && relatedLinks.length > 0 && (
          <section className="seo-related-wrap">
            <h2 className="seo-related-title">
              Related Searches in {city}
            </h2>
            <div className="seo-related-pills">
              {relatedLinks.map((link, idx) => (
                <Link 
                  key={idx} 
                  href={link.url} 
                  className="seo-related-chip"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
