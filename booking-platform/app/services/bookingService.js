export const bookingService = {

  submitRequest: async (formData) => {
    console.log("Submitting form data to server:", formData);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMsg = "Failed to submit request.";
        try {
          const errorData = await response.json();
          if (errorData.error) errorMsg = errorData.error;
        } catch (e) {
          // JSON parsing failed, use default error
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || "Submission received successfully."
      };
    } catch (error) {
      console.error("Booking service error:", error);
      throw error;
    }
  }
};
