"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AllCitiesSection, { ALL_CITIES_DIRECTORY } from '@/app/components/common/AllCitiesSection';
import '@/app/styles/pages/AISearch.css';

const FEATURED_SLIDER_ARTISTS = [
  {
    id: "b67daa32-b5a4-469c-a0a2-9fb834f18070",
    name: "Madhur (M.D. Live)",
    category: "Live Singer",
    subCategory: "Bollywood Retro, Sufi, Ghazals",
    city: "Delhi NCR",
    rating: 5.0,
    successful_bookings: 85,
    price_min: 10000,
    price_max: 35000,
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/talent-track/artists/1aebea4e-76c8-428b-97e1-38db4bb57eca.jpeg",
    slug: "madhur"
  },
  {
    id: "9d7e53a6-9caa-4e2d-a3c1-d2962d4718dc",
    name: "Harshit Singh (HR Live)",
    category: "Acoustic Singer",
    subCategory: "Bollywood, Sufi, Devotional & Unplugged",
    city: "Delhi NCR",
    rating: 5.0,
    successful_bookings: 75,
    price_min: 6000,
    price_max: 15000,
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/talent-track/artists/65d89432-5792-4a36-b194-8e8ec201279a.jpeg",
    slug: "harshit-singh"
  },
  {
    id: "8d6b7e3b-4b2a-4924-98d6-a133f2910cb2",
    name: "Ridam (RDM Live)",
    category: "Rock & Pop Vocalist",
    subCategory: "Western Pop, Rock & Bollywood Medleys",
    city: "Delhi NCR",
    rating: 4.8,
    successful_bookings: 77,
    price_min: 16000,
    price_max: 45000,
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/talent-track/artists/b8a34314-3bd3-408a-b53c-d94af404986b.JPG",
    slug: "ridam"
  },
  {
    id: "dc8e3224-fee3-4fdb-bff2-5bfb25d694cd",
    name: "Aatir (AAA Live)",
    category: "Party Singer",
    subCategory: "Bollywood Retro, Punjabi Hits & Sufi",
    city: "New Delhi",
    rating: 5.0,
    successful_bookings: 65,
    price_min: 15000,
    price_max: 40000,
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/talent-track/artists/5395cebe-5426-4b02-b782-7680026c6e0f.jpg",
    slug: "aatir"
  },
  {
    id: "ab0250b3-3f60-4d6b-abec-412212b8d1fd",
    name: "Gaurav (H24 Live)",
    category: "Multi-Genre Vocalist",
    subCategory: "English Jazz, Western Retro & Bollywood",
    city: "Delhi NCR",
    rating: 5.0,
    successful_bookings: 42,
    price_min: 8000,
    price_max: 20000,
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/talent-track/artists/e37b24a4-0cb3-4ef4-b930-afc680e23882.jpeg",
    slug: "gaurav"
  },
  {
    id: "fbd98968-61ef-4f5d-9c5a-60fb14cd517e",
    name: "Vipul Kumar (VIP Live)",
    category: "Live Singer",
    subCategory: "Bollywood, Sufi & Punjabi Beats",
    city: "Delhi NCR",
    rating: 4.8,
    successful_bookings: 38,
    price_min: 7000,
    price_max: 25000,
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/talent-track/artists/0b48ccea-4fcd-4eb4-bdf5-dc059a9ba4e0.jpeg",
    slug: "vipul-kumar"
  },
  {
    id: "6b53eed6-8ba6-49b7-9cae-c56bd0f909ac",
    name: "Arman Azmi (Azmi Live)",
    category: "Ghazal & Sufi Singer",
    subCategory: "Classical Ghazals, Bollywood & Sufi",
    city: "Delhi NCR",
    rating: 5.0,
    successful_bookings: 35,
    price_min: 6000,
    price_max: 18000,
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/talent-track/artists/ae6d5914-ca49-4300-acfd-e97c8c605df5.jpeg",
    slug: "arman-azmi"
  },
  {
    id: "0a7ee8d6-06e1-4051-969e-0ca24950c4f1",
    name: "Abhishek (Abhi)",
    category: "Acoustic Singer",
    subCategory: "Bollywood Melodies & Unplugged",
    city: "Jaipur / NCR",
    rating: 4.9,
    successful_bookings: 30,
    price_min: 7000,
    price_max: 15000,
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/talent-track/artists/38c91e71-c0f9-4a46-8fba-620efc7f8b9e.jpeg",
    slug: "abhishek"
  }
];

