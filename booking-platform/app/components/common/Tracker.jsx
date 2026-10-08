'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Maintain persistent session ID across tabs/pages
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }

    // 2. Extract UTM & Ad parameters from current URL
    const currentParams = {};
    if (searchParams) {
      const keysToCheck = [
        // UTM
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
        // Ad Click IDs
        'gclid', 'fbclid', 'wbraid', 'gbraid', 'msclkid', 'ttclid', 'twclid',
        // Custom campaign & ad IDs
        'campaign_id', 'campaign', 'ad_id', 'adid', 'adset_id', 'src'
      ];

      keysToCheck.forEach((key) => {
        const val = searchParams.get(key);
        if (val) currentParams[key] = val;
      });
    }

    // Check if current URL brought ad/campaign params
    const hasNewAdParams = Object.keys(currentParams).length > 0;
    let storedCampaign = null;

    try {
      if (hasNewAdParams) {
        // Store in sessionStorage so all subsequent page views in this session preserve the ad attribution
        sessionStorage.setItem('magnevents_ad_campaign', JSON.stringify(currentParams));
        storedCampaign = currentParams;
      } else {
        // If not in URL, read from session (user navigating to 2nd or 3rd page after clicking ad)
        const cached = sessionStorage.getItem('magnevents_ad_campaign');
        if (cached) storedCampaign = JSON.parse(cached);
      }
    } catch (e) {}

    const campaignParams = storedCampaign || currentParams;

    // 3. Extract client-side environment & screen metrics
    const screenWidth = window.screen?.width || 0;
    const screenHeight = window.screen?.height || 0;
    const viewportWidth = window.innerWidth || 0;
    const viewportHeight = window.innerHeight || 0;

    // 4. Check cached location if already detected
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
        // Ad & Campaign Intelligence
        campaignParams
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
      console.warn('Analytics ping skipped:', err?.message || err);
    });

  }, [pathname, searchParams]);

  return null;
}
