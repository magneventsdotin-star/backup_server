"use client";

import React, { useEffect, useRef, useState, memo } from 'react';
import { motion } from 'framer-motion';

const VideoCard = memo(function VideoCard({ video, index, onVideoClick }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      // Force play on mount just in case autoPlay attribute misses
      videoRef.current.play().catch(e => console.log('Autoplay blocked:', e));
    }
  }, []);

  const togglePlayPause = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => console.log('Play blocked:', e));
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
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
          muted={isMuted}
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="hero-video-overlay-play" style={{ opacity: isPlaying ? 0 : 1 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 3 }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Video Controls Overlay */}
        <div className="hero-video-controls" style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          display: 'flex',
          gap: '8px',
          zIndex: 10
        }}>
          <button 
            onClick={togglePlayPause}
            className="video-control-btn"
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)'
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          
          <button 
            onClick={toggleMute}
            className="video-control-btn"
            style={{
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)'
            }}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            )}
          </button>
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
