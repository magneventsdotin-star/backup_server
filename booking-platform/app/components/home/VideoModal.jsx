"use client";

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoModal({ isOpen, video, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const getCategory = (title) => {
    if (!title) return '';
    if (title.toLowerCase().includes('party')) return 'Live Music';
    if (title.toLowerCase().includes('bhajan')) return 'Devotional';
    return 'Featured Show';
  };

  return (
    <AnimatePresence>
      {isOpen && video && (
        <div className="hero-video-modal-overlay" onClick={onClose} style={{ zIndex: 100000 }}>
          <motion.div
            className="hero-video-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="hero-video-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Playing video: ${video.title}`}
          >
            <button
              className="hero-video-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className={`hero-video-player-wrapper ${video.orientation}`}>
              <video
                ref={videoRef}
                src={video.url}
                className="hero-video-player"
                autoPlay
                controls
                playsInline
                controlsList="nodownload"
              />
            </div>
            
            <div className="hero-video-modal-info">
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                  {getCategory(video.title)}
                </span>
                <h3>{video.title}</h3>
              </div>
              <button 
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }));
                }} 
                className="hp-btn hp-btn-primary modal-quote-btn"
              >
                <span>Get Quote</span>
                <span className="hp-btn-shine" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
