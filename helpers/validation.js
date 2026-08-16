export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return "Name must be at least 2 characters long.";
  }
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
    return "Name should only contain letters and spaces.";
  }
  return null; // Valid
};

export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return "Email address is required.";
  }
  if (!email.includes('@')) {
    return "Email must contain '@'.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }
  return null; 
};

export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return "Phone number is required.";
  }
  
  if (phone.includes('.')) {
    return "Phone number cannot contain dots.";
  }

  // Remove valid non-digit characters (+, -, space) to count actual digits
  const digitsOnly = phone.replace(/[\s+-]/g, '');
  if (!/^\d{10,15}$/.test(digitsOnly)) {
    return "Please enter a valid phone number containing 10-15 digits.";
  }

  // Ensure no other weird characters exist
  const strictRegex = /^\+?[\d\s-]+$/;
  if (!strictRegex.test(phone)) {
    return "Please enter a valid phone number. Only numbers, +, -, and spaces are allowed.";
  }

  return null;
};
