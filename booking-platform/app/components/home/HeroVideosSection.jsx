"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import VideoModal from './VideoModal';
import '@/app/styles/components/HeroVideos.css';

// ══════════════════════════════════════════════════════════════════
// 1. FIRST SECTION: 5 LIGHTWEIGHT, FAST-LOADING IMAGE CARDS
// ══════════════════════════════════════════════════════════════════
const FEATURED_IMAGE_CARDS = [
  {
    id: 'img-house-party',
    title: 'Private House Party Acoustic Singer',
    category: 'House Party',
    tag: '🔥 #1 Trending',
    subtitle: 'Soulful Bollywood, Pop & Unplugged Vocalists for Living Rooms',
    price: '₹6,999',
    regularPrice: '₹16,000',
    discount: '55%–65% OFF',
    rating: '4.96★',
    image: '/posters/house_party_acoustic.jpg',
    badge: 'Compact Sound Setup Included',
    bookingType: 'House Party & Acoustic'
  },
  {
    id: 'img-wedding-band',
    title: 'Grand Sangeet & Royal Live Bands',
    category: 'Wedding Sangeet',
    tag: '👑 Royal Sangeet',
    subtitle: 'High-Octane 5 to 7 Piece Troupe, Sufi Rock & Bollywood Anthems',
    price: '₹28,999',
    regularPrice: '₹65,000',
    discount: 'Up to 60% OFF',
    rating: '4.98★',
    image: '/posters/wedding_sangeet_band.jpg',
    badge: '5-Piece Royal Ensemble',
    bookingType: 'Wedding & Sangeet'
  },
  {
    id: 'img-terrace-jam',
    title: 'Rooftop Terrace Sundowner Jam',
    category: 'Terrace Jam',
    tag: '🌅 Golden Hour',
    subtitle: 'Acoustic Guitarist & Bongo Percussionist for Open-Air Sunset Vibes',
    price: '₹8,499',
    regularPrice: '₹20,000',
    discount: 'Flat 58% OFF',
    rating: '4.94★',
    image: '/posters/terrace_sundowner_jam.jpg',
    badge: 'Acoustic Duo + Percussion',
    bookingType: 'Terrace & Sundowner'
  },
  {
    id: 'img-farmhouse-cocktail',
    title: 'Farmhouse Lawn Cocktail Party',
    category: 'Cocktail Night',
    tag: '🍸 Luxury Lawn',
    subtitle: 'Bollywood Singer & Saxophone Duo for Poolside & Lawn Evenings',
    price: '₹13,999',
    regularPrice: '₹32,000',
    discount: 'Flat 56% OFF',
    rating: '4.97★',
    image: '/posters/farmhouse_cocktail_party.jpg',
    badge: 'Saxophone + Bollywood Vocalist',
    bookingType: 'Farmhouse & Cocktails'
  },
  {
    id: 'img-ghazal-sufi',
    title: 'Intimate Ghazal & Sufi Mehfil',
    category: 'Sufi & Ghazal',
    tag: '🌙 Romantic Mehfil',
    subtitle: 'Harmonium, Acoustic Tabla & Classical Vocalist for Anniversaries',
    price: '₹9,999',
    regularPrice: '₹24,000',
    discount: 'Flat 58% OFF',
    rating: '5.0★',
    image: '/posters/ghazal_sufi_night.jpg',
    badge: 'Harmonium & Live Tabla',
    bookingType: 'Ghazal & Sufi'
  }
];

