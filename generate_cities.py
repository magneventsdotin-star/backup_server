import json
import random

cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
    'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Ranchi', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar',
    'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Howrah', 'Gwalior', 'Jabalpur',
    'Coimbatore', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli-Dharwad',
    'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Tiruppur', 'Gurgaon', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem',
    'Warangal', 'Mira-Bhayandar', 'Jalgaon', 'Guntur', 'Thiruvananthapuram', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati',
    'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur',
    'Asansol', 'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni',
    'Siliguri', 'Jhansi', 'Ulhasnagar', 'Nellore', 'Jammu', 'Sangli-Miraj & Kupwad', 'Mangalore', 'Erode', 'Belgaum', 'Ambattur',
    'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtala', 'Davanagere', 'Kozhikode', 'Kurnool', 'Rajpur Sonarpur',
    'Rajahmundry', 'Bokaro', 'South Dumdum', 'Bellary', 'Patiala', 'Gopalpur', 'Agartala', 'Bhagalpur', 'Muzaffarnagar', 'Bhatpara',
    'Panihati', 'Latur', 'Dhule', 'Tirupati', 'Rohtak', 'Korba', 'Bhilwara', 'Berhampur', 'Muzaffarpur', 'Ahmednagar',
    'Mathura', 'Kollam', 'Avadi', 'Kadapa', 'Kamarhati', 'Sambalpur', 'Bilaspur', 'Shahjahanpur', 'Satara', 'Bijapur',
    'Rampur', 'Shivamogga', 'Chandrapur', 'Junagadh', 'Thrissur', 'Alwar', 'Bardhaman', 'Kulti', 'Kakinada', 'Nizamabad',
    'Parbhani', 'Tumkur', 'Khammam', 'Ozhukarai', 'Bihar Sharif', 'Panipat', 'Darbhanga', 'Bally', 'Aizawl', 'Dewas',
    'Ichalkaranji', 'Karnal', 'Bathinda', 'Jalna', 'Eluru', 'Barasat', 'Kirari Suleman Nagar', 'Purnia', 'Satna', 'Mau',
    'Sonipat', 'Farrukhabad', 'Sagar', 'Rourkela', 'Durg', 'Imphal', 'Ratlam', 'Hapur', 'Anantapur', 'Arrah',
    'Karimnagar', 'Etawah', 'Ambernath', 'North Dumdum', 'Bharatpur', 'Begusarai', 'New Delhi', 'Gandhidham', 'Baranagar', 'Tiruvottiyur',
    'Puducherry', 'Sikar', 'Thoothukudi', 'Rewa', 'Mirzapur', 'Raichur', 'Pali', 'Ramagundam', 'Silchar', 'Haridwar',
    'Vijayanagaram', 'Tenali', 'Nagercoil', 'Sri Ganganagar', 'Karawal Nagar', 'Mango', 'Thanjavur', 'Bulandshahr', 'Uluberia', 'Katni',
    'Sambhal', 'Singrauli', 'Nadiad', 'Secunderabad', 'Naihati', 'Yamunanagar', 'Bidhannagar', 'Pallavaram', 'Bidar', 'Munger',
    'Panchkula', 'Burhanpur', 'Raurkela Industrial Township', 'Kharagpur', 'Dindigul', 'Gandhinagar', 'Hospet', 'Nangloi Jat', 'Malda', 'Ongole',
    'Deoghar', 'Chapra', 'Haldia', 'Khandwa', 'Nandyal', 'Morena', 'Amroha', 'Anand', 'Bhind', 'Bhalswa Jahangir Pur',
    'Madhyamgram', 'Bhiwani', 'Berhampore', 'Ambala', 'Morbi', 'Fatehpur', 'Raebareli', 'Khora', 'Chittoor', 'Bhusawal'
]

types = ['wedding', 'party', 'live', 'corporate']

prefixes = {
    'wedding': ['Wedding Singer in', 'Wedding Band in', 'Sangeet Singer in', 'Shaadi Singer in', 'Wedding Musicians in'],
    'party': ['House Party Singer in', 'Birthday Singer in', 'Private Event Singer in', 'Punjabi Singer in', 'Bollywood Singer in'],
    'live': ['Live Singer in', 'Acoustic Singer in', 'Sufi Singer in', 'Ghazal Singer in', 'Live Music in', 'Live Band in'],
    'corporate': ['Corporate Event Singer in', 'Corporate Singer in', 'Corporate Musician in', 'Singer for Events in']
}

cards = []
seen = set()

for city in cities:
    if city in seen:
        continue
    seen.add(city)
    
    t = random.choice(types)
    title = random.choice(prefixes[t]) + ' ' + city
    
    slug = city.lower().replace(' ', '-').replace('&', 'and')
    
    card = {
        'title': title,
        'link': f'/city/{slug}',
        'type': t,
        'subtext': ''
    }
    cards.append(card)

# Let's generate the JSX content
jsx = """\"use client\";

import React from 'react';
import Link from 'next/link';
import { MapPin, Music, Sparkles } from 'lucide-react';

const seoCards = """ + json.dumps(cards, indent=2) + """;

export default function SeoCardsSection() {
  return (
    <section className="seo-cards-section">
      <div className="seo-cards-container">
        <div className="seo-cards-header">
          <h2>Find the Best Singers Across India</h2>
          <p>Book top-rated live musicians for your weddings, house parties, and corporate events in any city.</p>
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
          padding: 0 10px;
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
"""

with open('booking-platform/app/components/home/SeoCardsSection.jsx', 'w', encoding='utf-8') as f:
    f.write(jsx)
