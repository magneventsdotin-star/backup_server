import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { buildEmailTemplate, row, buildSection, parseDevice } from '@/app/services/api/contact.service.js';
import { sendAdminWhatsAppNotification } from '@/app/services/api/whatsapp.service.js';

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

    // 1. Honeypot check
    if (data._hp_check || data.honeypot || data.website_url_check) {
      return NextResponse.json({
        success: true,
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

    // 3. Subject prefix determination
    let subjectPrefix = "🌟 Client Inquiry";
    if (isRegister) subjectPrefix = "🎤 Artist Registration";
    else if (isCallRequest) subjectPrefix = "📞 Call Request";
    else if (isOffer) subjectPrefix = "🔥 DISCOUNT PROMO USER";

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
    if (data.artistType && data.artistType.length > 0) {
      const typesStr = Array.isArray(data.artistType) ? data.artistType.join(', ') : data.artistType;
      notesArray.push(`Requested Types: ${typesStr}`);
    }
    if (data.bio) notesArray.push(`Bio: ${data.bio}`);
    if (data.portfolio) notesArray.push(`Portfolio: ${data.portfolio}`);
    if (data.category) notesArray.push(`Category: ${data.category}`);
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

    // Mutate data object for email template
    data.latitude = latitude;
    data.longitude = longitude;
    data.detectedLocation = detectedLocation;
    data.ipAddress = clientIp || 'unknown';
    data.device = deviceStr;

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
      booking_source: isRegister ? 'artist_portal' : (data.formName || data.formType || 'client'),
      latitude: latitude,
      longitude: longitude,
      detected_location: detectedLocation || null,
      ip_address: clientIp || 'unknown',
      page_url: data.pageUrl || data.pagePath || null,
      keywords: data.keywords || null,
      referrer: data.referrer || req.headers.get('referer') || null,
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

    // 6. DIRECT DATABASE PERSISTENCE: Save directly to Supabase 'bookings'
    let bookingId = null;
    try {
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

        if (!retryError && retryData) {
          bookingId = retryData.id;
        }
      } else if (insertedData) {
        bookingId = insertedData.id;
      }
    } catch (dbErr) {
      console.error('[ContactAPI] DB Insert Error:', dbErr);
    }

    if (!dbArtistInfo && bookingData.artist_id) {
      try {
        const { data: artistData } = await supabase.from('artists').select('*').eq('id', bookingData.artist_id).single();
        if (artistData) dbArtistInfo = artistData;
      } catch (fErr) {}
    }

    // Fallback: If cover_image_url is missing, grab first image
    if (dbArtistInfo && !dbArtistInfo.cover_image_url) {
      try {
        const { data: artistImages } = await supabase.from('artist_images').select('image_url').eq('artist_id', dbArtistInfo.id).limit(1);
        if (artistImages && artistImages.length > 0) {
          dbArtistInfo.cover_image_url = artistImages[0].image_url;
        }
      } catch (imgErr) {}
    }

    // 7. PREPARE EMAIL CONTENT & RICH PREVIEW
    let coverPhotoHtml = '';
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin.magnevents.in';
    const bId = bookingId || 'new';

    if (dbArtistInfo && dbArtistInfo.cover_image_url) {
      const profileLink = dbArtistInfo.id ? `${adminUrl}/dashboard/artists?id=${dbArtistInfo.id}` : '#';
      let extraInfoHtml = '';
      if (dbArtistInfo.email) extraInfoHtml += `<span style="display: block; color: #94a3b8; font-size: 13px; margin-bottom: 4px;">✉️ ${dbArtistInfo.email}</span>`;
      if (dbArtistInfo.phone_no) extraInfoHtml += `<span style="display: block; color: #94a3b8; font-size: 13px; margin-bottom: 4px;">📞 ${dbArtistInfo.phone_no}</span>`;
      if (dbArtistInfo.available_bookings !== undefined && dbArtistInfo.available_bookings !== null) {
        extraInfoHtml += `<span style="display: block; color: #10b981; font-size: 13px; font-weight: 600; margin-top: 8px;">🗓️ ${dbArtistInfo.available_bookings} Bookings Available</span>`;
      }

      coverPhotoHtml = `
        <div style="margin-bottom: 32px; border-radius: 16px; overflow: hidden; background-color: #1e293b; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);">
          <img src="${dbArtistInfo.cover_image_url}" alt="${dbArtistInfo.name || dbArtistInfo.alias || 'Artist'}" style="width: 100%; max-height: 250px; object-fit: cover; display: block;" />
          <div style="padding: 24px 20px; text-align: center;">
            <h3 style="margin: 0 0 12px 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">${dbArtistInfo.name || dbArtistInfo.alias}</h3>
            <div style="margin: 0 0 16px 0;">
              <span style="display: inline-block; background: rgba(251, 191, 36, 0.1); color: #fbbf24; padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 12px; margin: 4px;">${dbArtistInfo.category || 'Artist'}</span>
              ${dbArtistInfo.city ? `<span style="display: inline-block; background: rgba(255, 255, 255, 0.1); color: #cbd5e1; padding: 6px 12px; border-radius: 20px; font-weight: 700; font-size: 12px; margin: 4px;">📍 ${dbArtistInfo.city}</span>` : ''}
            </div>
            <div style="margin-bottom: 20px;">
              ${extraInfoHtml}
            </div>
            <a href="${profileLink}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px; box-shadow: 0 4px 6px -1px rgba(2, 132, 199, 0.2);">Open Full Artist Profile</a>
          </div>
        </div>
      `;
    }

    let contentSections = buildEmailTemplate(data, isRegister, isCallRequest, dbArtistInfo, coverPhotoHtml);

    if (data.selectedPlan && typeof data.selectedPlan === 'object') {
      const p = data.selectedPlan;
      contentSections += buildSection('📦 Selected Pricing Package', 
        row('Package Name', p.name) +
        row('Starts From', p.price) +
        row('Tagline', p.tagline) +
        row('Features', p.features && p.features.length > 0 ? p.features.join(', ') : '')
      );
    }
    if (data.selectedService && typeof data.selectedService === 'object') {
      const s = data.selectedService;
      contentSections += buildSection('🛠️ Selected Service Details', 
        row('Service Title', s.title) +
        row('Description', s.desc)
      );
    }

    // Action button links
    const premiumBtnBase = "display: block; width: 100%; box-sizing: border-box; color: #ffffff; padding: 14px 16px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; margin-bottom: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.1);";
    const whatsappLink = data.phone ? `https://wa.me/${data.phone.replace(/[^0-9]/g, '')}` : '#';

    let buttonsHtml = '';
    if (isRegister) {
      const approveArtistLink = `${adminUrl}/dashboard/artist-requests?reply=${bId}&action=approve_artist`;
      const morePortfolioLink = `${adminUrl}/dashboard/artist-requests?reply=${bId}&action=more_portfolio`;
      const customReplyLink = `${adminUrl}/dashboard/artist-requests?reply=${bId}&action=custom`;
      const rejectArtistLink = `${adminUrl}/dashboard/artist-requests?reply=${bId}&action=reject_artist`;

      buttonsHtml = `
        <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" style="${premiumBtnBase} background-color: #25D366; box-shadow: 0 4px 6px -1px rgba(37, 211, 102, 0.2);">💬 Direct Connect on WhatsApp</a>
        <div style="height: 1px; background-color: rgba(255,255,255,0.05); margin: 24px 0;"></div>
        <a href="${approveArtistLink}" target="_blank" rel="noopener noreferrer" style="${premiumBtnBase} background-color: #7c3aed; box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.2);">✅ Approve Artist</a>
        <div style="height: 1px; background-color: rgba(255,255,255,0.05); margin: 24px 0;"></div>
        <a href="${morePortfolioLink}" target="_blank" rel="noopener noreferrer" style="${premiumBtnBase} background-color: #2563eb; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">📂 Request Portfolio</a>
        <a href="${customReplyLink}" target="_blank" rel="noopener noreferrer" style="${premiumBtnBase} background-color: #9333ea; box-shadow: 0 4px 6px -1px rgba(147, 51, 234, 0.2);">✉️ Send Custom Reply</a>
        <div style="height: 1px; background-color: rgba(255,255,255,0.05); margin: 24px 0;"></div>
        <a href="${rejectArtistLink}" target="_blank" rel="noopener noreferrer" style="${premiumBtnBase} background-color: #dc2626; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2);">❌ Reject Artist</a>
      `;
    } else {
      const confirmLink = `${adminUrl}/dashboard/requests?reply=${bId}&action=confirm`;
      const approveLink = `${adminUrl}/dashboard/requests?reply=${bId}&action=approve`;
      const moreInfoLink = `${adminUrl}/dashboard/requests?reply=${bId}&action=more_info`;
      const customReplyLink = `${adminUrl}/dashboard/requests?reply=${bId}&action=custom`;
      const unavailableLink = `${adminUrl}/dashboard/requests?reply=${bId}&action=unavailable`;
      const rejectLink = `${adminUrl}/dashboard/requests?reply=${bId}&action=reject`;

      buttonsHtml = `
        <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" style="${premiumBtnBase} background-color: #25D366; box-shadow: 0 4px 6px -1px rgba(37, 211, 102, 0.2);">💬 Direct Connect on WhatsApp</a>
        <div style="height: 1px; background-color: rgba(255,255,255,0.05); margin: 24px 0;"></div>
        <a href="${confirmLink}" target="_blank" rel="noopener noreferrer" style="${premiumBtnBase} background-color: #10b981; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">✅ Confirm Booking</a>
        <a href="${approveLink}" target="_blank" rel="noopener noreferrer" style="${premiumBtnBase} background-color: #059669; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);">👍 Approve Booking</a>
        <div style="height: 1px; background-color: rgba(255,255,255,0.05); margin: 24px 0;"></div>
        <a href="${moreInfoLink}" target="_blank" rel="noopener noreferrer" style="${premiumBtnBase} background-color: #2563eb; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">📞 Request More Info</a>
        <a href="${customReplyLink}" target="_blank" rel="noopener noreferrer" style="${premiumBtnBase} background-color: #7c3aed; box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.2);">✍️ Custom Reply</a>
        <div style="height: 1px; background-color: rgba(255,255,255,0.05); margin: 24px 0;"></div>
        <a href="${unavailableLink}" target="_blank" rel="noopener noreferrer" style="${premiumBtnBase} background-color: #ea580c; box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.2);">🗓️ Artist Unavailable</a>
        <a href="${rejectLink}" target="_blank" rel="noopener noreferrer" style="${premiumBtnBase} background-color: #dc2626; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2);">❌ Reject / Not Possible</a>
      `;
    }

    const emailSubject = `${subjectPrefix} - ${clientName}`;
    const plainTextBody = `${subjectPrefix} from ${clientName}\nPhone: ${rawPhone}\nEmail: ${clientEmail}\nEvent: ${evType}`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="background-color: #f1f5f9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; width: 100%;">
          <tr>
            <td align="center">
              <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; overflow: hidden; text-align: left;">
                
                <div style="background: url('https://www.transparenttextures.com/patterns/stardust.png'), linear-gradient(135deg, #020617 0%, #0f172a 100%); padding: 50px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: 2px;">MAGNEVENTS</h1>
                  <p style="color: #fbbf24; font-size: 12px; margin: 16px 0 0 0; font-weight: 700; letter-spacing: 4px; text-transform: uppercase;">${subjectPrefix}</p>
                </div>

                <div style="padding: 40px 24px; background-color: #0f172a;">
                  <h2 style="margin-top: 0; font-size: 24px; color: #ffffff; font-weight: 700; margin-bottom: 32px; text-align: center;">You have a new inquiry!</h2>
                  ${contentSections}
                </div>

                <div style="background-color: #020617; padding: 40px 24px; border-top: 1px solid rgba(255,255,255,0.05); border-bottom-left-radius: 24px; border-bottom-right-radius: 24px;">
                  <div style="text-align: center; margin-bottom: 32px;">
                    <h3 style="margin: 0 0 8px 0; color: ${isRegister ? '#c084fc' : '#ffffff'}; font-size: 20px; font-weight: 700; letter-spacing: 1px;">${isRegister ? 'ARTIST REVIEW' : 'QUICK ACTIONS'}</h3>
                    <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.6;">${isRegister ? 'Review the artist profile and decide whether to approve, request more information, or reject the application.' : 'Review and respond to the client instantly.'}</p>
                  </div>
                  
                  <div style="max-width: 320px; margin: 0 auto;">
                    ${buttonsHtml}
                  </div>
                  
                  <div style="margin-top: 40px; text-align: center;">
                    <a href="${isRegister ? `${adminUrl}/dashboard/artist-requests?reply=${bId}` : `${adminUrl}/dashboard/requests?reply=${bId}`}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: transparent; color: ${isRegister ? '#c084fc' : '#fbbf24'}; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 13px; border: 1px solid ${isRegister ? '#c084fc' : '#fbbf24'}; letter-spacing: 1px; text-transform: uppercase;">Open in Dashboard</a>
                  </div>
                </div>

              </div>
              <div style="text-align: center; margin-top: 24px;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">${isRegister ? 'This email was generated from a new Artist Registration submission.' : 'Sent securely by Magnevents Admin System'}</p>
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // 8. DIRECT SMTP DISPATCH: Send email immediately
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

        await transporter.sendMail({
          from: `"${subjectPrefix} - Magnevents" <${adminEmail}>`,
          to: adminEmail,
          subject: emailSubject,
          text: plainTextBody,
          html: htmlBody,
        });

        // Log in emails table
        try {
          await supabase.from('emails').insert([{
            booking_id: bookingId,
            recipient_email: adminEmail,
            subject: emailSubject,
            body: plainTextBody + '\n\n' + htmlBody,
            email_type: isRegister ? 'artist_registration_inquiry' : 'client_inquiry',
            status: 'sent',
            created_at: new Date().toISOString()
          }]);
        } catch (eLogErr) {}

        // Customer confirmation email if valid email provided
        if (clientEmail && clientEmail !== 'N/A' && clientEmail.includes('@') && !clientEmail.includes('example.com')) {
          try {
            await transporter.sendMail({
              from: `"Magnevents Concierge" <${adminEmail}>`,
              to: clientEmail,
              subject: `Booking Request Received | Magnevents`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 24px; border-radius: 12px;">
                  <h2 style="color: #fbbf24;">Thank you, ${clientName}!</h2>
                  <p>Your inquiry has been received successfully.</p>
                  <p>Our dedicated entertainment manager is reviewing your event details and will contact you shortly with available artist options and quotes.</p>
                  <p style="margin-top: 20px; color: #94a3b8; font-size: 13px;">Need instant assistance? Reply directly to this email or chat with us on WhatsApp at +91 80765 15257.</p>
                </div>
              `
            });
          } catch (cMailErr) {}
        }

      } catch (mailErr) {
        console.error('[ContactAPI] Direct SMTP Email Send Error:', mailErr.message);
      }
    }

    // 9. Send WhatsApp notification to admin
    try {
      await sendAdminWhatsAppNotification({
        data,
        bookingId,
        isRegister,
        isCallRequest,
        isOffer,
        dbArtistInfo
      });
    } catch (wpErr) {
      console.warn('[ContactAPI] WhatsApp notification notice:', wpErr.message);
    }

    // 10. Track API hit asynchronously
    try {
      const origin = new URL(req.url).origin;
      fetch(`${origin}/api/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: '/api/contact',
          type: 'form_submission',
          userAgent: userAgent || 'unknown',
          sessionId: 'direct-lead'
        })
      }).catch(() => {});
    } catch (anErr) {}

    // 11. Immediate Response
    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Thank you! Your enquiry has been received successfully. We will contact you soon.',
      durationMs: Date.now() - startTime
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('[ContactAPI] Fatal error:', error);
    return NextResponse.json({
      error: 'An error occurred while processing your submission. Please try again.'
    }, { status: 500 });
  }
}
