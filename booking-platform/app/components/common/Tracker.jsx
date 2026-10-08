'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Maintain persistent session across tabs/pages
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }

    // Extract UTM parameters
    const utm = {};
    if (searchParams) {
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
        const val = searchParams.get(key);
        if (val) utm[key.replace('utm_', '')] = val;
      });
    }

    // Extract client-side environment & screen metrics
    const screenWidth = window.screen?.width || 0;
    const screenHeight = window.screen?.height || 0;
    const viewportWidth = window.innerWidth || 0;
    const viewportHeight = window.innerHeight || 0;

    // Check cached location if already detected
    let cachedLocation = null;
    try {
      const stored = sessionStorage.getItem('magnevents_user_location');
      if (stored) cachedLocation = JSON.parse(stored);
    } catch (e) {}

    const payload = {
      path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
      type: 'page_view',
      userAgent: window.navigator?.userAgent || '',
      sessionId,
      clientDetails: {
        screen: screenWidth && screenHeight ? `${screenWidth}x${screenHeight}` : '',
        viewport: viewportWidth && viewportHeight ? `${viewportWidth}x${viewportHeight}` : '',
        pixelRatio: window.devicePixelRatio || 1,
        language: window.navigator?.language || '',
        languages: window.navigator?.languages || [],
        platform: window.navigator?.platform || '',
        referrer: document.referrer || '',
        fullUrl: window.location?.href || '',
        timezone: Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone || '',
        network: navigator?.connection?.effectiveType || '',
        utm
      },
      clientLocation: cachedLocation
    };

    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch((err) => {
      // Non-blocking catch
      console.warn('Analytics ping skipped:', err?.message || err);
    });

  }, [pathname, searchParams]);

  return null;
}
