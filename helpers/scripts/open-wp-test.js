const { formatWhatsAppNotification } = require('../../booking-platform/app/services/api/whatsapp.service.js');
const { exec } = require('child_process');

const artistRequestData = {
  name: 'Rohit Rawat',
  phone: '9170159496',
  email: 'rohit.music@gmail.com',
  category: 'Live Singer & Acoustic Performer',
  city: 'Delhi NCR',
  price: '25000',
  portfolio: 'https://instagram.com/rohit_live_music',
  bio: 'Versatile Bollywood, Sufi and Pop vocalist with 5+ years of stage experience across 200+ events.',
  formName: 'Artist Registration Portal',
  pageUrl: 'https://magnevents.in/register/artist',
  device: '💻 Windows PC'
};

const message = formatWhatsAppNotification({
  data: artistRequestData,
  bookingId: 'art_req_9021',
  isRegister: true
});

console.log('--- FORMATTED ARTIST NOTIFICATION ---');
console.log(message);

// Target Admin Number: 917355931587 (or you can send to 9170159496)
const targetNumber = '917355931587';
const encodedMsg = encodeURIComponent(message);
const waUrl = `https://wa.me/${targetNumber}?text=${encodedMsg}`;

console.log('\n--- OPENING WHATSAPP ---');
console.log(waUrl);

exec(`start "" "${waUrl}"`, (err) => {
  if (err) {
    console.error("Failed to launch WhatsApp URL:", err);
  } else {
    console.log("Successfully launched WhatsApp chat on desktop!");
  }
});
