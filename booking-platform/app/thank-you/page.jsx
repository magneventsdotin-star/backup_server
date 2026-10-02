"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';

export default function ThankYouPage() {
  const [waLink, setWaLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLink = localStorage.getItem('magnevents-last-lead-wa');
      if (savedLink) {
        setWaLink(savedLink);
      } else {
        setWaLink('https://wa.me/917355931587?text=Hi%20Magnevents!%20I%20just%20submitted%20a%20booking%20request%20on%20your%20website.');
      }
    }
  }, []);

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-F1VERBXK87" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-F1VERBXK87');
        `}
      </Script>
      {/* Event snippet for Submit lead form (1) conversion page */}
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {'send_to': 'AW-16657289873/-Hl8CMKBmdUcEJGl6IY-'});
        `}
      </Script>
      {/* Event snippet for Submit lead form Av conversion page */}
      <Script id="google-ads-conversion-av" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
              'send_to': 'AW-16657289873/9sBzCMry1eocEJGl6IY-',
              'value': 1.0,
              'currency': 'INR'
          });
        `}
      </Script>
      {/* End Google Tag Manager (noscript) */}
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080808',
        color: '#fff',
        padding: '24px 16px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '560px', width: '100%' }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '2px solid #10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '36px',
            color: '#10b981',
            background: 'rgba(16, 185, 129, 0.1)',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)'
          }}>
            ✓
          </div>
          <h1 style={{ fontSize: '36px', marginBottom: '12px', fontFamily: 'var(--font-display, serif)', color: '#ffffff' }}>
            Inquiry Received!
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', marginBottom: '28px' }}>
            Your details have been registered. For faster quotes and artist video samples, connect directly on WhatsApp with our booking team.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  maxWidth: '380px',
                  background: '#25D366',
                  color: '#ffffff',
                  padding: '16px 24px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '15px',
                  boxShadow: '0 8px 24px -4px rgba(37, 211, 102, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.437 0 9.857-4.403 9.86-9.809.001-2.618-1.01-5.08-2.858-6.93C16.528 2.015 14.07 1.006 11.453 1.006c-5.434 0-9.852 4.403-9.855 9.81-.001 2.062.54 4.079 1.566 5.86l-.99 3.613 3.712-.977zm11.304-6.816c-.302-.15-1.788-.882-2.066-.983-.277-.101-.478-.15-.678.15-.2.3-.775.983-.95 1.185-.175.201-.35.227-.652.076-.302-.15-1.274-.469-2.427-1.498-.897-.8-1.502-1.788-1.678-2.09-.175-.302-.019-.465.132-.615.136-.135.302-.35.454-.526.15-.176.2-.302.302-.503.101-.2.05-.376-.026-.526-.075-.15-.678-1.636-.93-2.243-.244-.59-.493-.51-.678-.518-.176-.008-.377-.01-.578-.01-.2 0-.527.075-.803.376-.277.301-1.055 1.031-1.055 2.516 0 1.485 1.079 2.921 1.229 3.122.15.2 2.125 3.245 5.148 4.549.719.311 1.28.497 1.717.637.722.23 1.38.197 1.901.12.58-.087 1.788-.73 2.04-1.435.252-.703.252-1.306.176-1.435-.076-.13-.277-.201-.578-.352z"/>
                </svg>
                <span>Fast-Track on WhatsApp</span>
              </a>
            )}

            <Link href="/" style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '12px 24px',
              borderRadius: '12px',
              color: '#cbd5e1',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}>
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
