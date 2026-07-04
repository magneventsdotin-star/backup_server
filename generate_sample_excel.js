const XLSX = require('./admin_dahsboard/node_modules/xlsx');
const fs = require('fs');
const path = require('path');

const templateData = [
  {
    name: 'DJ Horizon',
    alias: 'Horizon',
    category: 'DJ',
    sub_categories: 'EDM, House, Trance',
    languages: 'English',
    bio: 'DJ Horizon is an electrifying performer known for keeping the crowd jumping all night with seamless transitions and massive drops. He has been in the industry for 10 years.',
    price_min: '25000',
    price_max: '60000',
    original_price: '75000',
    city: 'Bangalore',
    state: 'Karnataka',
    locality: 'Koramangala',
    address: '456 Club Road',
    members_min: '1',
    members_max: '2',
    contact_person: 'Rahul Sharma',
    phone_no: `98765${Math.floor(10000 + Math.random() * 90000)}`,
    email: `horizon_${Math.floor(Math.random() * 100000)}@example.com`,
    is_live: 'true',
    rating: '4.8'
  },
  {
    name: 'The Sonic Band',
    alias: 'Sonic',
    category: 'Live Band',
    sub_categories: 'Rock, Pop, Indie',
    languages: 'Hindi, English',
    bio: 'The Sonic Band brings a fresh acoustic and electric vibe to any event. With a charismatic lead singer and incredible instrumentalists, they create a memorable experience for all guests.',
    price_min: '40000',
    price_max: '120000',
    original_price: '150000',
    city: 'New Delhi',
    state: 'Delhi',
    locality: 'Connaught Place',
    address: '789 Music Avenue',
    members_min: '4',
    members_max: '6',
    contact_person: 'Priya Patel',
    phone_no: `98765${Math.floor(10000 + Math.random() * 90000)}`,
    email: `sonicband_${Math.floor(Math.random() * 100000)}@example.com`,
    is_live: 'true',
    rating: '4.9'
  }
];

const ws = XLSX.utils.json_to_sheet(templateData);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Artists");

// Generate buffer
const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

// Save file
const filePath = path.join(process.env.USERPROFILE || process.env.HOME || '', 'Desktop', 'Sample_4_Artists_New.xlsx');
XLSX.writeFileSync(wb, filePath);

console.log(`Successfully generated sample excel at: ${filePath}`);
