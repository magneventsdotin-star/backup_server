"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { footerSeoKeywords as keywords } from '@/app/constants/seoKeywords';

export default function SeoKeywordFooter() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <footer className="seo-keyword-footer" aria-label="Popular Search Queries">
      <div 
        className={`seo-keyword-container ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
        id="seo-keyword-list"
      >
        {keywords.map((keyword, index) => (
          <React.Fragment key={index}>
            <Link href={`/${keyword.replace(/ /g, '-')}`} className="seo-keyword">
              {keyword}
            </Link>
            {index < keywords.length - 1 && <span className="seo-separator">|</span>}
          </React.Fragment>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="seo-toggle-btn"
        aria-expanded={isExpanded}
        aria-controls="seo-keyword-list"
        aria-label={isExpanded ? "Collapse popular searches" : "Expand all popular searches"}
      >
        <span className="seo-toggle-text">
          {isExpanded ? "Show Less" : "Popular Searches"}
        </span>
        <svg
          className={`seo-toggle-icon ${isExpanded ? 'is-rotated' : ''}`}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </footer>
  );
}

