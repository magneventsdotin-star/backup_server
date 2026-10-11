"use client";

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import FadeSection from '@/app/components/common/FadeSection'
import { WHY_POINTS } from '@/app/constants'

function WhyChooseSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef(null)

  const scrollToIndex = (idx) => {
    setActiveIndex(idx)
    if (scrollRef.current) {
      const container = scrollRef.current
      const cards = container.querySelectorAll('.hp-why-card')
      if (cards[idx]) {
        const card = cards[idx]
        const cardLeft = card.offsetLeft - container.offsetLeft
        const targetScroll = cardLeft - (container.clientWidth - card.clientWidth) / 2
        container.scrollTo({ left: targetScroll, behavior: 'smooth' })
      }
    }
  }

  const handleScroll = () => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const cards = container.querySelectorAll('.hp-why-card')
    if (!cards || cards.length === 0) return

    const containerLeft = container.getBoundingClientRect().left
    let closestIndex = 0
    let minDiff = Infinity

    cards.forEach((card, i) => {
      const diff = Math.abs(card.getBoundingClientRect().left - containerLeft)
      if (diff < minDiff) {
        minDiff = diff
        closestIndex = i
      }
    })

    setActiveIndex(closestIndex)
  }

  return (
    <FadeSection className="hp-shell hp-block">
      <div className="hp-section-head">
        <h2 className="hp-display-title">Why Choose Magnevents</h2>
      </div>
      <div 
        className="hp-why-grid is-mobile-scroll"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {WHY_POINTS.map((item, i) => (
          <motion.article
            key={item.title}
            className={`hp-why-card ${activeIndex === i ? 'is-active-card' : ''}`}
            whileHover={{ y: -6 }}
            onClick={() => setActiveIndex(i)}
            style={{
              borderColor: activeIndex === i ? 'rgba(232, 185, 67, 0.45)' : undefined,
              boxShadow: activeIndex === i ? '0 24px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(232, 185, 67, 0.12)' : undefined
            }}
          >
            <span className="hp-why-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.article>
        ))}
      </div>

      {/* Sliding Fluid Dots Indicator & Scroll Navigation Buttons */}
      <div 
        className="hp-why-dots-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '22px',
          userSelect: 'none'
        }}
      >
        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
          aria-label="Previous card"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--color-ivory, #F5F0E9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            opacity: activeIndex === 0 ? 0.35 : 0.9,
            transition: 'all 0.2s ease'
          }}
        >
          ‹
        </button>

        <div style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 6px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '100px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Smooth Sliding Active Pill Indicator */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '6px',
              width: '18px',
              height: '6px',
              borderRadius: '100px',
              background: 'linear-gradient(90deg, #E8B943 0%, #E45F60 100%)',
              boxShadow: '0 0 12px rgba(232, 185, 67, 0.6)',
              transform: `translateX(${activeIndex * 16}px)`,
              transition: 'transform 0.32s cubic-bezier(0.2, 0.9, 0.3, 1.15)',
              pointerEvents: 'none',
              zIndex: 2
            }}
          />

          {/* Fixed Background Dots */}
          {WHY_POINTS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to card ${idx + 1}`}
              style={{
                width: '16px',
                height: '6px',
                padding: 0,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.28)',
                  opacity: activeIndex === idx ? 0 : 1,
                  transition: 'opacity 0.2s ease'
                }}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(WHY_POINTS.length - 1, activeIndex + 1))}
          aria-label="Next card"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--color-ivory, #F5F0E9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            opacity: activeIndex === WHY_POINTS.length - 1 ? 0.35 : 0.9,
            transition: 'all 0.2s ease'
          }}
        >
          ›
        </button>
      </div>
    </FadeSection>
  )
}

export default React.memo(WhyChooseSection);
