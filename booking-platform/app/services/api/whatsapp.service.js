/**
 * Magnevents Admin WhatsApp Notification Service
 * Sends instant notifications to Admin WhatsApp when any user submits a form.
 * Supports:
 * 1. Webhooks (Zapier / Make / Pabbly / UltraMsg / Green API / Custom)
 * 2. Meta WhatsApp Cloud API
 * 3. UltraMsg API
 * 4. Twilio WhatsApp API
 */

export const formatWhatsAppNotification = ({
  data = {},
  bookingId = null,
  isRegister = false,
  isCallRequest = false,
  isOffer = false,
  dbArtistInfo = null
}) => {
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://admin.magnevents.in';
  const name = data.name || 'Anonymous User';
  const phone = data.phone || 'N/A';
  const email = data.email || 'N/A';
  const eventType = isRegister ? 'Artist Registration' : (isCallRequest ? 'Quick Call Request' : (data.eventType || 'Event Booking'));
  const eventDate = data.date || 'To be decided';
  const budgetMap = {
    '5k_10k': '₹5,000 - ₹10,000',
    '10k_20k': '₹10,000 - ₹20,000',
    '20k_35k': '₹20,000 - ₹35,000',
    '35k_50k': '₹35,000 - ₹50,000',
    '50k_80k': '₹50,000 - ₹80,000',
    '80k_1.2L': '₹80,000 - ₹1,20,000',
    '1.2L_1.5L': '₹1,20,000 - ₹1,50,000',
    '1.5L_2L': '₹1,50,000 - ₹2,00,000',
    '2L_3L': '₹2,00,000 - ₹3,00,000',
    '3L_5L': '₹3,00,000 - ₹5,00,000',
    '5L_plus': '₹5,00,000+'
  };
  const rawBudget = data.budget || (data.price ? `₹${data.price}` : '');
  const budget = budgetMap[rawBudget] || rawBudget || 'Quote on Request';
  const location = data.location || data.city || data.detectedLocation || 'Not specified';
  const detectedLocation = data.detectedLocation || data.detected_location || '';
  const message = data.message || data.bio || data.notes || '';
  
  let artistRequested = '';
  if (data.selectedArtist) {
    artistRequested = typeof data.selectedArtist === 'object' ? data.selectedArtist.name : data.selectedArtist;
  } else if (data.artistType && data.artistType.length > 0) {
    artistRequested = Array.isArray(data.artistType) ? data.artistType.join(', ') : data.artistType;
  } else if (data.category) {
    artistRequested = data.category;
  }

  let title = '🌟 *NEW BOOKING INQUIRY - MAGNEVENTS*';
  if (isRegister) title = '🎤 *NEW ARTIST REGISTRATION*';
  else if (isCallRequest) title = '📞 *NEW CALL REQUEST ALERT*';
  else if (isOffer) title = '🔥 *DISCOUNT PROMO INQUIRY*';

  const cleanClientPhone = phone.replace(/[^0-9]/g, '');
  const encodedName = encodeURIComponent(name);
  const encodedEvent = encodeURIComponent(eventType);
  const directReplyLink = cleanClientPhone.length >= 10 
    ? `https://wa.me/${cleanClientPhone.startsWith('91') || cleanClientPhone.length > 10 ? cleanClientPhone : `91${cleanClientPhone}`}?text=Hi%20${encodedName},%20this%20is%20Magnevents!%20We%20received%20your%20inquiry%20for%20${encodedEvent}.%20How%20can%20we%20assist%20you%20today?`
    : '';

  const reviewLink = isRegister
    ? `${adminUrl}/dashboard/artist-requests?reply=${bookingId || 'new'}`
    : `${adminUrl}/dashboard/requests?reply=${bookingId || 'new'}`;

  const lines = [
    title,
    '━━━━━━━━━━━━━━━━━━━━',
    `👤 *Client / Name:* ${name}`,
    `📱 *Phone:* ${phone}`,
    `📧 *Email:* ${email}`,
    `🎭 *Requirement:* ${eventType}`,
    `📅 *Event Date:* ${eventDate}`,
    `📍 *Location:* ${location}${detectedLocation && detectedLocation !== location ? ` (Detected: ${detectedLocation})` : ''}`,
    `💰 *Budget:* ${budget}`,
  ];

  if (artistRequested) {
    lines.push(`🎨 *Artist/Category:* ${artistRequested}`);
  }

  if (data.selectedPlan && typeof data.selectedPlan === 'object') {
    lines.push(`📦 *Selected Plan:* ${data.selectedPlan.name} (${data.selectedPlan.price || ''})`);
  }

  if (data.selectedService && typeof data.selectedService === 'object') {
    lines.push(`🛠️ *Selected Service:* ${data.selectedService.title}`);
  }

  if (message) {
    lines.push(`📝 *Message:* "${message.substring(0, 300)}"`);
  }

  if (data.pageUrl || data.pagePath || data.formName || data.formLink || data.device || data.deviceInfo) {
    lines.push('━━━━━━━━━━━━━━━━━━━━');
    if (data.pageUrl || data.pagePath || data.formName || data.formLink) {
      const source = data.formName || data.formLink || data.pageUrl || data.pagePath || 'Direct Web Form';
      lines.push(`📋 *Source:* ${source}`);
    }
    if (data.device || data.deviceInfo) {
      lines.push(`🖥️ *Device:* ${data.device || data.deviceInfo}`);
    }
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━');

  if (directReplyLink) {
    lines.push(`💬 *Direct WhatsApp Reply to Client:*`);
    lines.push(directReplyLink);
    lines.push('');
  }

  lines.push(`⚡ *Review in Admin Portal:*`);
  lines.push(reviewLink);

  return lines.join('\n');
};

/**
 * Dispatch notification to Admin WhatsApp
 */
export async function sendAdminWhatsAppNotification({
  data = {},
  bookingId = null,
  isRegister = false,
  isCallRequest = false,
  isOffer = false,
  dbArtistInfo = null
}) {
  const adminPhoneRaw = process.env.ADMIN_WHATSAPP_PHONE || process.env.NEXT_PUBLIC_ADMIN_PHONE || '918076515257';
  const cleanAdminPhone = adminPhoneRaw.replace(/[^0-9]/g, '');
  const targetPhone = cleanAdminPhone.startsWith('91') || cleanAdminPhone.length > 10 ? cleanAdminPhone : `91${cleanAdminPhone}`;

  const messageText = formatWhatsAppNotification({
    data,
    bookingId,
    isRegister,
    isCallRequest,
    isOffer,
    dbArtistInfo
  });

  const callmebotKey = process.env.CALLMEBOT_API_KEY;
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL || process.env.ADMIN_WHATSAPP_WEBHOOK_URL;
  const cloudApiToken = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const cloudPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const ultramsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
  const ultramsgToken = process.env.ULTRAMSG_TOKEN;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_NUMBER;

  let dispatched = false;
  let provider = 'none';

  // 1. CallMeBot Dispatch (100% Free instant WhatsApp message to personal phone)
  if (callmebotKey) {
    try {
      provider = 'callmebot';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const callmeUrl = `https://api.callmebot.com/whatsapp.php?phone=+${targetPhone}&text=${encodeURIComponent(messageText)}&apikey=${callmebotKey}`;
      const res = await fetch(callmeUrl, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        console.log(`[WhatsApp Service] Successfully sent via CallMeBot to +${targetPhone}`);
        dispatched = true;
      } else {
        console.warn(`[WhatsApp Service] CallMeBot returned status ${res.status}`);
      }
    } catch (cmErr) {
      console.warn('[WhatsApp Service] CallMeBot dispatch error:', cmErr.message);
    }
  }

  // 2. Webhook Dispatch (Zapier / Make / UltraMsg / GreenAPI / Custom Webhook)
  if (!dispatched && webhookUrl) {
    try {
      provider = 'webhook';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: targetPhone,
          message: messageText,
          text: messageText,
          phone: targetPhone,
          bookingId,
          data
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        console.log(`[WhatsApp Service] Successfully sent via Webhook to ${targetPhone}`);
        dispatched = true;
      } else {
        console.warn(`[WhatsApp Service] Webhook returned status ${res.status}`);
      }
    } catch (webhookErr) {
      console.warn('[WhatsApp Service] Webhook dispatch error:', webhookErr.message);
    }
  }

  // 2. Meta WhatsApp Cloud API
  if (!dispatched && cloudApiToken && cloudPhoneId) {
    try {
      provider = 'meta_cloud_api';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`https://graph.facebook.com/v18.0/${cloudPhoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cloudApiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: targetPhone,
          type: 'text',
          text: { body: messageText }
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        console.log(`[WhatsApp Service] Successfully sent via Meta Cloud API to ${targetPhone}`);
        dispatched = true;
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.warn('[WhatsApp Service] Meta Cloud API error:', errJson);
      }
    } catch (cloudErr) {
      console.warn('[WhatsApp Service] Meta Cloud API dispatch error:', cloudErr.message);
    }
  }

  // 3. UltraMsg API
  if (!dispatched && ultramsgInstance && ultramsgToken) {
    try {
      provider = 'ultramsg';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`https://api.ultramsg.com/${ultramsgInstance}/messages/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: ultramsgToken,
          to: targetPhone,
          body: messageText
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        console.log(`[WhatsApp Service] Successfully sent via UltraMsg to ${targetPhone}`);
        dispatched = true;
      }
    } catch (ultraErr) {
      console.warn('[WhatsApp Service] UltraMsg dispatch error:', ultraErr.message);
    }
  }

  // 4. Twilio WhatsApp API
  if (!dispatched && twilioSid && twilioAuth && twilioFrom) {
    try {
      provider = 'twilio';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
      const params = new URLSearchParams();
      params.append('From', twilioFrom.startsWith('whatsapp:') ? twilioFrom : `whatsapp:${twilioFrom}`);
      params.append('To', `whatsapp:+${targetPhone}`);
      params.append('Body', messageText);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString(),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        console.log(`[WhatsApp Service] Successfully sent via Twilio to ${targetPhone}`);
        dispatched = true;
      }
    } catch (twilioErr) {
      console.warn('[WhatsApp Service] Twilio dispatch error:', twilioErr.message);
    }
  }

  if (!dispatched) {
    console.log(`[WhatsApp Service] Admin WhatsApp Notification Formatted for +${targetPhone}:\n${messageText}`);
  }

  return {
    success: dispatched,
    provider,
    targetPhone,
    message: messageText
  };
}
