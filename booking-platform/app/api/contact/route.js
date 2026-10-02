import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parseDevice } from '@/app/services/api/contact.service.js';
import { 
  generateReferenceCode, 
  enqueueNotificationJobs, 
  processPendingOutbox 
} from '@/lib/queue/outboxProcessor';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(req) {
  const startTime = Date.now();
  try {
    const data = await req.json();

    // 1. Honeypot check (Silent discard for bots)
    if (data._hp_check || data.honeypot || data.website_url_check) {
      console.warn('[ContactAPI] Honeypot triggered, discarding spam submission silently.');
      return NextResponse.json({
        success: true,
        referenceCode: 'MAG-SPAM',
        message: 'Your inquiry has been received.'
      }, { status: 200 });
    }

    // 2. Server-side validation
    const rawName = (data.name || '').trim();
    const rawPhone = (data.phone || '').trim();
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json({
        error: 'Please provide a valid 10-digit phone number.'
      }, { status: 400 });
    }

    const clientName = rawName || 'Event Host';
    const clientEmail = (data.email || '').trim() || 'N/A';
    const isRegister = data.type === 'register' || data.formType === 'register' || data.type === 'artist_registration';
    const isCallRequest = data.type === 'call_request';
    const isOffer = data.formType === 'offer';
    const artistName = typeof data.selectedArtist === 'object' && data.selectedArtist !== null ? data.selectedArtist.name : (data.selectedArtist || '');
    const userAgent = req.headers.get('user-agent') || data.userAgent || '';
    const deviceStr = parseDevice(userAgent, data.deviceType || data.device);
    
    let clientIp = 
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-real-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      data.ip ||
      '';

    const supabase = getSupabaseAdmin();

    // 3. Idempotency Check (Prevent duplicate submissions within 5 minutes)
    const idempotencyKey = req.headers.get('x-idempotency-key') || data.idempotencyKey || null;
    if (idempotencyKey) {
      const { data: existingBooking } = await supabase
        .from('bookings')
        .select('id, reference_code, created_at')
        .eq('idempotency_key', idempotencyKey)
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())
        .maybeSingle();

      if (existingBooking) {
        console.log(`[ContactAPI] Idempotent hit: returning existing booking ${existingBooking.id}`);
        return NextResponse.json({
          success: true,
          bookingId: existingBooking.id,
          referenceCode: existingBooking.reference_code || 'MAG-CONFIRMED',
          message: `Thank you! Your inquiry has already been received. Your reference number is ${existingBooking.reference_code || 'MAG-CONFIRMED'}.`
        }, { status: 200 });
      }
    }

    // 4. Calculate numeric budget
    let numericBudget = 0;
    if (data.budget) {
      const bStr = String(data.budget).toLowerCase();
      if (bStr.includes('5k_10k')) numericBudget = 10000;
      else if (bStr.includes('10k_20k')) numericBudget = 20000;
      else if (bStr.includes('20k_35k')) numericBudget = 35000;
      else if (bStr.includes('35k_50k')) numericBudget = 50000;
      else if (bStr.includes('50k_80k')) numericBudget = 80000;
      else if (bStr.includes('80k_1.2l')) numericBudget = 120000;
      else if (bStr.includes('1.2l_1.5l')) numericBudget = 150000;
      else if (bStr.includes('1.5l_2l')) numericBudget = 200000;
      else if (bStr.includes('2l_3l')) numericBudget = 300000;
      else if (bStr.includes('3l_5l')) numericBudget = 500000;
      else if (bStr.includes('5l_plus')) numericBudget = 500000;
      else {
        const num = parseFloat(bStr.replace(/[^0-9.]/g, ''));
        if (!isNaN(num)) numericBudget = num;
      }
    } else if (data.price) {
      const num = parseFloat(String(data.price).replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) numericBudget = num;
    }

    // 5. Notes & Metadata compilation
    let evType = isRegister ? 'Artist Registration' : (isCallRequest ? 'Call Request' : (data.eventType || 'Event Booking'));
    let notesArray = [];
    if (data.message) notesArray.push(`Message: ${data.message}`);
    if (data.bio) notesArray.push(`Bio: ${data.bio}`);
    if (data.portfolio) notesArray.push(`Portfolio: ${data.portfolio}`);
    if (data.city) notesArray.push(`City: ${data.city}`);
    if (deviceStr) notesArray.push(`Device: ${deviceStr}`);
    if (data.keywords) notesArray.push(`Keywords: ${data.keywords}`);
    if (data.formName || data.formType) notesArray.push(`Source Form: ${data.formName || data.formType}`);

    let extraNotes = notesArray.join('\n') || 'No additional notes.';

    // Fast Geolocation extraction (Client provides cached location)
    let latitude = data.latitude ? parseFloat(data.latitude) : null;
    let longitude = data.longitude ? parseFloat(data.longitude) : null;
    let detectedLocation = data.detectedLocation || data.detected_location || '';
    if (!detectedLocation && data.location) detectedLocation = data.location;
    if (!detectedLocation && data.city) detectedLocation = data.city;

    const referenceCode = generateReferenceCode();

    const bookingData = {
      client_name: clientName,
      client_email: clientEmail,
      client_phone: rawPhone,
      event_type: evType,
      event_date: data.date || null,
      venue: data.location || data.city || detectedLocation || 'Delhi NCR / TBD',
      budget: numericBudget,
      notes: extraNotes,
      status: 'pending',
      booking_source: isRegister ? 'artist_portal' : 'client',
      latitude: latitude,
      longitude: longitude,
      detected_location: detectedLocation || null,
      ip_address: clientIp || 'unknown',
      page_url: data.pageUrl || data.pagePath || null,
      keywords: data.keywords || null,
      referrer: data.referrer || req.headers.get('referer') || null,
      reference_code: referenceCode,
      idempotency_key: idempotencyKey,
      source_form: data.formName || data.formType || 'Website Form',
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null
    };

    if (data.selectedArtist && data.selectedArtist.id) {
      bookingData.artist_id = data.selectedArtist.id;
    }

    let dbArtistInfo = null;
    if (!bookingData.artist_id && artistName) {
      try {
        const { data: artistDataList } = await supabase
          .from('artists')
          .select('*')
          .or(`name.ilike.${artistName},alias.ilike.${artistName}`)
          .limit(1);
        if (artistDataList && artistDataList.length > 0) {
          dbArtistInfo = artistDataList[0];
          bookingData.artist_id = dbArtistInfo.id;
        }
      } catch (aErr) {}
    }

    // 6. DURABLE PERSISTENCE: Save to Supabase 'bookings'
    let bookingId = null;
    const { data: insertedData, error: insertError } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (insertError) {
      console.warn('[ContactAPI] Full schema insert error, retrying core columns:', insertError.message);
      
      // Retry without extended metadata in case columns don't exist yet
      const fallbackBooking = {
        client_name: bookingData.client_name,
        client_email: bookingData.client_email,
        client_phone: bookingData.client_phone,
        event_type: bookingData.event_type,
        event_date: bookingData.event_date,
        venue: bookingData.venue,
        budget: bookingData.budget,
        notes: bookingData.notes,
        status: 'pending',
        booking_source: bookingData.booking_source
      };

      const { data: retryData, error: retryError } = await supabase
        .from('bookings')
        .insert([fallbackBooking])
        .select()
        .single();

      if (retryError) {
        console.error('[ContactAPI] CRITICAL: Failed to persist booking to database:', retryError);
        return NextResponse.json({
          error: 'Failed to safely register your booking in database. Please try again or reach out on WhatsApp.'
        }, { status: 500 });
      }

      bookingId = retryData.id;
    } else {
      bookingId = insertedData.id;
    }

    console.log(`[ContactAPI] Booking successfully created: ID ${bookingId} | Ref ${referenceCode}`);

    // 7. Enqueue Transactional Outbox Jobs for Email & WhatsApp
    await enqueueNotificationJobs({
      supabase,
      bookingId,
      referenceCode,
      data,
      isRegister,
      isCallRequest,
      isOffer,
      dbArtistInfo
    });

    // 8. Fast processing race (Tries to dispatch immediately within 1.5s, otherwise background cron handles it)
    const fastDispatch = async () => {
      try {
        await processPendingOutbox({ supabase, batchSize: 3 });
      } catch (procErr) {
        console.warn('[ContactAPI] Inline outbox dispatch notice:', procErr.message);
      }
    };

    const timeoutRace = new Promise((resolve) => setTimeout(resolve, 1200));
    await Promise.race([fastDispatch(), timeoutRace]);

    // Track API analytics hit asynchronously
    try {
      const origin = new URL(req.url).origin;
      fetch(`${origin}/api/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: '/api/contact',
          type: 'form_submission',
          userAgent: userAgent || 'unknown',
          sessionId: referenceCode
        })
      }).catch(() => {});
    } catch (anErr) {}

    // 9. Return Truthful Confirmation to Client
    return NextResponse.json({
      success: true,
      bookingId,
      referenceCode,
      message: `Thank you! Your enquiry has been received successfully. Your reference number is ${referenceCode}. We will contact you soon.`,
      durationMs: Date.now() - startTime
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'x-magnevents-ref': referenceCode
      }
    });

  } catch (error) {
    console.error('[ContactAPI] Fatal unhandled error:', error);
    return NextResponse.json({
      error: 'An error occurred while processing your submission. Please try again.'
    }, { status: 500 });
  }
}
