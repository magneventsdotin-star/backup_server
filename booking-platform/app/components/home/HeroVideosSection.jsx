"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';

export default function HeroVideosSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/hero-videos');
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      
      // Keep it simple for the grid feed. We just take up to 8 videos to populate the dense grid.
      // Assuming they are sorted by whatever logic API provides, or we just mix them.
      setVideos(data.slice(0, 8));
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    // Only auto-scroll if we have videos and are not currently interacting
    if (videos.length === 0 || isHovered) return;

    let intervalId;
    const checkAndScroll = () => {
      // Only apply horizontal scroll logic on mobile view (which is <= 640px based on CSS)
      if (window.innerWidth < 640 && scrollRef.current) {
        const container = scrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by roughly the width of one card + gap
          container.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    };

    intervalId = setInterval(checkAndScroll, 3500);
    return () => clearInterval(intervalId);
  }, [videos, isHovered]);

  return (
    <section className="hero-videos-section">
      <motion.div 
        className="hp-section-head text-center" 
        style={{ marginBottom: '24px', textAlign: 'center' }}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="video-grid-heading" style={{ fontSize: '2rem', fontWeight: 800 }}>
          Trending <span style={{ color: 'var(--brand-primary)' }}>Now</span>
        </h2>
      </motion.div>

      {loading ? (
        <div className="hero-videos-skeleton-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="hero-video-skeleton">
              <div className="shimmer" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="hero-videos-error" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Videos are currently unavailable.</p>
          <button onClick={fetchVideos} className="hp-btn hp-btn-primary">
            Retry
          </button>
        </div>
      ) : (
        <div 
          className="hero-videos-container" 
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {videos.map((video, index) => (
            <VideoCard 
              key={video.id || index} 
              video={video} 
              index={index} 
              onVideoClick={setSelectedVideo} 
            />
          ))}
        </div>
      )}

      <VideoModal 
        isOpen={!!selectedVideo} 
        video={selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
      />
    </section>
  );
}
