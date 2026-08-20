"use client";

import React, { useEffect, useRef, useState, memo } from 'react';
import { motion } from 'framer-motion';

const VideoCard = memo(function VideoCard({ video, index, onVideoClick }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (videoRef.current) {
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
          } else {
            setIsVisible(false);
            if (videoRef.current) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.5 } // Play when at least 50% visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  const handleVideoCanPlay = () => {
    if (isVisible && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const getCategory = (title) => {
    if (!title) return 'Featured';
    if (title.toLowerCase().includes('party')) return 'Live Music';
    if (title.toLowerCase().includes('bhajan')) return 'Devotional';
    return 'Featured Show';
  };

  const formatTitle = (title) => {
    if (!title) return '';
    const lower = title.toLowerCase();
    if (lower.includes('house party')) return 'Live Singer for House Parties';
    if (lower.includes('farm house') || lower.includes('farmhouse')) return 'Live Band for Farmhouse Events';
    if (lower.includes('birthday')) return 'Live Music for Birthday Parties';
    if (lower.includes('bhajan')) return 'Devotional Bhajan Concert at Home';
    
    // Fallback: Capitalize each word nicely
    return title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <motion.div
      ref={cardRef}
      className="hero-video-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
      onClick={() => onVideoClick(video)}
      tabIndex={0}
      role="button"
      aria-label={`Watch ${video.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onVideoClick(video);
        }
      }}
    >
      <div className="hero-video-wrapper">
        <video
          ref={videoRef}
          src={video.url}
          className="hero-video-preview"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onCanPlay={handleVideoCanPlay}
        />

        <div className="hero-video-overlay-play" style={{ opacity: isPlaying ? 0 : 1 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 3 }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <div className="hero-video-info">
        <div className="hero-video-meta">
          <span className="hero-video-category">{getCategory(video.title)}</span>
        </div>
        
        <h3 className="hero-video-title">{formatTitle(video.title)}</h3>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }));
          }} 
          className="hero-video-quote-btn"
          aria-label={`Get a quote for ${video.title}`}
        >
          Get Quote 
          <svg style={{ marginLeft: 6 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
});

export default VideoCard;