// ══════════════════════════════════════════════════════════════════
// 2. SECOND SECTION: 4 LIGHTWEIGHT VIDEO PREVIEWS (LOADS VIDEO ONLY ON CLICK)
// ══════════════════════════════════════════════════════════════════
const VIDEO_PREVIEW_CARDS = [
  {
    id: 'vid-birthday-party',
    title: 'Birthday Party Live Music & Singalongs',
    category: 'Birthday Special',
    tag: '🎉 Birthday Bash',
    subtitle: 'High-energy Bollywood medleys & singalongs with compact sound',
    poster: '/posters/birthday_party_singer.jpg',
    videoUrl: 'https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/heroSec/HerSec%20Videos/Birthday%20Party%20Landscape.mp4',
    orientation: 'landscape',
    duration: '0:45 HD',
    rating: '4.98★ (2,100+ Shows)',
    bookingType: 'Birthday Celebrations'
  },
  {
    id: 'vid-house-party',
    title: 'Living Room Acoustic House Party',
    category: 'House Party Live',
    tag: '🔥 Living Room Jam',
    subtitle: 'Soulful Bollywood unplugged acoustic session for 40 guests',
    poster: '/posters/house_party_acoustic.jpg',
    videoUrl: 'https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/heroSec/HerSec%20Videos/house%20party%20Landscape.mp4',
    orientation: 'landscape',
    duration: '0:50 HD',
    rating: '4.96★ (1,450+ Parties)',
    bookingType: 'House Party & Acoustic'
  },
  {
    id: 'vid-farmhouse-cocktail',
    title: 'Poolside Lawn & Cocktail Night Troupe',
    category: 'Cocktail & Sax',
    tag: '🌴 Poolside Evening',
    subtitle: 'Saxophone melody & energetic Bollywood vocal troupe performance',
    poster: '/posters/farmhouse_cocktail_party.jpg',
    videoUrl: 'https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/heroSec/HerSec%20Videos/farm%20house%20Portrait.mp4',
    orientation: 'portrait',
    duration: '0:38 HD',
    rating: '4.97★ (520+ Farmhouses)',
    bookingType: 'Farmhouse & Cocktails'
  },
  {
    id: 'vid-bhajan-sandhya',
    title: 'Devotional Kirtan & Bhajan Sandhya at Home',
    category: 'Devotional Concert',
    tag: '🪔 Bhajan Sandhya',
    subtitle: 'Soulful flute, dholak & Krishna devotional vocalists for home poojas',
    poster: '/posters/bhajan_bhakti_concert.jpg',
    videoUrl: 'https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/heroSec/HerSec%20Videos/Book%20a%20Bhajan%20concert%20at%20home%20Portrait.mp4',
    orientation: 'portrait',
    duration: '0:42 HD',
    rating: '5.0★ (620+ Poojas)',
    bookingType: 'Devotional & Bhajan'
  }
];

