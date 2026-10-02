import { getCachedGeolocation } from '../utils/geolocation';

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

export const createWhatsAppLeadUrl = (data = {}, referenceCode = '') => {
  const adminPhoneRaw = process.env.NEXT_PUBLIC_ADMIN_PHONE || '917355931587';
  const adminPhone = adminPhoneRaw.replace(/[^0-9]/g, '');
  const name = data.name || 'Client';
  const phone = data.phone || 'N/A';
  const email = data.email || 'N/A';
  const isRegister = data.type === 'register' || data.formType === 'register' || data.type === 'artist_registration';
  const isCall = data.type === 'call_request';
  const eventType = isRegister ? 'Artist Registration' : (isCall ? 'Quick Call Request' : (data.eventType || 'Event Booking'));
  const eventDate = data.date || 'To be decided';
  const budget = budgetMap[data.budget] || data.budget || (data.price ? `₹${data.price}` : 'Quote on Request');
  const location = data.location || data.city || data.detectedLocation || 'Delhi NCR';

  let artistRequested = '';
  if (data.selectedArtist) {
    artistRequested = typeof data.selectedArtist === 'object' ? data.selectedArtist.name : data.selectedArtist;
  } else if (data.artistType && data.artistType.length > 0) {
    artistRequested = Array.isArray(data.artistType) ? data.artistType.join(', ') : data.artistType;
  } else if (data.category) {
    artistRequested = data.category;
  }

  let title = '🌟 *NEW BOOKING INQUIRY (Magnevents)*';
  if (isRegister) title = '🎤 *NEW ARTIST REGISTRATION (Magnevents)*';
  else if (isCall) title = '📞 *NEW CALL REQUEST (Magnevents)*';

  const lines = [
    title,
    '━━━━━━━━━━━━━━━━━━━━',
    ...(referenceCode ? [`🔖 *Ref Code:* ${referenceCode}`] : []),
    `👤 *Name:* ${name}`,
    `📱 *Phone:* ${phone}`,
    `📧 *Email:* ${email}`,
    `🎭 *Requirement:* ${eventType}`,
    `📅 *Event Date:* ${eventDate}`,
    `📍 *Location:* ${location}`,
    `💰 *Budget:* ${budget}`
  ];

  if (artistRequested) {
    lines.push(`🎨 *Artist/Category:* ${artistRequested}`);
  }

  if (data.selectedPlan && typeof data.selectedPlan === 'object') {
    lines.push(`📦 *Package:* ${data.selectedPlan.name} (${data.selectedPlan.price || ''})`);
  }

  if (data.message || data.bio) {
    lines.push(`📝 *Message:* "${(data.message || data.bio).substring(0, 200)}"`);
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push('⚡ *Generated from Website Form Submission*');

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
};

export const bookingService = {

  submitRequest: async (formData) => {
    // 1. Enrich with cached silent geolocation data
    const cachedGeo = getCachedGeolocation();

    // 2. Auto-detect endpoint, referrer, UTM and keywords in browser
    let pageUrl = formData?.pageUrl || '';
    let pagePath = formData?.pagePath || '';
    let formLink = formData?.formLink || '';
    let referrer = formData?.referrer || '';
    let keywords = formData?.keywords || '';
    let utmSource = formData?.utm_source || '';
    let utmMedium = formData?.utm_medium || '';
    let utmCampaign = formData?.utm_campaign || '';

    let deviceType = formData?.deviceType || 'Desktop';
    let userAgent = '';

    if (typeof window !== 'undefined') {
      userAgent = navigator.userAgent || '';
      if (!formData?.deviceType) {
        if (window.innerWidth <= 768 || /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
          deviceType = 'Mobile';
        } else if (window.innerWidth <= 1024 || /iPad|Tablet/i.test(navigator.userAgent)) {
          deviceType = 'Tablet';
        }
      }
      if (!pageUrl) pageUrl = window.location.href;
      if (!pagePath) pagePath = window.location.pathname;
      if (!formLink) formLink = window.location.href;
      if (!referrer) {
        referrer = document.referrer ? (document.referrer.includes(window.location.hostname) ? 'Internal Site' : document.referrer) : 'Direct Visit';
      }

      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (!keywords) {
          keywords = urlParams.get('q') || urlParams.get('query') || urlParams.get('keyword') || urlParams.get('utm_term') || urlParams.get('vibe') || '';
        }
        if (!utmSource) utmSource = urlParams.get('utm_source') || '';
        if (!utmMedium) utmMedium = urlParams.get('utm_medium') || '';
        if (!utmCampaign) utmCampaign = urlParams.get('utm_campaign') || '';
      } catch (e) {}
    }

    // 3. Keyword extraction fallback
    if (!keywords && (formData?.message || formData?.requirement)) {
      const text = (formData.message || formData.requirement || '').toLowerCase();
      const matched = [];
      const KNOWN_KEYWORDS = [
        'live band', 'singer', 'ghazal', 'sufi', 'bollywood', 'wedding', 'sangeet', 
        'acoustic', 'dj', 'rock band', 'qawwali', 'cocktail', 'reception', 'house party',
        'punjabi', 'corporate', 'celebrity', 'classical', 'flute', 'violin', 'dhol'
      ];
      for (const kw of KNOWN_KEYWORDS) {
        if (text.includes(kw)) {
          matched.push(kw.charAt(0).toUpperCase() + kw.slice(1));
        }
      }
      if (matched.length > 0) {
        keywords = matched.slice(0, 3).join(', ');
      }
    }

    // 4. Generate client idempotency key for safe retries
    const idempotencyKey = formData?.idempotencyKey || `mag_idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const enrichedData = {
      ...formData,
      idempotencyKey,
      deviceType,
      userAgent,
      pageUrl,
      pagePath,
      formLink: formLink || pageUrl,
      referrer,
      keywords: keywords || formData?.eventType || 'Live Artist Booking',
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      latitude: formData?.latitude || cachedGeo?.latitude || null,
      longitude: formData?.longitude || cachedGeo?.longitude || null,
      detectedLocation: formData?.detectedLocation || cachedGeo?.detectedLocation || null,
      city: formData?.city || cachedGeo?.city || null,
      region: formData?.region || cachedGeo?.region || null,
      country: formData?.country || cachedGeo?.country || null,
      isp: formData?.isp || cachedGeo?.isp || null,
    };

    console.log("[BookingService] Submitting payload to /api/contact:", enrichedData);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': idempotencyKey,
        },
        body: JSON.stringify(enrichedData),
        keepalive: true,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Server error (${res.status}): Failed to save booking.`);
      }

      const referenceCode = data.referenceCode || 'MAG-CONFIRMED';
      const waUrl = createWhatsAppLeadUrl(enrichedData, referenceCode);

      // Save to localStorage for Thank You page & fast recovery
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('magnevents-form-filled', 'true');
          localStorage.setItem('magnevents-last-lead-ref', referenceCode);
          localStorage.setItem('magnevents-last-lead-id', data.bookingId || '');
          localStorage.setItem('magnevents-last-lead-wa', waUrl);
          localStorage.setItem('magnevents-last-lead-name', enrichedData.name || '');
          window.dispatchEvent(new Event('form-filled'));
        } catch (stErr) {}
      }

      return {
        success: true,
        bookingId: data.bookingId,
        referenceCode,
        message: data.message || `Thank you! Your enquiry has been received successfully. Your reference number is ${referenceCode}.`,
        waUrl,
        ...data,
      };
    } catch (error) {
      console.error("[BookingService] Submission error:", error);
      throw error;
    }
  }
};
