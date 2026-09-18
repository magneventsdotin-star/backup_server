import { getCachedGeolocation } from '@/app/utils/geolocation';

export const bookingService = {

  submitRequest: (formData) => {
    // Enrich with cached geolocation data if missing
    const cachedGeo = getCachedGeolocation();
    const enrichedData = {
      ...formData,
      latitude: formData?.latitude || cachedGeo?.latitude || null,
      longitude: formData?.longitude || cachedGeo?.longitude || null,
      detectedLocation: formData?.detectedLocation || cachedGeo?.detectedLocation || null,
    };

    console.log("Submitting form data to server in background:", enrichedData);

    // Run the API call in the background without awaiting it
    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrichedData),
      keepalive: true,
    }).catch(error => {
      console.error("Background booking service error:", error);
    });

    // Return success immediately to make the UI feel fast
    return Promise.resolve({
      success: true,
      message: "Submission received successfully."
    });
  }
};

