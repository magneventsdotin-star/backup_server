import nodemailer from 'nodemailer';
import { buildEmailTemplate, parseDevice } from '@/app/services/api/contact.service.js';
import { sendAdminWhatsAppNotification } from '@/app/services/api/whatsapp.service.js';

/**
 * Returns configured Nodemailer transporter
 */
export function getMailTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[OutboxProcessor] EMAIL_USER or EMAIL_PASS is not defined in environment variables.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Pool settings to prevent socket starvation
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
    rateDelta: 1000,
    rateLimit: 5,
  });
}

/**
 * Generates an alphanumeric reference code e.g. "MAG-26K89A"
 */
export function generateReferenceCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MAG-${randomStr}`;
}

/**
 * Enqueue durable outbox jobs in database for a new booking
 */
export async function enqueueNotificationJobs({
  supabase,
  bookingId,
  referenceCode,
  data = {},
  isRegister = false,
  isCallRequest = false,
  isOffer = false,
  dbArtistInfo = null,
}) {
  const jobs = [];
  const adminEmail = process.env.EMAIL_USER || 'magneventsdotin@gmail.com';

  // 1. Admin Email Job
  jobs.push({
    booking_id: bookingId,
    reference_code: referenceCode,
    channel: 'email_admin',
    recipient: adminEmail,
    subject: `[${referenceCode}] ${isRegister ? '🎤 Artist Registration' : isCallRequest ? '📞 Call Request' : '🌟 Client Inquiry'} - ${data.name || 'Client'}`,
    payload: {
      data,
      bookingId,
      referenceCode,
      isRegister,
      isCallRequest,
      isOffer,
      dbArtistInfo,
    },
    status: 'pending',
    retry_count: 0,
    max_retries: 5,
  });

  // 2. Client Confirmation Email Job (if valid email is provided)
  const clientEmail = (data.email || '').trim();
  const isValidClientEmail = clientEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail) && !clientEmail.includes('example.com') && !clientEmail.includes('test.com');
  
  if (isValidClientEmail) {
    jobs.push({
      booking_id: bookingId,
      reference_code: referenceCode,
      channel: 'email_customer',
      recipient: clientEmail,
      subject: `Booking Request Received: ${referenceCode} | Magnevents`,
      payload: {
        clientName: data.name || 'Client',
        referenceCode,
        eventType: isRegister ? 'Artist Registration' : (data.eventType || 'Event Booking'),
        date: data.date || 'TBD',
        location: data.location || data.city || 'Delhi NCR / India',
        budget: data.budget || 'Quote on Request',
        selectedArtist: typeof data.selectedArtist === 'object' ? data.selectedArtist?.name : (data.selectedArtist || ''),
      },
      status: 'pending',
      retry_count: 0,
      max_retries: 3,
    });
  }

  // Persist into notifications_outbox (DB + Email only)
  try {
    const { data: insertedJobs, error } = await supabase
      .from('notifications_outbox')
      .insert(jobs)
      .select();

    if (error) {
      console.warn('[OutboxProcessor] Supabase notifications_outbox insert error (schema may need migration):', error.message);
      return [];
    }

    return insertedJobs || [];
  } catch (err) {
    console.error('[OutboxProcessor] Failed to enqueue outbox jobs:', err);
    return [];
  }
}

/**
 * Builds HTML for Customer Confirmation Email
 */
function buildCustomerConfirmationHtml({ clientName, referenceCode, eventType, date, location, budget, selectedArtist }) {
  const adminPhone = '+91 80765 15257';
  const cleanPhone = '918076515257';
  const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(`Hi Magnevents, my booking reference is ${referenceCode}. I would like to get artist videos and quotes!`)}`;

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="background-color: #0f172a; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 30px 10px; color: #ffffff;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.4);">
        <div style="background: linear-gradient(135deg, #020617 0%, #1e293b 100%); padding: 36px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <h1 style="color: #ffffff; font-size: 26px; font-weight: 900; margin: 0; letter-spacing: 1px;">MAGNEVENTS</h1>
          <p style="color: #fbbf24; font-size: 12px; margin: 8px 0 0 0; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;">BOOKING INQUIRY CONFIRMATION</p>
        </div>
        
        <div style="padding: 32px 24px;">
          <h2 style="color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 12px;">Hi ${clientName},</h2>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for reaching out to <strong>Magnevents</strong>! We have successfully received your inquiry. Our event concierge team is currently reviewing artist availability and preparing tailored video samples and quotes.
          </p>

          <div style="background-color: #0f172a; border-radius: 12px; padding: 20px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.06);">
              <span style="color: #94a3b8; font-size: 13px;">Reference Number:</span>
              <strong style="color: #fbbf24; font-size: 16px; font-family: monospace;">${referenceCode}</strong>
            </div>
            <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Requirement:</span> <strong style="color: #ffffff; font-size: 14px;">${eventType}</strong></div>
            <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Date:</span> <strong style="color: #ffffff; font-size: 14px;">${date}</strong></div>
            <div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Location:</span> <strong style="color: #ffffff; font-size: 14px;">${location}</strong></div>
            ${selectedArtist ? `<div style="margin-bottom: 8px;"><span style="color: #94a3b8; font-size: 13px;">Artist:</span> <strong style="color: #ffffff; font-size: 14px;">${selectedArtist}</strong></div>` : ''}
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${waUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 14px; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.4);">
              💬 Fast-Track on WhatsApp (${adminPhone})
            </a>
          </div>

          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0; text-align: center;">
            Need urgent assistance? Call us directly at <a href="tel:${adminPhone}" style="color: #fbbf24; text-decoration: none;">${adminPhone}</a>.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Executes a single outbox notification job with error isolation
 */
