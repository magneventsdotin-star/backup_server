"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';

export default function HeroVideosSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

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
        <div className="hero-videos-container">
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
