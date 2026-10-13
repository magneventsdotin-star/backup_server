"use client";

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeSection from '@/app/components/common/FadeSection'
import { FAQS } from '@/app/constants'

export default function FaqSection({
  eyebrow = "🤔 Common Questions",
  title = "Frequently Asked Questions",
  titleGradient = false
}) {
  const [openFaq, setOpenFaq] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const handleToggleShowAll = () => {
    if (showAll && openFaq >= 2) {
      setOpenFaq(0)
    }
    setShowAll(!showAll)
  }

  const displayedFaqs = showAll ? FAQS : FAQS.slice(0, 2)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <FadeSection className="hp-shell hp-block hp-faqs">
        <div className="hp-section-head">
          <h2 className="hp-display-title">Frequently Asked Questions</h2>
        </div>
        <div className="hp-faq-list">
          <AnimatePresence initial={false}>
            {displayedFaqs.map((item, index) => {
              const active = openFaq === index
              return (
                <motion.div
                  key={item.q}
                  className={`hp-faq-item ${active ? 'is-open' : ''}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  layout
                >
                  <button type="button" onClick={() => setOpenFaq(active ? -1 : index)}>
                    <span>{item.q}</span>
                    <motion.strong
                      animate={{ rotate: active ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      +
                    </motion.strong>
                  </button>
                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.p
                        key="answer"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                      >
                        {item.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {FAQS.length > 2 && (
          <div className="hp-faq-toggle-wrap">
            <button
              type="button"
              onClick={handleToggleShowAll}
              className="hp-faq-toggle-btn"
              aria-expanded={showAll}
              aria-label={showAll ? "Show fewer questions" : "Show all frequently asked questions"}
            >
              <span>{showAll ? 'Show Fewer Questions' : `View All Questions (${FAQS.length})`}</span>
              <svg
                className={`hp-faq-toggle-icon ${showAll ? 'is-rotated' : ''}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        )}
      </FadeSection>
    </>
  )
}
