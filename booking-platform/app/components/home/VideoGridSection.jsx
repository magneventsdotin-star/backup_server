"use client";

import { motion } from 'framer-motion';

const videoItems = [
  {
    id: 1,
    title: 'Book Singer for a House Party',
    youtubeId: 'rP4LdM5p7oI'
  },
  {
    id: 2,
    title: 'Book singer for Birthday party',
    youtubeId: 'ilOh5qrvQIw'
  },
  {
    id: 3,
    title: 'Book a Live Band',
    youtubeId: 'gtcOgD6S-nY'
  },
  {
    id: 4,
    title: 'Singer for Farm house event',
    youtubeId: 'xI6iNzDI3Jk'
  }
];

export default function VideoGridSection() {
  const openModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-contact-modal', { detail: { type: 'booking' } }));
    }
  };

  return (
    <section className="video-grid-section hp-shell hp-block" style={{ padding: '4rem 2rem' }}>
      <div className="hp-section-head text-center" style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-display)', color: '#fff' }}>
          Experience the <span style={{ color: 'var(--brand-primary)' }}>Vibe</span>
        </h2>
      </div>
      
      <div className="video-grid-container" style={{ 
        display: 'grid', 
        gap: '3rem', 
        maxWidth: '1300px', 
        margin: '0 auto' 
      }}>
        {videoItems.map((item, index) => (
          <motion.div 
            key={item.id} 
            className="video-grid-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div className="video-wrapper" style={{ 
              position: 'relative', 
              width: '100%', 
              aspectRatio: '16/9', 
              borderRadius: '16px', 
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <iframe
                className="grid-video"
                src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${item.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3`}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: 'none', 
                  pointerEvents: 'none',
                  transform: 'scale(1.5)',
                  transition: 'transform 0.5s ease'
                }}
              />
              {/* Invisible overlay to block clicks just in case */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}></div>
            </div>
            
            <div className="video-item-footer" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '4px'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '700', 
                color: '#fff',
                borderLeft: '4px solid var(--brand-primary)',
                paddingLeft: '12px'
              }}>
                {item.title}
              </h3>
              <button 
                onClick={openModal} 
                style={{
                  background: 'var(--brand-primary)',
                  color: '#000',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s, transform 0.2s'
                }}
                onMouseEnter={(e) => { e.target.style.background = '#e6c825'; e.target.style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { e.target.style.background = 'var(--brand-primary)'; e.target.style.transform = 'translateY(0)' }}
              >
                Get Quote
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      <style jsx>{`
        .video-grid-container {
          grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 768px) {
          .video-grid-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
