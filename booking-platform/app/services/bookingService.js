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

export const createWhatsAppLeadUrl = (data = {}) => {
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
  lines.push('⚡ *Generated instantly from Website Form Submission*');

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
};

export const bookingService = {

  submitRequest: async (formData) => {
    // 1. Enrich with cached silent geolocation data if missing
    const cachedGeo = getCachedGeolocation();

    // 2. Auto-detect endpoint, referrer, and keywords in browser
    let pageUrl = formData?.pageUrl || '';
    let pagePath = formData?.pagePath || '';
    let formLink = formData?.formLink || '';
    let referrer = formData?.referrer || '';
    let keywords = formData?.keywords || '';

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

      if (!keywords) {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const searchQ = urlParams.get('q') || urlParams.get('query') || urlParams.get('keyword') || urlParams.get('utm_term') || urlParams.get('vibe');
          if (searchQ) keywords = searchQ;
        } catch (e) {}
      }
    }

    // 3. If still no explicit keywords, intelligently extract key intent keywords from user's message/requirement
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

    const enrichedData = {
      ...formData,
      deviceType,
      userAgent,
      pageUrl,
      pagePath,
      formLink: formLink || pageUrl,
      referrer,
      keywords: keywords || formData?.eventType || 'Live Artist Booking',
      latitude: formData?.latitude || cachedGeo?.latitude || null,
      longitude: formData?.longitude || cachedGeo?.longitude || null,
      detectedLocation: formData?.detectedLocation || cachedGeo?.detectedLocation || null,
      city: formData?.city || cachedGeo?.city || null,
      region: formData?.region || cachedGeo?.region || null,
      country: formData?.country || cachedGeo?.country || null,
      isp: formData?.isp || cachedGeo?.isp || null,
    };

    console.log("Submitting form data to server:", enrichedData);

    // 4. Save last lead WhatsApp link to localStorage only if user wants it later on Thank You page
    let waUrl = '';
    if (typeof window !== 'undefined') {
      waUrl = createWhatsAppLeadUrl(enrichedData);
      try {
        localStorage.setItem('magnevents-last-lead-wa', waUrl);
        localStorage.setItem('magnevents-last-lead-name', enrichedData.name || '');
      } catch (waErr) {}
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrichedData),
        keepalive: true,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Server error: ${res.status}`);
      }

      return {
        success: true,
        message: data.message || "Submission received successfully.",
        waUrl,
        ...data
      };
    } catch (error) {
      console.error("Booking service submission error:", error);
      throw error;
    }
  }
};
