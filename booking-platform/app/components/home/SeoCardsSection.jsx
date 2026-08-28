"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Music, Sparkles } from 'lucide-react';

const seoCards = [
  { title: "Wedding Singer in Delhi NCR", link: "/city/delhi-ncr", type: "wedding", subtext: "(New Delhi, Noida, Gurgaon, Ghaziabad, Faridabad)" },
  { title: "House Party Singer in Mumbai", link: "/city/mumbai", type: "party", subtext: "(Mumbai, Navi Mumbai, Thane, Andheri, Bandra)" },
  { title: "Live Singer in Bangalore", link: "/city/bangalore", type: "live", subtext: "(Indiranagar, Koramangala, Whitefield, HSR Layout)" },
  { title: "Corporate Event Singer in Pune", link: "/city/pune", type: "corporate", subtext: "(Koregaon Park, Viman Nagar, Hinjewadi, Baner)" },
  { title: "Sufi Singer in Hyderabad", link: "/city/hyderabad", type: "live", subtext: "(Banjara Hills, Jubilee Hills, HITEC City)" },
  { title: "Birthday Party Singer in Kolkata", link: "/city/kolkata", type: "party", subtext: "(Salt Lake, New Town, Park Street)" },
  { title: "Ghazal Singer in Lucknow", link: "/city/lucknow", type: "live", subtext: "(Gomti Nagar, Hazratganj)" },
  { title: "Wedding Reception Singer in Chennai", link: "/city/chennai", type: "wedding", subtext: "(Adyar, Anna Nagar, T Nagar)" },
  { title: "Private Event Singer in Goa", link: "/city/goa", type: "party", subtext: "(North Goa, South Goa)" },
  { title: "Acoustic Singer in Chandigarh", link: "/city/chandigarh", type: "live", subtext: "(Sector 17, Mohali, Zirakpur)" },
  { title: "Punjabi Singer in Amritsar", link: "/city/amritsar", type: "party", subtext: "(Ranjit Avenue)" },
  { title: "Bollywood Singer in Jaipur", link: "/city/jaipur", type: "live", subtext: "(Malviya Nagar, C-Scheme)" },
  { title: "Wedding Singer in Ahmedabad", link: "/city/ahmedabad", type: "wedding", subtext: "(Vastrapur, SG Highway)" },
  { title: "Live Band in Surat", link: "/city/surat", type: "live", subtext: "(Vesu, Adajan)" },
  { title: "Corporate Singer in Indore", link: "/city/indore", type: "corporate", subtext: "(Vijay Nagar, Palasia)" },
  { title: "House Party Singer in Bhopal", link: "/city/bhopal", type: "party", subtext: "(Arera Colony, MP Nagar)" },
  { title: "Singer for Events in Patna", link: "/city/patna", type: "live", subtext: "(Boring Road, Kankarbagh)" },
  { title: "Live Music in Vadodara", link: "/city/vadodara", type: "live", subtext: "(Alkapuri, Akota)" },
  { title: "Wedding Singer in Ludhiana", link: "/city/ludhiana", type: "wedding", subtext: "(Sarabha Nagar, Model Town)" },
  { title: "Birthday Singer in Agra", link: "/city/agra", type: "party", subtext: "(Tajganj, Sikandra)" },
  { title: "Ghazal Singer in Varanasi", link: "/city/varanasi", type: "live", subtext: "(Lanka, Bhelupur)" },
  { title: "Live Singer in Kanpur", link: "/city/kanpur", type: "live", subtext: "(Swaroop Nagar, Kakadeo)" },
  { title: "Wedding Band in Nagpur", link: "/city/nagpur", type: "wedding", subtext: "(Dharampeth, Sadar)" },
  { title: "Private Event Singer in Rajkot", link: "/city/rajkot", type: "party", subtext: "(Kalawad Road, Amin Marg)" },
  { title: "Acoustic Singer in Dehradun", link: "/city/dehradun", type: "live", subtext: "(Rajpur Road, Clement Town)" },
  { title: "Sufi Singer in Jodhpur", link: "/city/jodhpur", type: "live", subtext: "(Sardarpura, Ratanada)" },
  { title: "Live Band in Udaipur", link: "/city/udaipur", type: "live", subtext: "(Fateh Sagar, City Palace)" },
  { title: "Corporate Singer in Kochi", link: "/city/kochi", type: "corporate", subtext: "(Marine Drive, Edappally)" },
  { title: "House Party Singer in Trivandrum", link: "/city/trivandrum", type: "party", subtext: "(Kowdiar, Sasthamangalam)" },
  { title: "Singer for Events in Madurai", link: "/city/madurai", type: "live", subtext: "(Anna Nagar, KK Nagar)" },
  { title: "Wedding Singer in Coimbatore", link: "/city/coimbatore", type: "wedding", subtext: "(RS Puram, Peelamedu)" },
  { title: "Birthday Singer in Mysore", link: "/city/mysore", type: "party", subtext: "(Gokulam, Jayalakshmipuram)" },
  { title: "Live Music in Mangalore", link: "/city/mangalore", type: "live", subtext: "(Kadri, Bejai)" },
  { title: "Ghazal Singer in Allahabad", link: "/city/allahabad", type: "live", subtext: "(Civil Lines, George Town)" },
  { title: "Wedding Band in Ranchi", link: "/city/ranchi", type: "wedding", subtext: "(Kanke Road, Morabadi)" },
  { title: "Private Event Singer in Jamshedpur", link: "/city/jamshedpur", type: "party", subtext: "(Bistupur, Sakchi)" },
  { title: "Acoustic Singer in Guwahati", link: "/city/guwahati", type: "live", subtext: "(GS Road, Zoo Road)" },
  { title: "Live Singer in Bhubaneswar", link: "/city/bhubaneswar", type: "live", subtext: "(Patia, Jaydev Vihar)" },
  { title: "Sufi Singer in Raipur", link: "/city/raipur", type: "live", subtext: "(Shankar Nagar, Civil Lines)" },
  { title: "Corporate Singer in Visakhapatnam", link: "/city/visakhapatnam", type: "corporate", subtext: "(MVP Colony, Siripuram)" },
  { title: "House Party Singer in Vijayawada", link: "/city/vijayawada", type: "party", subtext: "(Benz Circle, Patamata)" },
  { title: "Singer for Events in Guntur", link: "/city/guntur", type: "live", subtext: "(Brodipet, Arundelpet)" },
  { title: "Wedding Singer in Jalandhar", link: "/city/jalandhar", type: "wedding", subtext: "(Model Town, Adarsh Nagar)" },
  { title: "Birthday Singer in Patiala", link: "/city/patiala", type: "party", subtext: "(Bhupindra Road, Leela Bhawan)" },
  { title: "Live Music in Bathinda", link: "/city/bathinda", type: "live", subtext: "(Model Town, Ajit Road)" },
  { title: "Ghazal Singer in Rohtak", link: "/city/rohtak", type: "live", subtext: "(Model Town, Delhi Road)" },
  { title: "Wedding Band in Hisar", link: "/city/hisar", type: "wedding", subtext: "(Model Town, Urban Estate)" },
  { title: "Private Event Singer in Panipat", link: "/city/panipat", type: "party", subtext: "(Model Town, HUDA)" },
  { title: "Acoustic Singer in Karnal", link: "/city/karnal", type: "live", subtext: "(Model Town, Sector 13)" },
  { title: "Live Singer in Ambala", link: "/city/ambala", type: "live", subtext: "(Ambala Cantt, Model Town)" }
];

export default function SeoCardsSection() {
  return (
    <section className="seo-cards-section">
      <div className="seo-cards-container">
        <div className="seo-cards-header">
          <h2>Find the Best Singers Across India</h2>
          <p>Book top-rated live musicians for your weddings, house parties, and corporate events in your city.</p>
        </div>
        
        <div className="seo-cards-scroll-wrapper">
          <div className="seo-cards-flex">
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
        .seo-cards-scroll-wrapper {
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          padding-bottom: 24px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          /* Hide scrollbar for Chrome, Safari and Opera */
          &::-webkit-scrollbar {
            height: 8px;
          }
          &::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
          }
          &::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        }
        .seo-cards-flex {
          display: flex;
          gap: 20px;
          width: max-content;
          padding: 0 10px; /* Slight padding for smooth edge scroll */
        }
        .seo-card {
          width: 320px;
          scroll-snap-align: start;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          text-decoration: none;
          transition: all 0.3s ease;
          flex-shrink: 0;
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
          .seo-card { width: 280px; padding: 20px; }
          .seo-card-content h3 { font-size: 15px; }
        }
      `}</style>
    </section>
  );
}
