import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { extractClientIp, extractLocality, parseUserDetails } from '@/app/utils/visitorExtractor';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * GET /api/analytics
 * Returns the detected IP, locality, and user details for the current requester (useful for inspection/verification).
 */
export async function GET(req) {
  try {
    const userAgent = req.headers.get('user-agent') || '';
    const clientIp = extractClientIp(req);
    const locality = await extractLocality(req, clientIp);
    const userDetails = parseUserDetails(userAgent, {
      referrer: req.headers.get('referer') || ''
    });

    return NextResponse.json({
      success: true,
      ip: clientIp,
      locality,
      userDetails
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/analytics
 * Extracts visitor's IP, locality (city, region, country, coordinates, ISP),
 * and user details (device, browser, OS, screen, referrer), then persists to Supabase.
 */
export async function POST(req) {
  try {
    const data = await req.json().catch(() => ({}));
    const { path = '/', type = 'page_view', userAgent = '', sessionId = null, clientDetails = {}, clientLocation = null } = data;

    const rawUA = userAgent || req.headers.get('user-agent') || 'unknown';

    // 1. Extract Real Client IP
    const clientIp = extractClientIp(req, data.clientIp);

    // 2. Hash IP for privacy/unique visitor counts
    const ipHash = crypto.createHash('sha256').update(clientIp).digest('hex').substring(0, 16);

    // 3. Extract Locality (City, Region, Country, Postal, Lat/Lng, Timezone, ISP)
    const locality = await extractLocality(req, clientIp, clientLocation);

    // 4. Parse User & Device Details
    const parsedUser = parseUserDetails(rawUA, clientDetails);

    // 5. Build Comprehensive Visitor Record
    const visitorDetails = {
      ip: clientIp,
      locality: {
        city: locality.city,
        region: locality.region,
        country: locality.country,
        postal: locality.postal,
        latitude: locality.latitude,
        longitude: locality.longitude,
        timezone: locality.timezone,
        isp: locality.isp,
        source: locality.source
      },
      user: {
        deviceType: parsedUser.deviceType,
        deviceLabel: parsedUser.deviceLabel,
        os: parsedUser.os,
        osVersion: parsedUser.osVersion,
        browser: parsedUser.browser,
        browserVersion: parsedUser.browserVersion,
        isBot: parsedUser.isBot,
        screen: parsedUser.screen,
        viewport: parsedUser.viewport,
        pixelRatio: parsedUser.pixelRatio,
        language: parsedUser.language,
        languages: parsedUser.languages,
        platform: parsedUser.platform,
        network: parsedUser.network,
        referrer: parsedUser.referrer,
        trafficSource: parsedUser.trafficSource,
        fullUrl: parsedUser.fullUrl,
        utm: parsedUser.utm
      },
      timestamp: new Date().toISOString()
    };

    const supabase = getSupabase();

    // 6. Attempt insert with dedicated columns if they exist, or fallback safely to baseRecord
    const richRecord = {
      path: path || '/',
      type: type || 'page_view',
      user_agent: rawUA,
      ip_hash: ipHash,
      session_id: sessionId,
      ip_address: clientIp,
      city: locality.city || null,
      region: locality.region || null,
      country: locality.country || null,
      device_type: parsedUser.deviceType || null,
      browser: parsedUser.browser || null,
      os: parsedUser.os || null,
      referrer: parsedUser.referrer || null,
      details: visitorDetails
    };

    const baseRecord = {
      path: path || '/',
      type: type || 'page_view',
      user_agent: rawUA,
      ip_hash: ipHash,
      session_id: sessionId,
      details: visitorDetails
    };

    // Try rich record first
    let { error } = await supabase.from('analytics').insert([richRecord]);

    // If column doesn't exist error (code 42703), fallback to base record which uses only existing columns
    if (error && error.code === '42703') {
      const fallbackResult = await supabase.from('analytics').insert([baseRecord]);
      error = fallbackResult.error;
    }

    if (error) {
      console.error('Analytics tracking error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ip: clientIp,
        city: locality.city,
        country: locality.country,
        device: parsedUser.deviceLabel
      }
    });
  } catch (error) {
    console.error('Analytics tracking exception:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
