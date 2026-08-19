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
    <section className="video-grid-section hp-shell hp-block">
      <div className="hp-section-head text-center" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 className="video-grid-heading">
          Experience the <span style={{ color: 'var(--brand-primary)' }}>Vibe</span>
        </h2>
      </div>
      
      <div className="video-grid-container">
        {videoItems.map((item, index) => (
          <motion.div 
            key={item.id} 
            className="video-grid-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <div className="video-wrapper">
              <iframe
                className="grid-video"
                src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${item.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  border: 'none', 
                  pointerEvents: 'none',
                  transform: 'scale(1.5)',
                  transition: 'transform 0.5s ease'
                }}
              />
              <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}></div>
            </div>
            
            <div className="video-item-footer">
              <h3 className="video-item-title">
                {item.title}
              </h3>
              <button 
                onClick={openModal} 
                className="video-quote-btn"
              >
                Get Quote
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      <style jsx>{`
        .video-grid-section {
          padding: 4rem 2rem;
        }
        .video-grid-heading {
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-family: var(--font-display);
          color: #fff;
        }
        .video-grid-container {
          display: grid;
          gap: 2.5rem;
          max-width: 1300px;
          margin: 0 auto;
          grid-template-columns: repeat(2, 1fr);
        }
        .video-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .video-item-footer {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 4px;
        }
        .video-item-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          border-left: 4px solid var(--brand-primary);
          padding-left: 12px;
          line-height: 1.3;
          flex: 1;
        }
        .video-quote-btn {
          background: var(--brand-primary);
          color: #000;
          border: none;
          padding: 9px 18px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.2s;
          flex-shrink: 0;
        }
        .video-quote-btn:hover {
          background: #e6c825;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .video-grid-section {
            padding: 2rem 0.75rem !important;
          }
          .video-grid-heading {
            font-size: 1.6rem !important;
          }
          .video-grid-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .video-item-footer {
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 12px;
            text-align: center;
          }
          .video-item-title {
            font-size: 14px !important;
            padding-left: 0 !important;
            border-left: none !important;
            line-height: 1.3 !important;
            text-align: center;
            width: 100%;
          }
          .video-quote-btn {
            padding: 8px 16px !important;
            font-size: 13px !important;
            border-radius: 6px !important;
            width: 100%;
            max-width: 200px;
          }
        }
        @media (max-width: 360px) {
          .video-grid-section {
            padding: 1.5rem 0.5rem !important;
          }
          .video-item-title {
            font-size: 12px !important;
          }
          .video-quote-btn {
            padding: 5px 10px !important;
            font-size: 11px !important;
          }
        }
      `}</style>
    </section>
  );
}
