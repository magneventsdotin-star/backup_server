"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FadeSection from '@/app/components/common/FadeSection';
import { HOW_TO_BOOK_STEPS } from '@/app/constants';
import '@/app/styles/pages/HowToBook.css';

function HowToBookSection() {
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
    <FadeSection className="hp-shell hp-block how-section-wrapper">
      <div className="how-ambient-glow" />

      <div className="hp-how-section">
        <div className="how-header-modern">
          <div className="how-badge">
            <span className="how-badge-icon">✨</span>
            <span className="how-badge-text">Simple 4-Step Process</span>
          </div>
          <h2 className="how-title hp-display-title">
            How to book a <span>musician?</span>
          </h2>
          <p className="how-subtitle">
            Your seamless journey to incredible live entertainment.
          </p>
        </div>

        <div 
          className="how-grid-modern is-mobile-scroll"
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
        >
          <div className="how-connecting-line" />

          {HOW_TO_BOOK_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="how-card-modern"
            >
              <div className="how-card-inner">
                <div className="how-card-top">
                  <div className="how-icon-box" style={{ '--glow-color': step.color }}>
                    <div className="how-icon-bg" />
                    <span className="how-icon-text">{step.icon}</span>
                  </div>
                  <span className="how-big-number">0{idx + 1}</span>
                </div>

                <div className="how-card-bottom">
                  <div className="how-step-label" style={{ color: step.color }}>
                    Step {idx + 1}
                  </div>
                  <h3 className="how-step-title">{step.title}</h3>
                  <p className="how-step-desc">{step.desc}</p>
                </div>

                <div className="how-card-hover-glow" style={{ '--hover-color': step.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeSection>
  );
}

export default React.memo(HowToBookSection);
