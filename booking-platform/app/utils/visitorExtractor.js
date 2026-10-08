/**
 * Visitor Extractor Utility
 * Extracts client IP, locality (city, state, country, coords, ISP),
 * and user details (device, browser, OS, screen, referrer, bot detection).
 */

// In-memory cache for IP Geolocation with TTL to prevent duplicate API lookups
const ipGeoCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 5000;

/**
 * Checks if an IP is a local or private address
 */
export function isPrivateIp(ip) {
  if (!ip) return true;
  const cleanIp = ip.replace(/^::ffff:/, '').trim();
  return (
    cleanIp === '127.0.0.1' ||
    cleanIp === '::1' ||
    cleanIp === 'localhost' ||
    cleanIp.startsWith('10.') ||
    cleanIp.startsWith('192.168.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(cleanIp) ||
    cleanIp.startsWith('fc00:') ||
    cleanIp.startsWith('fe80:')
  );
}

/**
 * Extracts the real client IP address from request headers
 */
export function extractClientIp(req, clientProvidedIp = '') {
  const headers = req.headers;

  // 1. Cloudflare connecting IP
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp && !isPrivateIp(cfIp)) return cfIp.trim();

  // 2. True-Client-IP (Cloudflare Enterprise / Akamai)
  const trueClientIp = headers.get('true-client-ip');
  if (trueClientIp && !isPrivateIp(trueClientIp)) return trueClientIp.trim();

  // 3. X-Real-IP (Nginx / reverse proxy)
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp && !isPrivateIp(xRealIp)) return xRealIp.trim();

  // 4. X-Forwarded-For (comma-separated list, first public IP is the client)
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((s) => s.trim().replace(/^::ffff:/, ''));
    for (const ip of ips) {
      if (!isPrivateIp(ip)) {
        return ip;
      }
    }
    if (ips[0]) return ips[0];
  }

  // 5. X-Client-IP
  const xClientIp = headers.get('x-client-ip');
  if (xClientIp && !isPrivateIp(xClientIp)) return xClientIp.trim();

  // 6. Next.js / Node req.ip
  if (req.ip && !isPrivateIp(req.ip)) return req.ip;

  // 7. Client provided IP (e.g. from frontend fallback)
  if (clientProvidedIp && !isPrivateIp(clientProvidedIp)) return clientProvidedIp.trim();

  // 8. If in local development or behind local proxy, return first available or localhost
  return cfIp || xRealIp || forwardedFor?.split(',')[0]?.trim() || req.ip || '127.0.0.1';
}

/**
 * Extracts locality details (city, region, country, postal, lat, lng, ISP, timezone)
 * from Edge CDN headers or IP Geolocation lookup
 */
