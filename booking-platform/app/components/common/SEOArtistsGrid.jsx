"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ArtistCard from '@/app/components/artists/ArtistCard';
import { useArtists } from '@/app/hooks/useArtists';
import '@/app/styles/pages/Artists.css';

export default function SEOArtistsGrid({ category = 'All', city = 'All Cities', fallbackArtists = [] }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const { artists, loading, totalPages, fetchArtists } = useArtists(15);

  useEffect(() => {
    fetchArtists(currentPage, category, city);
  }, [currentPage, category, city, fetchArtists]);

  const handleBook = (name) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('open-contact-modal', {
          detail: {
            type: 'booking',
            artist: name,
            service: `${category} in ${city}`
          }
        })
      );
    }
  };

  const displayArtists = artists.length > 0 ? artists : fallbackArtists;
  const isShowingFallback = artists.length === 0 && fallbackArtists.length > 0;

  return (
    <div className="artists-page" style={{ padding: '2rem 0', background: 'transparent' }}>
      <div className="lux-container">
        <div className="hp-section-head" style={{ marginBottom: '2rem' }}>
          <h2>Available {category !== 'All' ? (category.toLowerCase().includes('dj') ? 'DJs' : (category.endsWith('s') ? category : `${category}s`)) : 'Artists'} {isShowingFallback ? `for ${city} Events` : `in ${city}`}</h2>
        </div>

        <div className="artists-grid">
          {loading ? (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="modern-artist-card artist-card-skeleton">
                   <div className="skeleton-pulse" style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.03)' }}></div>
                   <div className="modern-overlay-gradient"></div>
                   
                   <div className="modern-info-overlay">
                     <div className="skeleton-pulse" style={{ height: '20px', width: '65%', background: 'rgba(255,255,255,0.12)', borderRadius: '6px', marginBottom: '6px' }}></div>
                     
                     <div className="modern-badges-container">
                       <div className="skeleton-pulse" style={{ height: '14px', width: '50px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}></div>
                       <div className="skeleton-pulse" style={{ height: '14px', width: '60px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}></div>
                     </div>
                     
                     <div className="modern-location-row">
                       <div className="skeleton-pulse" style={{ height: '13px', width: '45%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}></div>
                     </div>
                     
                     <div className="modern-footer-row">
                        <div className="modern-rating-box">
                          <div className="skeleton-pulse" style={{ height: '14px', width: '55px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                        </div>
                        <div className="modern-booking-badge skeleton-pulse" style={{ width: '80px', height: '20px' }}></div>
                     </div>
                   </div>
                </div>
              ))}
            </>
          ) : (
            <AnimatePresence mode='popLayout'>
              {isShowingFallback && (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  marginBottom: '10px',
                  padding: '18px 24px',
                  background: 'rgba(232, 185, 67,  0.08)',
                  borderRadius: '16px',
                  border: '1px solid rgba(232, 185, 67,  0.25)'
                }}>
                  <p style={{ margin: 0, color: '#E8B943', fontWeight: '700', fontSize: '15px' }}>
                    ✈️ Top Verified {category !== 'All' ? (category.toLowerCase().includes('dj') ? 'DJs' : `${category}s`) : 'Performers'} Ready to Travel to {city}
                  </p>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', display: 'block' }}>
                    Magnevents manages all artist travel, accommodation, technical riders, and venue sound coordination end-to-end.
                  </span>
                </div>
              )}

              {displayArtists.length > 0 ? (
                displayArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} onBook={handleBook} />
                ))
              ) : (
                <div style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '8px' }}>
                    {category.toLowerCase().includes('dj') ? `Looking for a verified DJ in ${city}?` : `Looking for a specific ${category !== 'All' ? category : 'artist'} in ${city}?`}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', maxWidth: '500px', marginInline: 'auto' }}>
                    {category.toLowerCase().includes('dj') 
                      ? `Our event specialists curate top verified club, wedding, and corporate DJs with Pioneer sound & lighting setups in ${city}.`
                      : 'Our event specialists can source, curate, and book any verified performer according to your event requirements and budget.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleBook(null)}
                    style={{ background: '#E8B943', color: '#000', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}
                  >
                    {category.toLowerCase().includes('dj') ? 'Request Custom DJ Package' : 'Request Custom Artist'}
                  </button>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
