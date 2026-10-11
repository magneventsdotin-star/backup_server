"use client";

import React from 'react';

export default function TrustEmblems() {
  const emblems = [
    {
      id: 'rank1',
      renderSvg: () => (
        <svg viewBox="0 0 100 112" width="94" height="106" className="hp-emblem-svg">
          <defs>
            <linearGradient id="shieldSilver" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#E2E8F0" />
              <stop offset="80%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="silverBorder" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="orangeRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.55" />
            </filter>
            <filter id="ribbonShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Shield Outer Body */}
          <path
            d="M 12 10 C 12 6, 16 3, 22 3 L 78 3 C 84 3, 88 6, 88 10 L 88 56 C 88 78, 50 104, 50 104 C 50 104, 12 78, 12 56 Z"
            fill="url(#shieldSilver)"
            stroke="url(#silverBorder)"
            strokeWidth="2.5"
            filter="url(#badgeShadow)"
          />

          {/* Shield Inner Inset Line */}
          <path
            d="M 16 12 L 84 12 L 84 55 C 84 74, 50 97, 50 97 C 50 97, 16 74, 16 55 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeOpacity="0.8"
          />

          {/* Top Main Stat */}
          <text x="50" y="32" textAnchor="middle" fill="#0F172A" fontSize="22" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="-0.02em">
            #1
          </text>

          {/* 3D Ribbon Banner */}
          {/* Ribbon Fold Tails */}
          <path d="M 6 43 L 13 38 L 13 54 L 6 49 Z" fill="#9A3412" />
          <path d="M 94 43 L 87 38 L 87 54 L 94 49 Z" fill="#9A3412" />

          {/* Ribbon Main Body */}
          <path
            d="M 10 39 L 90 39 L 88 54 L 12 54 Z"
            fill="url(#orangeRibbon)"
            filter="url(#ribbonShadow)"
          />
          <text x="50" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.04em">
            IN DELHI &amp; NCR
          </text>

          {/* Bottom Subtext */}
          <text x="50" y="70" textAnchor="middle" fill="#334155" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
            Live Music Platform
          </text>
          <text x="50" y="81" textAnchor="middle" fill="#64748B" fontSize="7" fontWeight="600" fontFamily="system-ui, sans-serif">
            Magnevents
          </text>
        </svg>
      )
    },
    {
      id: 'rating',
      renderSvg: () => (
        <svg viewBox="0 0 100 112" width="94" height="106" className="hp-emblem-svg">
          <defs>
            <linearGradient id="goldHexBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF7" />
              <stop offset="40%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
            <linearGradient id="goldBorder" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="darkGoldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="50%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>

          {/* Hexagon Shape */}
          <path
            d="M 50 4 L 88 23 L 88 77 L 50 96 L 12 77 L 12 23 Z"
            fill="url(#goldHexBg)"
            stroke="url(#goldBorder)"
            strokeWidth="3"
            filter="url(#badgeShadow)"
          />

          <path
            d="M 50 8 L 84 25 L 84 75 L 50 92 L 16 75 L 16 25 Z"
            fill="none"
            stroke="#D97706"
            strokeWidth="1"
            strokeOpacity="0.4"
          />

          {/* Top Rating */}
          <text x="50" y="32" textAnchor="middle" fill="#78350F" fontSize="19" fontWeight="900" fontFamily="system-ui, sans-serif">
            ★ 4.9
          </text>

          {/* Ribbon */}
          <path d="M 6 43 L 13 38 L 13 54 L 6 49 Z" fill="#451A03" />
          <path d="M 94 43 L 87 38 L 87 54 L 94 49 Z" fill="#451A03" />
          <path
            d="M 10 39 L 90 39 L 88 54 L 12 54 Z"
            fill="url(#darkGoldRibbon)"
            filter="url(#ribbonShadow)"
          />
          <text x="50" y="50" textAnchor="middle" fill="#FEF08A" fontSize="9" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="0.05em">
            GOOGLE RATED
          </text>

          {/* Bottom Subtext */}
          <text x="50" y="69" textAnchor="middle" fill="#78350F" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
            1,200+ Reviews
          </text>
          <text x="50" y="80" textAnchor="middle" fill="#92400E" fontSize="7" fontWeight="600" fontFamily="system-ui, sans-serif">
            Top Rated Service
          </text>
        </svg>
      )
    },
    {
      id: 'verified',
      renderSvg: () => (
        <svg viewBox="0 0 100 112" width="94" height="106" className="hp-emblem-svg">
          <defs>
            <linearGradient id="shieldNavy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="navyBorder" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="yellowRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CA8A04" />
              <stop offset="50%" stopColor="#E8B943" />
              <stop offset="100%" stopColor="#A16207" />
            </linearGradient>
          </defs>

          {/* Shield Body */}
          <path
            d="M 12 10 C 12 6, 16 3, 22 3 L 78 3 C 84 3, 88 6, 88 10 L 88 56 C 88 78, 50 104, 50 104 C 50 104, 12 78, 12 56 Z"
            fill="url(#shieldNavy)"
            stroke="url(#navyBorder)"
            strokeWidth="2.5"
            filter="url(#badgeShadow)"
          />

          <path
            d="M 16 12 L 84 12 L 84 55 C 84 74, 50 97, 50 97 C 50 97, 16 74, 16 55 Z"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1"
            strokeOpacity="0.4"
          />

          {/* Top Stat */}
          <text x="50" y="32" textAnchor="middle" fill="#38BDF8" fontSize="20" fontWeight="900" fontFamily="system-ui, sans-serif">
            100%
          </text>

          {/* Ribbon */}
          <path d="M 6 43 L 13 38 L 13 54 L 6 49 Z" fill="#713F12" />
          <path d="M 94 43 L 87 38 L 87 54 L 94 49 Z" fill="#713F12" />
          <path
            d="M 10 39 L 90 39 L 88 54 L 12 54 Z"
            fill="url(#yellowRibbon)"
            filter="url(#ribbonShadow)"
          />
          <text x="50" y="50" textAnchor="middle" fill="#0F172A" fontSize="9.5" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="0.05em">
            VERIFIED
          </text>

          {/* Bottom Subtext */}
          <text x="50" y="70" textAnchor="middle" fill="#F8FAFC" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
            Arrival Guarantee
          </text>
          <text x="50" y="81" textAnchor="middle" fill="#94A3B8" fontSize="7" fontWeight="600" fontFamily="system-ui, sans-serif">
            Instant Replacement
          </text>
        </svg>
      )
    },
    {
      id: 'shows',
      renderSvg: () => (
        <svg viewBox="0 0 100 112" width="94" height="106" className="hp-emblem-svg">
          <defs>
            <linearGradient id="shieldWine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A1D2B" />
              <stop offset="50%" stopColor="#2D111A" />
              <stop offset="100%" stopColor="#1A0A10" />
            </linearGradient>
            <linearGradient id="wineBorder" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="50%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
            <linearGradient id="coralRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E11D48" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
          </defs>

          {/* Shield Body */}
          <path
            d="M 12 10 C 12 6, 16 3, 22 3 L 78 3 C 84 3, 88 6, 88 10 L 88 56 C 88 78, 50 104, 50 104 C 50 104, 12 78, 12 56 Z"
            fill="url(#shieldWine)"
            stroke="url(#wineBorder)"
            strokeWidth="2.5"
            filter="url(#badgeShadow)"
          />

          <path
            d="M 16 12 L 84 12 L 84 55 C 84 74, 50 97, 50 97 C 50 97, 16 74, 16 55 Z"
            fill="none"
            stroke="#FDA4AF"
            strokeWidth="1"
            strokeOpacity="0.4"
          />

          {/* Top Stat */}
          <text x="50" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900" fontFamily="system-ui, sans-serif">
            2,500+
          </text>

          {/* Ribbon */}
          <path d="M 6 43 L 13 38 L 13 54 L 6 49 Z" fill="#4C0519" />
          <path d="M 94 43 L 87 38 L 87 54 L 94 49 Z" fill="#4C0519" />
          <path
            d="M 10 39 L 90 39 L 88 54 L 12 54 Z"
            fill="url(#coralRibbon)"
            filter="url(#ribbonShadow)"
          />
          <text x="50" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="0.04em">
            SHOWS DONE
          </text>

          {/* Bottom Subtext */}
          <text x="50" y="70" textAnchor="middle" fill="#FFE4E6" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
            Weddings &amp; Parties
          </text>
          <text x="50" y="81" textAnchor="middle" fill="#FDA4AF" fontSize="7" fontWeight="600" fontFamily="system-ui, sans-serif">
            Pan-India Network
          </text>
        </svg>
      )
    },
    {
      id: 'directPricing',
      renderSvg: () => (
        <svg viewBox="0 0 100 112" width="94" height="106" className="hp-emblem-svg">
          <defs>
            <linearGradient id="goldShieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#422006" />
              <stop offset="50%" stopColor="#291303" />
              <stop offset="100%" stopColor="#170A02" />
            </linearGradient>
            <linearGradient id="goldBorder2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#E8B943" />
              <stop offset="100%" stopColor="#854D0E" />
            </linearGradient>
            <linearGradient id="goldRibbon2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CA8A04" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#A16207" />
            </linearGradient>
          </defs>

          {/* Hexagon Body */}
          <path
            d="M 50 4 L 88 23 L 88 77 L 50 96 L 12 77 L 12 23 Z"
            fill="url(#goldShieldBg)"
            stroke="url(#goldBorder2)"
            strokeWidth="3"
            filter="url(#badgeShadow)"
          />

          <path
            d="M 50 8 L 84 25 L 84 75 L 50 92 L 16 75 L 16 25 Z"
            fill="none"
            stroke="#FEF08A"
            strokeWidth="1"
            strokeOpacity="0.4"
          />

          {/* Top Stat */}
          <text x="50" y="32" textAnchor="middle" fill="#FDE047" fontSize="20" fontWeight="900" fontFamily="system-ui, sans-serif">
            0%
          </text>

          {/* Ribbon */}
          <path d="M 6 43 L 13 38 L 13 54 L 6 49 Z" fill="#451A03" />
          <path d="M 94 43 L 87 38 L 87 54 L 94 49 Z" fill="#451A03" />
          <path
            d="M 10 39 L 90 39 L 88 54 L 12 54 Z"
            fill="url(#goldRibbon2)"
            filter="url(#ribbonShadow)"
          />
          <text x="50" y="50" textAnchor="middle" fill="#1C1917" fontSize="9.5" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="0.04em">
            NO MARKUP
          </text>

          {/* Bottom Subtext */}
          <text x="50" y="69" textAnchor="middle" fill="#FEF08A" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">
            Direct Artist Rates
          </text>
          <text x="50" y="80" textAnchor="middle" fill="#FDE68A" fontSize="7" fontWeight="600" fontFamily="system-ui, sans-serif">
            Zero Agency Fees
          </text>
        </svg>
      )
    }
  ];

  return (
    <div className="hp-emblems-row" aria-label="Awards and trust credentials">
      {emblems.map((emblem) => (
        <div key={emblem.id} className="hp-emblem-item">
          {emblem.renderSvg()}
        </div>
      ))}
    </div>
  );
}