export async function extractLocality(req, ip, clientLocation = null) {
  const headers = req.headers;

  // 1. Check Vercel Edge Headers (0ms latency, zero API rate limit)
  const vercelCity = headers.get('x-vercel-ip-city');
  const vercelCountry = headers.get('x-vercel-ip-country');
  const vercelRegion = headers.get('x-vercel-ip-country-region');
  const vercelLat = headers.get('x-vercel-ip-latitude');
  const vercelLon = headers.get('x-vercel-ip-longitude');
  const vercelTz = headers.get('x-vercel-ip-timezone');

  // 2. Check Cloudflare Edge Headers
  const cfCity = headers.get('cf-ipcity');
  const cfCountry = headers.get('cf-ipcountry');
  const cfRegion = headers.get('cf-region');
  const cfPostal = headers.get('cf-postal-code');
  const cfTz = headers.get('cf-timezone');
  const cfLat = headers.get('cf-iplatitude');
  const cfLon = headers.get('cf-iplongitude');

  let city = vercelCity ? decodeSafe(vercelCity) : (cfCity || '');
  let country = vercelCountry || cfCountry || '';
  let region = vercelRegion ? decodeSafe(vercelRegion) : (cfRegion || '');
  let postal = cfPostal || '';
  let latitude = vercelLat ? parseFloat(vercelLat) : (cfLat ? parseFloat(cfLat) : null);
  let longitude = vercelLon ? parseFloat(vercelLon) : (cfLon ? parseFloat(cfLon) : null);
  let timezone = vercelTz || cfTz || '';
  let isp = '';
  let source = (vercelCity || vercelCountry) ? 'vercel_edge' : (cfCity || cfCountry ? 'cloudflare_edge' : '');

  // 3. If client provided high-accuracy GPS or reverse-geocoded location, take precedence
  if (clientLocation && clientLocation.success) {
    if (clientLocation.city && !city) city = clientLocation.city;
    if (clientLocation.region && !region) region = clientLocation.region;
    if (clientLocation.country && !country) country = clientLocation.country;
    if (clientLocation.latitude && !latitude) latitude = clientLocation.latitude;
    if (clientLocation.longitude && !longitude) longitude = clientLocation.longitude;
    if (clientLocation.isp && !isp) isp = clientLocation.isp;
    source = 'client_gps_or_cached';
  }

  // 4. Fallback to server-side IP Geolocation if edge headers didn't provide city & IP is public
  if ((!city || !country) && !isPrivateIp(ip)) {
    const cached = ipGeoCache.get(ip);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      const geo = cached.data;
      city = city || geo.city || '';
      region = region || geo.region || '';
      country = country || geo.country || '';
      postal = postal || geo.postal || '';
      latitude = latitude || geo.latitude || null;
      longitude = longitude || geo.longitude || null;
      timezone = timezone || geo.timezone || '';
      isp = isp || geo.isp || '';
      source = 'ip_geo_cache';
    } else {
      try {
        // Fast timeout to never block request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
          cache: 'no-store'
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const geo = await res.json();
          if (geo && geo.success) {
            city = city || geo.city || '';
            region = region || geo.region || '';
            country = country || geo.country || '';
            postal = postal || geo.postal || '';
            latitude = latitude || geo.latitude || null;
            longitude = longitude || geo.longitude || null;
            timezone = timezone || geo.timezone?.id || '';
            isp = isp || geo.connection?.isp || geo.connection?.org || '';
            source = 'ipwhois_api';

            // Cache result
            if (ipGeoCache.size >= MAX_CACHE_SIZE) {
              const oldestKey = ipGeoCache.keys().next().value;
              ipGeoCache.delete(oldestKey);
            }
            ipGeoCache.set(ip, {
              timestamp: now,
              data: {
                city: geo.city || '',
                region: geo.region || '',
                country: geo.country || '',
                postal: geo.postal || '',
                latitude: geo.latitude || null,
                longitude: geo.longitude || null,
                timezone: geo.timezone?.id || '',
                isp: geo.connection?.isp || geo.connection?.org || ''
              }
            });
          }
        }
      } catch (err) {
        // Non-fatal fallback
      }
    }
  }

  // Fallback defaults for local environment / unspecified
  if (!city && isPrivateIp(ip)) {
    city = 'Local Development';
    country = 'Localhost';
    source = 'localhost';
  }

  return {
    city: city || 'Unknown City',
    region: region || '',
    country: country || 'Unknown Country',
    postal: postal || '',
    latitude: latitude || null,
    longitude: longitude || null,
    timezone: timezone || '',
    isp: isp || '',
    source: source || 'ip'
  };
}

/**
 * Parses user agent string and metadata to extract device, OS, browser, screen, and bot info
 */