const QUICK_PROMPTS = [
  {
    label: "🌹 Ghazal Singer in Bhubaneswar",
    query: "Soulful ghazal and sufi singer in Bhubaneswar for intimate wedding anniversary dinner under ₹30,000",
    city: "Bhubaneswar",
    eventType: "Anniversary"
  },
  {
    label: "💍 Bollywood Wedding Band",
    query: "Energetic 4-piece Bollywood live band for wedding sangeet in Delhi with complete sound setup",
    city: "Delhi",
    eventType: "Wedding / Sangeet"
  },
  {
    label: "🎧 Corporate Party DJ",
    query: "Commercial EDM & Bollywood DJ with percussionist for corporate annual celebration in Bangalore",
    city: "Bangalore",
    eventType: "Corporate Gala"
  },
  {
    label: "🎸 Acoustic Cafe Launch",
    query: "Acoustic guitar duo and singer for outdoor cafe launch party in Mumbai under ₹20,000",
    city: "Mumbai",
    eventType: "Cafe Launch"
  },
  {
    label: "🎂 House Party Singer",
    query: "Versatile live singer for private birthday house party with wireless mic and portable sound setup",
    city: "All Cities",
    eventType: "House Party"
  }
];

const CITIES = [
  "All Cities",
  ...ALL_CITIES_DIRECTORY.map(c => c.name)
];

const EVENT_TYPES = [
  "All Occasions",
  "Wedding / Sangeet",
  "Private House Party",
  "Corporate Event",
  "Birthday Soiree",
  "Anniversary Dinner",
  "Cocktail & Reception"
];

const DEFAULT_TOP_ARTISTS = [
  {
    id: "top-artist-1",
    artist_no: "MAG-001",
    name: "Aryan Sharma",
    category: "Live Singer",
    subCategory: "Bollywood, Sufi & Acoustic Live Performance",
    city: "Delhi NCR",
    price_min: 12000,
    price_max: 30000,
    rating: 4.9,
    successful_bookings: 85,
    bio: "Versatile Bollywood & Sufi vocalist performing soulful acoustics and upbeat party tracks.",
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/assets/lux-singer-session.webp",
    slug: "aryan-sharma"
  },
  {
    id: "top-artist-2",
    artist_no: "MAG-002",
    name: "Riya Mukherjee",
    category: "Ghazal & Sufi Artist",
    subCategory: "Classical Ghazals, Romantic Melodies & Semi-Classical",
    city: "Bhubaneswar",
    price_min: 15000,
    price_max: 35000,
    rating: 5.0,
    successful_bookings: 62,
    bio: "Soulful Ghazal and Sufi specialist with 10+ years of stage experience.",
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/assets/lux-singer-session.webp",
    slug: "riya-mukherjee"
  },
  {
    id: "top-artist-3",
    artist_no: "MAG-003",
    name: "The Acoustic Collective",
    category: "Live Music Band",
    subCategory: "Retro Bollywood, Pop Rock & Medleys",
    city: "Mumbai",
    price_min: 25000,
    price_max: 60000,
    rating: 4.9,
    successful_bookings: 110,
    bio: "4-piece high energy live band with complete sound and instruments.",
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/assets/lux-singer-session.webp",
    slug: "the-acoustic-collective"
  },
  {
    id: "top-artist-4",
    artist_no: "MAG-004",
    name: "DJ Karan & Percussion",
    category: "Club & Wedding DJ",
    subCategory: "Commercial EDM, Punjabi Dhol & Bollywood Remixes",
    city: "Bangalore",
    price_min: 20000,
    price_max: 45000,
    rating: 4.8,
    successful_bookings: 95,
    bio: "Dynamic DJ with live percussionist for corporate galas and wedding sangeet.",
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/assets/lux-singer-session.webp",
    slug: "dj-karan-percussion"
  },
  {
    id: "top-artist-5",
    artist_no: "MAG-005",
    name: "Kabir & Strings",
    category: "Acoustic Duo",
    subCategory: "Unplugged Bollywood, Indie & English Classics",
    city: "Varanasi",
    price_min: 10000,
    price_max: 22000,
    rating: 4.9,
    successful_bookings: 48,
    bio: "Intimate acoustic guitar and vocal duo for private parties and cafe gigs.",
    img: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/assets/lux-singer-session.webp",
    slug: "kabir-and-strings"
  }
];

