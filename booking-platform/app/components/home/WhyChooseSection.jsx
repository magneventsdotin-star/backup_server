"use client";

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FadeSection from '@/app/components/common/FadeSection'
import { WHY_POINTS } from '@/app/constants'

function WhyChooseSection() {
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = React.useRef(null)

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
    <FadeSection className="hp-shell hp-block">
      <div className="hp-section-head">
        <h2>? Why Choose Magnevents?</h2>
      </div>
      <div 
        className="hp-why-grid is-mobile-scroll"
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {WHY_POINTS.map((item, i) => (
          <motion.article
            key={item.title}
            className="hp-why-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            whileHover={{ y: -6 }}
          >
            <span className="hp-why-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.article>
        ))}
      </div>
    </FadeSection>
  )
}

export default React.memo(WhyChooseSection);
