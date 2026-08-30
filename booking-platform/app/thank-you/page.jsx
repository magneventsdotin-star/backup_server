"use client";

import React from 'react';
import Link from 'next/link';
import Script from 'next/script';

export default function ThankYouPage() {
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
      {/* End Google Tag Manager (noscript) */}
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080808',
        color: '#fff',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '2px solid #FFE032',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px',
            color: '#FFE032'
          }}>
            ✓
          </div>
          <h1 style={{ fontSize: '36px', marginBottom: '16px', fontFamily: 'var(--font-display, serif)' }}>
            Thank You!
          </h1>
          <p style={{ color: '#8a8f98', fontSize: '18px', lineHeight: '1.6', marginBottom: '32px' }}>
            Your booking request has been received. Our team will review your details and get back to you shortly with the perfect options for your event.
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '14px 28px',
            borderRadius: '16px',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}>
            Return to Home
          </Link>
        </div>
      </main>
    </>
  );
}