function AISearchContent() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(urlQuery);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedEventType, setSelectedEventType] = useState("All Occasions");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [results, setResults] = useState(null);
  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmt = direction === 'left' ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  const runAISearch = async (searchText, city = selectedCity, eventType = selectedEventType) => {
    const finalQuery = (searchText || query).trim();
    if (!finalQuery && city === "All Cities" && eventType === "All Occasions") {
      setErrorMsg("Please type what kind of music, singer, or event vibe you are looking for!");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: finalQuery,
          city: city !== "All Cities" ? city : "",
          eventType: eventType !== "All Occasions" ? eventType : ""
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to process AI search");
      }

      setResults(data);
    } catch (err) {
      console.error("AI Search failed:", err);
      setErrorMsg(err.message || "Could not complete AI search. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount if URL has search param
  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      runAISearch(urlQuery);
    } else {
      // Default initial query for immediate rich experience
      runAISearch("Soulful ghazal singer in Bhubaneswar with sound system", "Bhubaneswar", "Anniversary Dinner");
    }
  }, [urlQuery]);

  const handlePromptClick = (item) => {
    setQuery(item.query);
    setSelectedCity(item.city);
    setSelectedEventType(item.eventType);
    runAISearch(item.query, item.city, item.eventType);
  };

  const handleBookArtist = (artistName, category = 'Live Singer') => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-quick-booking', {
        detail: { artistName, eventType: category }
      }));
      window.dispatchEvent(new CustomEvent('open-contact-modal', {
        detail: { type: 'booking', artistName }
      }));
    }
  };

  const handleClaimOffer = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-contact-modal', {
        detail: { type: 'offer' }
      }));
    }
  };

  return (
    <div className="lux-ai-search-page">
      <div className="lux-ai-ambient-glow-1" aria-hidden="true" />
      <div className="lux-ai-ambient-glow-2" aria-hidden="true" />

      <div className="lux-ai-container">
        {/* Hero */}
        <section className="lux-ai-hero">
          <div className="lux-ai-badge">
            <span className="lux-ai-badge-dot" />
            <span>AI Search · Official Event Intelligence · Deep Artist Reasoning</span>
          </div>

          <h1 className="lux-ai-title">
            AI Search <span className="lux-ai-title-highlight">Artist Matcher</span>
          </h1>

          <p className="lux-ai-subtitle">
            Describe your event in everyday natural language. AI Search understands Indian event vibes, sound rider setups, direct 0% commission artist pricing, and instant bookings.
          </p>

          {/* Trust signals */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px',
            flexWrap: 'wrap',
            marginBottom: '36px',
            padding: '14px 24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            {[['1,500+', 'Verified Artists'], ['0%', 'Commission'], ['100%', 'Arrival Guarantee'], ['⚡', 'Instant Match']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#FFE032', letterSpacing: '-0.02em' }}>{val}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>

          <div className="lux-ai-searchbox-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runAISearch(query);
              }}
            >
              <div className="lux-ai-input-wrapper">
                <span className="lux-ai-search-icon">✨</span>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Need a Ghazal and Sufi singer in Bhubaneswar for a 50-guest wedding anniversary dinner under ₹30,000..."
                  className="lux-ai-textarea"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      runAISearch(query);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="lux-ai-search-submit-btn"
                >
                  <span>{isLoading ? "Analyzing..." : "Search with AI"}</span>
                  <span>→</span>
                </button>
              </div>

              {/* Filter Controls */}
              <div className="lux-ai-filters-row">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="lux-ai-select"
                  aria-label="Filter by City"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c} style={{ background: '#121017' }}>
                      📍 {c}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="lux-ai-select"
                  aria-label="Filter by Event Type"
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t} style={{ background: '#121017' }}>
                      🎉 {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Prompts */}
              <div className="lux-ai-chips-wrap">
                <span className="lux-ai-chips-label">Try Examples:</span>
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handlePromptClick(p)}
                    className="lux-ai-prompt-chip"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </form>

            {errorMsg && (
              <p style={{ color: '#ff6b6b', marginTop: '14px', fontSize: '13px' }}>
                ⚠️ {errorMsg}
              </p>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            HORIZONTAL FEATURED ARTISTS SLIDER SECTION
            ══════════════════════════════════════════════════════════ */}
        <section className="lux-ai-slider-section" aria-label="Featured Artist Profiles">
          <div className="lux-ai-slider-header">
            <div className="lux-ai-slider-heading-wrap">
              <span className="lux-ai-slider-badge">⭐ TOP VERIFIED PERFORMERS</span>
              <h2 className="lux-ai-slider-title">
                Featured <span>Artist Profiles</span>
              </h2>
              <p className="lux-ai-slider-subtitle">
                Slide horizontally to discover top verified singers &amp; bands · Direct pricing · 0% commission markup
              </p>
            </div>
            <div className="lux-ai-slider-nav-arrows">
              <button
                type="button"
                className="lux-ai-slider-arrow-btn"
                onClick={() => scrollSlider('left')}
                aria-label="Previous artist profiles"
              >
                ◀
              </button>
              <button
                type="button"
                className="lux-ai-slider-arrow-btn"
                onClick={() => scrollSlider('right')}
                aria-label="Next artist profiles"
              >
                ▶
              </button>
            </div>
          </div>

          <div className="lux-ai-slider-track" ref={sliderRef}>
            {FEATURED_SLIDER_ARTISTS.map((artist) => (
              <div key={artist.id} className="lux-ai-slider-card">
                <div className="lux-ai-slider-card-thumb">
                  <Image
                    src={artist.img}
                    alt={`${artist.name} - ${artist.category}`}
                    fill
                    sizes="280px"
                    className="lux-ai-slider-card-img"
                    unoptimized
                  />
                  <div className="lux-ai-slider-badge-row">
                    <span className="lux-ai-slider-verified">
                      <span>✓</span> Verified Pro
                    </span>
                    <span className="lux-ai-slider-rating">
                      ★ {Number(artist.rating).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="lux-ai-slider-card-body">
                  <h3 className="lux-ai-slider-artist-name">{artist.name}</h3>

                  <div className="lux-ai-slider-meta-row">
                    <span>{artist.category}</span>
                    <span>•</span>
                    <span className="lux-ai-slider-city">📍 {artist.city}</span>
                  </div>

                  <p className="lux-ai-slider-genres">
                    {artist.subCategory}
                  </p>

                  <div className="lux-ai-slider-pricing">
                    <span className="lux-ai-slider-rate">
                      Starts ₹{Number(artist.price_min).toLocaleString('en-IN')}
                    </span>
                    <span className="lux-ai-slider-badge-zero">0% Markup</span>
                  </div>

                  {/* Two Explicit Action Options: Book & View Details */}
                  <div className="lux-ai-slider-actions">
                    <button
                      type="button"
                      className="lux-ai-slider-btn-book"
                      onClick={() => handleBookArtist(artist.name, artist.category)}
                      aria-label={`Book ${artist.name}`}
                    >
                      <span>⚡ Book</span>
                    </button>
                    <Link
                      href={`/artist/${artist.slug || artist.id}`}
                      className="lux-ai-slider-btn-view"
                      aria-label={`View details of ${artist.name}`}
                    >
                      <span>View Details ➔</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Loading / Thinking State */}
        {isLoading && (
          <div className="lux-ai-thinking-card">
            <div className="lux-ai-thinking-spinner" />
            <h3 className="lux-ai-thinking-title">Deep AI Event Reasoning Active</h3>
            <p className="lux-ai-thinking-desc">
              Analyzing vibe, acoustic setup requirements, and cross-matching 1,500+ verified performers in database...
            </p>
            <div className="lux-ai-steps-list">
              {['🧠 Parsing Event Vibe', '📍 Scanning City Artists', '💰 Calculating Direct Rates', '🎙️ Generating Sound Rider'].map((step, i) => (
                <span key={step} className="lux-ai-step-pill" style={{ animationDelay: `${i * 0.18}s`, animation: 'fadeInUp 0.5s ease both' }}>
                  {step}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && results && (
          <div className="lux-ai-results-section">
            {/* AI Event Strategy Card */}
            {results.analysis && (
              <div className="lux-ai-strategy-card">
                <div className="lux-ai-strategy-header">
                  <h2 className="lux-ai-strategy-title">
                    <span>⚡ AI Event Curation Breakdown</span>
                  </h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {results.analysis.eventType && (
                      <span className="lux-ai-event-meta-badge">
                        {results.analysis.eventType}
                      </span>
                    )}
                    {results.analysis.detectedCity && (
                      <span className="lux-ai-event-meta-badge" style={{ borderColor: '#8B5CF6', color: '#c084fc' }}>
                        📍 {results.analysis.detectedCity}
                      </span>
                    )}
                  </div>
                </div>

                <div className="lux-ai-strategy-grid">
                  <div className="lux-ai-strategy-block">
                    <h4>✨ Event Vibe & Atmosphere</h4>
                    <p>{results.analysis.vibeSummary}</p>
                  </div>

                  <div className="lux-ai-strategy-block">
                    <h4>🎙️ Recommended Sound Setup</h4>
                    <p>{results.analysis.soundAdvice}</p>
                  </div>

                  <div className="lux-ai-strategy-block">
                    <h4>🎵 Suggested Setlist & Flow</h4>
                    <p>{results.analysis.setlistTips}</p>
                  </div>

                  <div className="lux-ai-strategy-block">
                    <h4>💎 0% Commission Budget Advantage</h4>
                    <p>{results.analysis.budgetGuidance}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 60% OFF Promo Banner */}
            <div className="lux-ai-promo-banner">
              <div className="lux-ai-promo-text">
                <span className="lux-ai-promo-icon">🎁</span>
                <div>
                  <h4 className="lux-ai-promo-title">Claim Up to 60% OFF First Booking Platform Fee</h4>
                  <p className="lux-ai-promo-subtitle">
                    Use code <strong>FIRSTEVENT60</strong> when finalizing your inquiry for matched artists today.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClaimOffer}
                className="lux-ai-claim-offer-btn"
              >
                Claim 60% OFF Now →
              </button>
            </div>

            {/* Recommended Artists Header */}
            <div className="lux-ai-artists-header">
              <h3>Verified Artists Matching Your AI Query</h3>
              <p>100% Direct artist pricing · No middleman markup · Backed by 100% Arrival Guarantee</p>
            </div>

            {/* Artists Grid */}
            <div className="lux-ai-artists-grid">
              {(() => {
                const displayArtists = (results.artists && results.artists.length > 0)
                  ? (results.artists.length < 5 
                      ? [...results.artists, ...DEFAULT_TOP_ARTISTS.filter(d => !results.artists.some(a => a.id === d.id || a.name === d.name))].slice(0, 6)
                      : results.artists)
                  : DEFAULT_TOP_ARTISTS;

                return displayArtists.map((artist) => (
                  <div key={artist.id} className="lux-ai-artist-card">
                    <div className="lux-ai-artist-thumb-wrap">
                      <Image
                        src={artist.img || "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/assets/lux-singer-session.webp"}
                        alt={artist.name}
                        width={400}
                        height={260}
                        className="lux-ai-artist-img"
                        unoptimized
                      />
                      <div className="lux-ai-artist-badge-row">
                        <span className="lux-ai-verified-tag">
                          <span>✓</span> Verified Pro
                        </span>
                        <span className="lux-ai-rating-tag">
                          ★ {artist.rating ? Number(artist.rating).toFixed(1) : "5.0"}
                        </span>
                      </div>
                    </div>

                    <div className="lux-ai-artist-card-body">
                      <h4 className="lux-ai-artist-name">{artist.name}</h4>
                      
                      <div className="lux-ai-artist-category-row">
                        <span>{artist.category}</span>
                        <span>•</span>
                        <span className="lux-ai-artist-city">📍 {artist.city || "India"}</span>
                      </div>

                      <p className="lux-ai-artist-genres">
                        {artist.subCategory || "Bollywood, Ghazals, Sufi, Live Performance"}
                      </p>

                      <div className="lux-ai-artist-pricing-box">
                        <span className="lux-ai-price-label">Direct Rate</span>
                        <span className="lux-ai-price-value">
                          ₹{artist.price_min ? Number(artist.price_min).toLocaleString('en-IN') : "10,000"} - ₹{artist.price_max ? Number(artist.price_max).toLocaleString('en-IN') : "25,000"}
                        </span>
                      </div>

                      <div className="lux-ai-artist-card-actions">
                        <button
                          type="button"
                          onClick={() => handleBookArtist(artist.name)}
                          className="lux-ai-card-btn primary"
                        >
                          Book Artist
                        </button>
                        <a
                          href={`https://wa.me/918076515257?text=Hi%20Magnevents!%20I%20found%20${encodeURIComponent(artist.name)}%20via%20AI%20Search%20and%20want%20to%20check%20video%20samples%20and%20availability.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lux-ai-card-btn secondary"
                        >
                          Samples / WA
                        </a>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* All Cities AI Exploration Section */}
        <AllCitiesSection 
          onCitySelect={(city) => {
            const cityPrompt = `Top verified live singers and bands in ${city.name} for event`;
            setQuery(cityPrompt);
            setSelectedCity(city.name);
            runAISearch(cityPrompt, city.name);
            window.scrollTo({ top: 120, behavior: 'smooth' });
          }}
        />

        {/* SEO FAQ Section */}
        <section className="lux-ai-faq-box">
          <h3 className="lux-ai-faq-title">Frequently Asked Questions About AI Musician Matching</h3>
          <div className="lux-ai-faq-grid">
            <div className="lux-ai-faq-item">
              <h5>How does the Magnevents AI Search engine work?</h5>
              <p>
                Our AI analyzes natural language event prompts, identifying your event type, required audio equipment rider, song setlists, and budget. It then queries verified performers from our nationwide database to provide curated recommendations with authentic pricing.
              </p>
            </div>
            <div className="lux-ai-faq-item">
              <h5>Can artists travel to Bhubaneswar, Cuttack, and other cities?</h5>
              <p>
                Yes! Over 80% of our verified live bands and singers perform outstation. Magnevents manages travel logistics, local transit, and stay accommodations end-to-end.
              </p>
            </div>
            <div className="lux-ai-faq-item">
              <h5>What is the 100% Artist Arrival Guarantee?</h5>
              <p>
                Every booking on Magnevents is backed by a legal contract and escrow security. In any unforeseen emergency, Magnevents guarantees an immediate verified replacement performer of equal or superior caliber at no extra cost.
              </p>
            </div>
            <div className="lux-ai-faq-item">
              <h5>Are sound systems and microphones included?</h5>
              <p>
                Our AI recommends the exact acoustic setup for your guest size. Magnevents provides complete professional stage audio, mixers, monitors, and an on-site sound engineer at special discounted rates.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AISearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a090e' }} />}>
      <AISearchContent />
    </Suspense>
  );
}
