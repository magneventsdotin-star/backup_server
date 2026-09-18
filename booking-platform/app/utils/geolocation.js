/**
 * Geolocation utility to detect user's browser location and reverse geocode coordinates into readable city/address.
 */

export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.address) return null;

    const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.state_district || '';
    const state = data.address.state || '';
    const country = data.address.country || '';
    const displayName = data.display_name || [city, state, country].filter(Boolean).join(', ');

    return {
      city,
      state,
      country,
      displayName,
      address: data.address
    };
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
    return null;
  }
}

export function getUserGeolocation(options = { timeout: 8000, enableHighAccuracy: true }) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve({ success: false, error: 'Geolocation not supported by browser' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        let detectedLocation = '';
        let city = '';

        const geocodeResult = await reverseGeocode(latitude, longitude);
        if (geocodeResult) {
          detectedLocation = geocodeResult.displayName;
          city = geocodeResult.city || geocodeResult.state || '';
        } else {
          detectedLocation = `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`;
        }

        const locationData = {
          success: true,
          latitude,
          longitude,
          accuracy,
          detectedLocation,
          city
        };

        try {
          sessionStorage.setItem('magnevents_user_location', JSON.stringify(locationData));
        } catch (e) {}

        resolve(locationData);
      },
      (error) => {
        console.warn('Geolocation access error:', error.message);
        resolve({
          success: false,
          error: error.message,
          code: error.code
        });
      },
      options
    );
  });
}

export function getCachedGeolocation() {
  if (typeof window === 'undefined') return null;
  try {
    const cached = sessionStorage.getItem('magnevents_user_location');
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    return null;
  }
}
