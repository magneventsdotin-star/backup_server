export const bookingService = {

  submitRequest: (formData) => {
    console.log("Submitting form data to server in background:", formData);

    fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      keepalive: true,
    }).catch(error => {
      console.error("Background booking service error:", error);
    });

    return Promise.resolve({
      success: true,
      message: "Submission received successfully."
    });
  }
};
