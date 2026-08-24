"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { INFO_CARDS } from '@/app/constants'
import '@/app/styles/components/InfoCards.css'

export default function InfoCards() {
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = React.useRef(null);

  // Reset scroll on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, []);

  // Auto-scroll on mobile
  useEffect(() => {
    if (window.innerWidth > 768 || isHovered) return;

    let intervalId;
    const checkAndScroll = () => {
      if (window.innerWidth <= 768 && scrollRef.current) {
        const container = scrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    };

    intervalId = setInterval(checkAndScroll, 3500);
    return () => clearInterval(intervalId);
  }, [isHovered]);

  return (
    <section className="hp-journey-section">
      <div className="lux-container">
        <div className="hp-section-head">
          <h2>All Services</h2>
        </div>
        <div className="journey-flow-wrap">
          <div 
            className="journey-cards is-mobile-scroll"
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            {INFO_CARDS.map((card, idx) => (
              <motion.div
                key={idx}
                className={`journey-card-step step-${idx + 1}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: idx * 0.15,
                  ease: [0.21, 1.02, 0.47, 0.98]
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Link
                  href={card.link}
                  className={`info-card-link ${card.accent}-accent`}
                  onClick={(e) => {
                    if (card.link === '/contact') {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }));
                    }
                  }}
                >
                  <div className="info-card-inner">
                    <div className="card-top">
                      <span className="card-icon-pill">{card.icon}</span>
                      <div className="card-text">
                        <h4>{card.title}</h4>
                        <p>{card.subtitle}</p>
                      </div>
                    </div>
                    <ul className="card-points">
                      {card.points.map((pt, pIdx) => (
                        <li key={pIdx}><span>•</span> {pt}</li>
                      ))}
                    </ul>
                    <div className="card-footer">
                      <span>Learn More</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
