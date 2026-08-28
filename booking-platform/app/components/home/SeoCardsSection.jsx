"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Music, Sparkles } from 'lucide-react';

const seoCards = [
  { title: "Wedding Singer in Delhi NCR", link: "/city/delhi-ncr", type: "wedding", subtext: "(New Delhi, Noida, Gurgaon, Ghaziabad, Faridabad)" },
  { title: "House Party Singer in Mumbai", link: "/city/mumbai", type: "party", subtext: "(Mumbai, Navi Mumbai, Thane, Andheri, Bandra)" },
  { title: "Live Singer in Bangalore", link: "/city/bangalore", type: "live", subtext: "(Indiranagar, Koramangala, Whitefield, HSR Layout)" },
  { title: "Corporate Event Singer in Pune", link: "/city/pune", type: "corporate", subtext: "(Koregaon Park, Viman Nagar, Hinjewadi, Baner)" },
  { title: "Sufi Singer in Hyderabad", link: "/city/hyderabad", type: "live", subtext: "(Banjara Hills, Jubilee Hills, HITEC City, Gachibowli)" },
  { title: "Birthday Party Singer in Kolkata", link: "/city/kolkata", type: "party", subtext: "(Salt Lake, New Town, Park Street, Ballygunge)" },
  { title: "Ghazal Singer in Lucknow", link: "/city/lucknow", type: "live", subtext: "(Gomti Nagar, Hazratganj, Aliganj)" },
  { title: "Wedding Reception Singer in Chennai", link: "/city/chennai", type: "wedding", subtext: "(Adyar, Anna Nagar, T Nagar, OMR)" },
  { title: "Private Event Singer in Goa", link: "/city/goa", type: "party", subtext: "(North Goa, South Goa, Panjim, Candolim)" },
  { title: "Acoustic Singer in Chandigarh", link: "/city/chandigarh", type: "live", subtext: "(Sector 17, Mohali, Zirakpur, Panchkula)" },
  { title: "Punjabi Singer in Amritsar", link: "/city/amritsar", type: "party", subtext: "(Ranjit Avenue, Civil Lines)" },
  { title: "Bollywood Singer in Jaipur", link: "/city/jaipur", type: "live", subtext: "(Malviya Nagar, Vaishali Nagar, C-Scheme)" },
];

export default function SeoCardsSection() {
  return (
    <section className="seo-cards-section">
      <div className="seo-cards-container">
        <div className="seo-cards-header">
          <h2>Find the Best Singers Across India</h2>
          <p>Book top-rated live musicians for your weddings, house parties, and corporate events in your city.</p>
        </div>
        
        <div className="seo-cards-grid">
          {seoCards.map((card, idx) => (
            <Link href={card.link} key={idx} className="seo-card group">
              <div className="seo-card-icon">
                {card.type === 'wedding' && <Sparkles size={24} />}
                {card.type === 'party' && <Music size={24} />}
                {card.type === 'live' && <MapPin size={24} />}
                {card.type === 'corporate' && <Music size={24} />}
              </div>
              <div className="seo-card-content">
                <h3>{card.title}</h3>
                {card.subtext && <p className="seo-card-subtext">{card.subtext}</p>}
                <span className="seo-card-link-text">Explore Artists →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .seo-cards-section {
          padding: 80px 20px;
          background: #0a0a0a;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .seo-cards-container {
          max-width: 1400px;
          margin: 0 auto;
        }
        .seo-cards-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .seo-cards-header h2 {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          color: #fff;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }
        .seo-cards-header p {
          color: rgba(255,255,255,0.6);
          font-size: clamp(16px, 2vw, 18px);
          max-width: 600px;
          margin: 0 auto;
        }
        .seo-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .seo-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .seo-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.2);
        }
        .seo-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.8);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .seo-card:hover .seo-card-icon {
          background: #6b00ff;
          color: #fff;
        }
        .seo-card-content {
          flex: 1;
        }
        .seo-card-content h3 {
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.4;
          margin: 0 0 4px 0;
        }
        .seo-card-subtext {
          color: rgba(255,255,255,0.4);
          font-size: 12px;
          font-weight: 500;
          margin: 0 0 12px 0;
          line-height: 1.5;
        }
        .seo-card-link-text {
          color: #6b00ff;
          font-size: 13px;
          font-weight: 600;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
          display: inline-block;
        }
        .seo-card:hover .seo-card-link-text {
          opacity: 1;
          transform: translateX(0);
        }
        @media (max-width: 768px) {
          .seo-cards-section { padding: 60px 16px; }
          .seo-card { padding: 20px; }
          .seo-card-content h3 { font-size: 15px; }
        }
      `}</style>
    </section>
  );
}