export function parseUserDetails(uaString = '', clientMetadata = {}) {
  const ua = (uaString || '').toLowerCase();
  
  // 1. Detect Bots / Crawlers
  const isBot = /bot|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|facebookexternalhit|ia_archiver|twitterbot|whatsapp|telegrambot/i.test(ua);

  // 2. Detect OS
  let os = 'Unknown OS';
  let osVersion = '';

  if (ua.includes('windows nt 10.0')) {
    os = 'Windows 10/11';
  } else if (ua.includes('windows nt 6.3')) {
    os = 'Windows 8.1';
  } else if (ua.includes('windows nt 6.2')) {
    os = 'Windows 8';
  } else if (ua.includes('windows nt 6.1')) {
    os = 'Windows 7';
  } else if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
    os = 'iOS';
    const match = ua.match(/os (\d+[._]\d+)/);
    if (match) osVersion = match[1].replace('_', '.');
  } else if (ua.includes('android')) {
    os = 'Android';
    const match = ua.match(/android (\d+[._]\d+)/);
    if (match) osVersion = match[1];
  } else if (ua.includes('macintosh') || ua.includes('mac os x')) {
    os = 'macOS';
    const match = ua.match(/mac os x (\d+[._]\d+)/);
    if (match) osVersion = match[1].replace(/_/g, '.');
  } else if (ua.includes('cros')) {
    os = 'ChromeOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  }

  // 3. Detect Device Type
  let deviceType = 'Desktop';
  let deviceLabel = '💻 Desktop PC';

  if (isBot) {
    deviceType = 'Bot';
    deviceLabel = '🤖 Search Crawler / Bot';
  } else if (ua.includes('ipad') || (ua.includes('android') && !ua.includes('mobile'))) {
    deviceType = 'Tablet';
    deviceLabel = '📱 Tablet';
  } else if (ua.includes('iphone')) {
    deviceType = 'Mobile';
    deviceLabel = '📱 iPhone';
  } else if (ua.includes('android') && ua.includes('mobile')) {
    deviceType = 'Mobile';
    deviceLabel = '📱 Android Mobile';
  } else if (/mobile|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = 'Mobile';
    deviceLabel = '📱 Mobile Device';
  } else if (os === 'macOS') {
    deviceLabel = '💻 Apple Mac';
  } else if (os.startsWith('Windows')) {
    deviceLabel = '💻 Windows PC';
  }

  // 4. Detect Browser & Browser Version
  let browser = 'Unknown Browser';
  let browserVersion = '';

  if (ua.includes('edg/')) {
    browser = 'Edge';
    browserVersion = ua.split('edg/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('opr/') || ua.includes('opera')) {
    browser = 'Opera';
    browserVersion = ua.split(/opr\/|opera\//)[1]?.split(' ')[0] || '';
  } else if (ua.includes('samsungbrowser')) {
    browser = 'Samsung Internet';
    browserVersion = ua.split('samsungbrowser/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('chrome') || ua.includes('crios')) {
    browser = 'Chrome';
    const match = ua.match(/(?:chrome|crios)\/([\d.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('firefox') || ua.includes('fxios')) {
    browser = 'Firefox';
    const match = ua.match(/(?:firefox|fxios)\/([\d.]+)/);
    if (match) browserVersion = match[1];
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
    const match = ua.match(/version\/([\d.]+)/);
    if (match) browserVersion = match[1];
  }

  // 5. Detect Traffic Source & Referrer Category
  const referrer = clientMetadata.referrer || '';
  let trafficSource = 'Direct';

  if (referrer) {
    const refLower = referrer.toLowerCase();
    if (refLower.includes('google.')) trafficSource = 'Google Search';
    else if (refLower.includes('instagram.')) trafficSource = 'Instagram';
    else if (refLower.includes('facebook.') || refLower.includes('fb.')) trafficSource = 'Facebook';
    else if (refLower.includes('youtube.')) trafficSource = 'YouTube';
    else if (refLower.includes('x.com') || refLower.includes('twitter.')) trafficSource = 'X / Twitter';
    else if (refLower.includes('linkedin.')) trafficSource = 'LinkedIn';
    else if (refLower.includes('whatsapp.')) trafficSource = 'WhatsApp';
    else if (refLower.includes('pinterest.')) trafficSource = 'Pinterest';
    else if (refLower.includes('bing.')) trafficSource = 'Bing Search';
    else if (refLower.includes('yahoo.')) trafficSource = 'Yahoo';
    else {
      try {
        const urlObj = new URL(referrer);
        trafficSource = urlObj.hostname.replace(/^www\./, '');
      } catch (e) {
        trafficSource = 'Referral';
      }
    }
  }

  // UTM override if present
  const utm = clientMetadata.utm || {};
  if (utm.source) {
    trafficSource = `Campaign: ${utm.source}${utm.medium ? ` / ${utm.medium}` : ''}`;
  }

  return {
    isBot,
    deviceType,
    deviceLabel,
    os,
    osVersion,
    browser,
    browserVersion,
    trafficSource,
    referrer,
    screen: clientMetadata.screen || '',
    viewport: clientMetadata.viewport || '',
    pixelRatio: clientMetadata.pixelRatio || 1,
    language: clientMetadata.language || '',
    languages: clientMetadata.languages || [],
    platform: clientMetadata.platform || '',
    network: clientMetadata.network || '',
    fullUrl: clientMetadata.fullUrl || '',
    utm
  };
}

function decodeSafe(val) {
  try {
    return decodeURIComponent(val);
  } catch (e) {
    return val;
  }
}