export default function HeroVideosSection() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleBook = (item) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-quick-booking', {
        detail: {
          eventType: item.title,
          category: item.bookingType || item.category,
          item: item
        }
      }));
      window.dispatchEvent(new CustomEvent('open-lead-capture', {
        detail: {
          eventType: item.title,
          category: item.bookingType || item.category,
          item: item
        }
      }));
    }
  };

  return (
    <section className="hero-media-wrapper" aria-label="Featured Media and Video Highlights">
      <div className="hero-media-shell">
        
        {/* ══════════════════════════════════════════════════════════
            1. FIRST SECTION: 5 LIGHTWEIGHT IMAGE CARDS
            ══════════════════════════════════════════════════════════ */}
        <div className="hero-media-subblock">
          <motion.div 
            className="media-section-head"
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="media-section-badge">
              <span>📸</span>
              <span>CURATED CELEBRATION MOMENTS</span>
            </div>
            <h2 className="media-section-title">
              Trending Celebrations &amp; <span>Live Experiences</span>
            </h2>
            <p className="media-section-subtitle">
              Verified live artist setups with professional acoustic sound gear · Direct 0% commission rates
            </p>
          </motion.div>

          <div className="media-image-grid-5">
            {FEATURED_IMAGE_CARDS.map((item, idx) => (
              <motion.div
                key={item.id}
                className="media-image-card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                onClick={() => handleBook(item)}
                tabIndex={0}
                role="button"
                aria-label={`View and book ${item.title}`}
              >
                <div className="media-card-thumb">
                  <Image
                    src={item.image}
                    alt={`${item.title} - Magnevents Verified Artist`}
                    fill
                    sizes="(max-width: 640px) 260px, (max-width: 1024px) 33vw, 20vw"
                    loading="lazy"
                    className="media-card-img"
                  />
                  <div className="media-card-gradient" />
                  
                  {/* Floating Badges */}
                  <div className="media-card-top-badges">
                    <span className="media-badge-tag">{item.tag}</span>
                    <span className="media-badge-rating">{item.rating}</span>
                  </div>

                  {/* Feature Pill */}
                  <div className="media-card-feature-pill">
                    <span>✓</span>
                    <span>{item.badge}</span>
                  </div>
                </div>

                <div className="media-card-body">
                  <span className="media-card-category">{item.category}</span>
                  <h3 className="media-card-title">{item.title}</h3>
                  <p className="media-card-subtitle">{item.subtitle}</p>

                  <div className="media-card-pricing-strip">
                    <div>
                      <span className="media-price-cut">{item.regularPrice}</span>
                      <span className="media-price-val">{item.price}</span>
                    </div>
                    <span className="media-discount-pill">{item.discount}</span>
                  </div>

                  <button
                    type="button"
                    className="media-card-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBook(item);
                    }}
                    aria-label={`Book ${item.title} for 99 rupees`}
                  >
                    <span>⚡ Book for ₹99</span>
                    <span>➔</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            2. SECOND SECTION: 4 VIDEO PREVIEW CARDS (LOADS ON DEMAND)
            ══════════════════════════════════════════════════════════ */}
        <div className="hero-media-subblock" style={{ marginTop: '48px' }}>
          <motion.div 
            className="media-section-head"
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="media-section-badge" style={{ borderColor: 'rgba(255, 107, 0, 0.4)', background: 'rgba(255, 107, 0, 0.12)', color: '#FF9900' }}>
              <span>🎬</span>
              <span>LIVE PERFORMANCE REVIEWS</span>
            </div>
            <h2 className="media-section-title">
              Watch Real Artist <span>Live Performance Clips</span>
            </h2>
            <p className="media-section-subtitle">
              Click any clip to watch stage presence, vocal range &amp; crowd energy in crystal-clear HD
            </p>
          </motion.div>

          <div className="media-video-grid-4">
            {VIDEO_PREVIEW_CARDS.map((vid, idx) => (
              <motion.div
                key={vid.id}
                className="media-video-card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                onClick={() => setSelectedVideo({
                  url: vid.videoUrl,
                  title: vid.title,
                  orientation: vid.orientation
                })}
                tabIndex={0}
                role="button"
                aria-label={`Watch live clip: ${vid.title}`}
              >
                <div className="media-video-thumb">
                  <Image
                    src={vid.poster}
                    alt={`Preview: ${vid.title}`}
                    fill
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    className="media-video-img"
                  />
                  <div className="media-card-gradient" />

                  {/* Top Badges */}
                  <div className="media-card-top-badges">
                    <span className="media-badge-tag">{vid.tag}</span>
                    <span className="media-video-duration-badge">
                      <span>▶</span>
                      <span>{vid.duration}</span>
                    </span>
                  </div>

                  {/* Attractive Centered Play Button */}
                  <div className="media-video-play-orb" aria-hidden="true">
                    <div className="media-video-play-icon">▶</div>
                  </div>
                </div>

                <div className="media-video-body">
                  <div className="media-video-meta-row">
                    <span className="media-card-category">{vid.category}</span>
                    <span className="media-video-rating">{vid.rating}</span>
                  </div>
                  <h3 className="media-video-title">{vid.title}</h3>
                  <p className="media-video-subtitle">{vid.subtitle}</p>

                  <div className="media-video-actions">
                    <button
                      type="button"
                      className="media-video-watch-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideo({
                          url: vid.videoUrl,
                          title: vid.title,
                          orientation: vid.orientation
                        });
                      }}
                      aria-label={`Watch video clip ${vid.title}`}
                    >
                      <span>▶ Watch Clip</span>
                    </button>

                    <button
                      type="button"
                      className="media-video-book-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBook(vid);
                      }}
                      aria-label={`Book slot for ${vid.title}`}
                    >
                      <span>⚡ Lock Slot ₹99</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* High-Performance Full Video Modal (Loaded Only When Requested) */}
      <VideoModal
        isOpen={!!selectedVideo}
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
}
