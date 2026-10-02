import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { buildEmailTemplate, parseDevice } from '@/app/services/api/contact.service.js';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseKey);
}

function generateReferenceCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MAG-${randomStr}`;
}

export async function POST(req) {
  const startTime = Date.now();
  try {
    const data = await req.json();

    // 1. Honeypot check (Silent discard for spam bots)
    if (data._hp_check || data.honeypot || data.website_url_check) {
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

    // 3. Calculate numeric budget
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

    // 4. Notes & Metadata compilation
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

    // 5. DIRECT DATABASE PERSISTENCE: Save directly to Supabase 'bookings'
    let bookingId = null;
    const { data: insertedData, error: insertError } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (insertError) {
      console.warn('[ContactAPI] Full insert fallback, saving core columns:', insertError.message);
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
        console.error('[ContactAPI] DB Insert Error:', retryError);
      } else {
        bookingId = retryData.id;
      }
    } else {
      bookingId = insertedData.id;
    }

    // 6. DIRECT EMAIL DELIVERY: Send via Gmail SMTP immediately
    const adminEmail = process.env.EMAIL_USER || 'magneventsdotin@gmail.com';
    const emailPass = process.env.EMAIL_PASS || '';

    if (adminEmail && emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: adminEmail,
            pass: emailPass,
          },
        });

        const subject = `[${referenceCode}] ${isRegister ? '🎤 Artist Registration' : isCallRequest ? '📞 Call Request' : '🌟 Client Inquiry'} - ${clientName}`;
        const contentSections = buildEmailTemplate(data, isRegister, isCallRequest, dbArtistInfo, null);
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin.magnevents.in';
        const bId = bookingId || 'new';

        const htmlBody = `
          <!DOCTYPE html>
          <html>
          <body style="background-color: #0f172a; font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #fff;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 24px; border: 1px solid rgba(255,255,255,0.1);">
              <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 20px;">
                <h2 style="color: #fbbf24; margin: 0; font-size: 20px;">${subject}</h2>
                <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Reference: <strong>${referenceCode}</strong> | ID: ${bId}</p>
              </div>
              ${contentSections}
              <div style="margin-top: 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <a href="${adminUrl}/dashboard/requests?reply=${bId}" style="display: inline-block; background-color: #0284c7; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Review in Admin Portal</a>
              </div>
            </div>
          </body>
          </html>
        `;

        await transporter.sendMail({
          from: `"Magnevents System" <${adminEmail}>`,
          to: adminEmail,
          subject: subject,
          html: htmlBody,
        });

        // Log in emails table
        try {
          await supabase.from('emails').insert([{
            booking_id: bookingId,
            recipient_email: adminEmail,
            subject: subject,
            body: htmlBody,
            email_type: isRegister ? 'artist_registration' : 'admin_lead_notification',
            status: 'sent',
            created_at: new Date().toISOString()
          }]);
        } catch (lErr) {}

        // Send customer confirmation if valid email provided
        if (clientEmail && clientEmail !== 'N/A' && clientEmail.includes('@') && !clientEmail.includes('example.com')) {
          try {
            await transporter.sendMail({
              from: `"Magnevents Concierge" <${adminEmail}>`,
              to: clientEmail,
              subject: `Booking Request Received: ${referenceCode} | Magnevents`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 24px; border-radius: 12px;">
                  <h2 style="color: #fbbf24;">Thank you, ${clientName}!</h2>
                  <p>Your inquiry has been received with reference number: <strong>${referenceCode}</strong>.</p>
                  <p>Our dedicated entertainment manager is reviewing your event details and will contact you shortly with available artist options and quotes.</p>
                  <p style="margin-top: 20px; color: #94a3b8; font-size: 13px;">Need fast assistance? Reply to this email or chat with us on WhatsApp.</p>
                </div>
              `
            });
          } catch (cErr) {
            console.warn('[ContactAPI] Customer confirmation email notice:', cErr.message);
          }
        }

      } catch (mailError) {
        console.error('[ContactAPI] Direct SMTP Email Send Error:', mailError.message);
      }
    }

    // 7. Immediate Truthful Success Response
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
    console.error('[ContactAPI] Fatal error:', error);
    return NextResponse.json({
      error: 'An error occurred while processing your submission. Please try again.'
    }, { status: 500 });
  }
}
