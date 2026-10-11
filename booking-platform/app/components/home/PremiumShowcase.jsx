"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PREMIUM_CARDS } from '@/app/constants'
import '@/app/styles/components/PremiumShowcase.css'

export default function PremiumShowcase() {
  return (
    <section className="premium-section">
      <div className="premium-container">
        <div className="premium-header">
          <span className="premium-eyebrow">
            EXCEPTIONAL SERVICE
          </span>
          <h2 className="premium-title">
            Discover the <span className="text-glow">Magnevents</span> Edge
          </h2>
        </div>

        <div className="premium-grid">
          {PREMIUM_CARDS.map((card) => (
            <div
              key={card.id}
              className="premium-card-wrap"
            >
              <Link
                href={card.path}
                className="premium-card"
                onClick={(e) => {
                  if (card.path === '/contact') {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }));
                  }
                }}
              >
                <div className="card-glow" style={{ backgroundColor: card.color }} />
                <div className="card-inner">
                  <span className="card-icon">{card.icon}</span>
                  <div className="card-content">
                    <h3>{card.title}</h3>
                    <p className="card-subtitle">{card.subtitle}</p>
                    <p className="card-desc">{card.desc}</p>
                  </div>
                  <div className="card-action">
                    <span>Learn More</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