export async function processOutboxJob({ supabase, job }) {
  const transporter = getMailTransporter();
  const startTime = Date.now();

  try {
    // 1. Lock job
    const { error: lockError } = await supabase
      .from('notifications_outbox')
      .update({
        status: 'processing',
        locked_until: new Date(Date.now() + 60000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id)
      .in('status', ['pending', 'retrying']);

    if (lockError) {
      console.warn(`[OutboxProcessor] Job ${job.id} could not be locked or was already claimed.`);
      return { success: false, reason: 'locked' };
    }

    // 2. Dispatch based on channel
    if (job.channel === 'email_admin') {
      const { data, isRegister, isCallRequest, dbArtistInfo, referenceCode } = job.payload;
      const artistName = typeof data.selectedArtist === 'object' && data.selectedArtist !== null ? data.selectedArtist.name : (data.selectedArtist || '');
      
      let coverPhotoHtml = '';
      if (dbArtistInfo && dbArtistInfo.cover_image_url) {
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin.magnevents.in';
        const profileLink = dbArtistInfo.id ? `${adminUrl}/dashboard/artists?id=${dbArtistInfo.id}` : '#';
        coverPhotoHtml = `
          <div style="margin-bottom: 24px; border-radius: 12px; overflow: hidden; background-color: #1e293b; text-align: center; padding: 16px;">
            <img src="${dbArtistInfo.cover_image_url}" alt="${dbArtistInfo.name}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px;" />
            <h3 style="color: #fff; margin: 12px 0 4px;">${dbArtistInfo.name}</h3>
            <p style="color: #fbbf24; margin: 0; font-size: 13px;">${dbArtistInfo.category || 'Artist'}</p>
          </div>
        `;
      }

      const contentSections = buildEmailTemplate(data, isRegister, isCallRequest, dbArtistInfo, coverPhotoHtml);
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin.magnevents.in';
      const bId = job.booking_id || 'new';

      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <body style="background-color: #0f172a; font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #fff;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 24px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 20px;">
              <h2 style="color: #fbbf24; margin: 0; font-size: 20px;">${job.subject}</h2>
              <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Reference: <strong>${referenceCode || 'N/A'}</strong> | ID: ${bId}</p>
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
        from: `"Magnevents System" <${process.env.EMAIL_USER}>`,
        to: job.recipient,
        subject: job.subject,
        html: htmlBody,
      });

      // Also log in emails table
      try {
        await supabase.from('emails').insert([{
          booking_id: job.booking_id,
          recipient_email: job.recipient,
          subject: job.subject,
          body: htmlBody,
          email_type: isRegister ? 'artist_registration' : 'admin_lead_notification',
          status: 'sent',
          created_at: new Date().toISOString()
        }]);
      } catch (logErr) {}

    } else if (job.channel === 'email_customer') {
      const htmlBody = buildCustomerConfirmationHtml(job.payload);

      await transporter.sendMail({
        from: `"Magnevents Concierge" <${process.env.EMAIL_USER}>`,
        to: job.recipient,
        subject: job.subject,
        html: htmlBody,
      });

      try {
        await supabase.from('emails').insert([{
          booking_id: job.booking_id,
          recipient_email: job.recipient,
          subject: job.subject,
          body: htmlBody,
          email_type: 'customer_confirmation',
          status: 'sent',
          created_at: new Date().toISOString()
        }]);
      } catch (logErr) {}

    } else if (job.channel === 'whatsapp_admin') {
      const { data, bookingId, isRegister, isCallRequest, isOffer, dbArtistInfo } = job.payload;
      await sendAdminWhatsAppNotification({
        data,
        bookingId,
        isRegister,
        isCallRequest,
        isOffer,
        dbArtistInfo,
      });
    }

    // 3. Mark job as sent
    await supabase
      .from('notifications_outbox')
      .update({
        status: 'sent',
        last_error: null,
        locked_until: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id);

    return { success: true, channel: job.channel, duration: Date.now() - startTime };

  } catch (err) {
    console.error(`[OutboxProcessor] Error processing job ${job.id} (${job.channel}):`, err.message);

    const newRetryCount = (job.retry_count || 0) + 1;
    const isExhausted = newRetryCount >= (job.max_retries || 5);
    
    // Exponential backoff: 15s * 2^retries + jitter (max 1 hour)
    const backoffSeconds = Math.min(3600, 15 * Math.pow(2, newRetryCount)) + Math.floor(Math.random() * 5);
    const nextRetryAt = new Date(Date.now() + backoffSeconds * 1000).toISOString();

    await supabase
      .from('notifications_outbox')
      .update({
        status: isExhausted ? 'failed' : 'retrying',
        retry_count: newRetryCount,
        next_retry_at: isExhausted ? null : nextRetryAt,
        locked_until: null,
        last_error: err.message || 'Unknown processing error',
        updated_at: new Date().toISOString(),
      })
      .eq('id', job.id);

    return { success: false, channel: job.channel, error: err.message, retryCount: newRetryCount, exhausted: isExhausted };
  }
}

/**
 * Polls and processes all pending/retrying outbox jobs that are due
 */
export async function processPendingOutbox({ supabase, batchSize = 10 }) {
  try {
    const nowIso = new Date().toISOString();

    // Fetch pending or retrying jobs where next_retry_at is <= now or locked_until has expired
    const { data: jobs, error } = await supabase
      .from('notifications_outbox')
      .select('*')
      .or(`status.eq.pending,status.eq.retrying`)
      .lte('next_retry_at', nowIso)
      .limit(batchSize);

    if (error) {
      console.warn('[OutboxProcessor] Failed to query outbox queue:', error.message);
      return { processed: 0, error: error.message };
    }

    if (!jobs || jobs.length === 0) {
      return { processed: 0, message: 'Queue is empty' };
    }

    console.log(`[OutboxProcessor] Processing batch of ${jobs.length} notification jobs...`);
    const results = await Promise.allSettled(
      jobs.map(job => processOutboxJob({ supabase, job }))
    );

    const summary = {
      processed: jobs.length,
      success: results.filter(r => r.status === 'fulfilled' && r.value?.success).length,
      failed: results.filter(r => r.status === 'rejected' || !r.value?.success).length,
    };

    console.log('[OutboxProcessor] Batch summary:', summary);
    return summary;
  } catch (err) {
    console.error('[OutboxProcessor] Batch runner error:', err);
    return { processed: 0, error: err.message };
  }
}
