"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Music, Sparkles } from 'lucide-react';
import './seo-cards.css';

const seoCards = [
  {
    "title": "Wedding Band in Mumbai",
    "link": "/city/mumbai",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Band in Delhi",
    "link": "/city/delhi",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Bangalore",
    "link": "/city/bangalore",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Hyderabad",
    "link": "/city/hyderabad",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Ahmedabad",
    "link": "/city/ahmedabad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Chennai",
    "link": "/city/chennai",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sufi Singer in Kolkata",
    "link": "/city/kolkata",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Surat",
    "link": "/city/surat",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Pune",
    "link": "/city/pune",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Jaipur",
    "link": "/city/jaipur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Lucknow",
    "link": "/city/lucknow",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Singer in Kanpur",
    "link": "/city/kanpur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Nagpur",
    "link": "/city/nagpur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Indore",
    "link": "/city/indore",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Thane",
    "link": "/city/thane",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Bhopal",
    "link": "/city/bhopal",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sufi Singer in Visakhapatnam",
    "link": "/city/visakhapatnam",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Pimpri-Chinchwad",
    "link": "/city/pimpri-chinchwad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Patna",
    "link": "/city/patna",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Vadodara",
    "link": "/city/vadodara",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Ghaziabad",
    "link": "/city/ghaziabad",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Ludhiana",
    "link": "/city/ludhiana",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Agra",
    "link": "/city/agra",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Ghazal Singer in Nashik",
    "link": "/city/nashik",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Band in Ranchi",
    "link": "/city/ranchi",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Faridabad",
    "link": "/city/faridabad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Singer in Meerut",
    "link": "/city/meerut",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Rajkot",
    "link": "/city/rajkot",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Kalyan-Dombivli",
    "link": "/city/kalyan-dombivli",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Vasai-Virar",
    "link": "/city/vasai-virar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Band in Varanasi",
    "link": "/city/varanasi",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Srinagar",
    "link": "/city/srinagar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Aurangabad",
    "link": "/city/aurangabad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Dhanbad",
    "link": "/city/dhanbad",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Amritsar",
    "link": "/city/amritsar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Navi Mumbai",
    "link": "/city/navi-mumbai",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Singer in Allahabad",
    "link": "/city/allahabad",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Howrah",
    "link": "/city/howrah",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Gwalior",
    "link": "/city/gwalior",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Jabalpur",
    "link": "/city/jabalpur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Coimbatore",
    "link": "/city/coimbatore",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Singer in Vijayawada",
    "link": "/city/vijayawada",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Jodhpur",
    "link": "/city/jodhpur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Madurai",
    "link": "/city/madurai",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Singer in Raipur",
    "link": "/city/raipur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Kota",
    "link": "/city/kota",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Chandigarh",
    "link": "/city/chandigarh",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Guwahati",
    "link": "/city/guwahati",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Ghazal Singer in Solapur",
    "link": "/city/solapur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Hubli-Dharwad",
    "link": "/city/hubli-dharwad",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Band in Mysore",
    "link": "/city/mysore",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Tiruchirappalli",
    "link": "/city/tiruchirappalli",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Singer in Bareilly",
    "link": "/city/bareilly",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Aligarh",
    "link": "/city/aligarh",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Band in Tiruppur",
    "link": "/city/tiruppur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Gurgaon",
    "link": "/city/gurgaon",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Moradabad",
    "link": "/city/moradabad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Jalandhar",
    "link": "/city/jalandhar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Ghazal Singer in Bhubaneswar",
    "link": "/city/bhubaneswar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Salem",
    "link": "/city/salem",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Warangal",
    "link": "/city/warangal",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Mira-Bhayandar",
    "link": "/city/mira-bhayandar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Jalgaon",
    "link": "/city/jalgaon",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Guntur",
    "link": "/city/guntur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Thiruvananthapuram",
    "link": "/city/thiruvananthapuram",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Bhiwandi",
    "link": "/city/bhiwandi",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sufi Singer in Saharanpur",
    "link": "/city/saharanpur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Band in Gorakhpur",
    "link": "/city/gorakhpur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Bikaner",
    "link": "/city/bikaner",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Amravati",
    "link": "/city/amravati",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Noida",
    "link": "/city/noida",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Jamshedpur",
    "link": "/city/jamshedpur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Singer in Bhilai",
    "link": "/city/bhilai",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Music in Cuttack",
    "link": "/city/cuttack",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Firozabad",
    "link": "/city/firozabad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Kochi",
    "link": "/city/kochi",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Nellore",
    "link": "/city/nellore",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Bhavnagar",
    "link": "/city/bhavnagar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Dehradun",
    "link": "/city/dehradun",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Durgapur",
    "link": "/city/durgapur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Asansol",
    "link": "/city/asansol",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Rourkela",
    "link": "/city/rourkela",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Nanded",
    "link": "/city/nanded",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Kolhapur",
    "link": "/city/kolhapur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Ajmer",
    "link": "/city/ajmer",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Akola",
    "link": "/city/akola",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Gulbarga",
    "link": "/city/gulbarga",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Singer in Jamnagar",
    "link": "/city/jamnagar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Ujjain",
    "link": "/city/ujjain",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Loni",
    "link": "/city/loni",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Siliguri",
    "link": "/city/siliguri",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Band in Jhansi",
    "link": "/city/jhansi",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Singer in Ulhasnagar",
    "link": "/city/ulhasnagar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Jammu",
    "link": "/city/jammu",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Music in Sangli-Miraj & Kupwad",
    "link": "/city/sangli-miraj-and-kupwad",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Mangalore",
    "link": "/city/mangalore",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Erode",
    "link": "/city/erode",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Belgaum",
    "link": "/city/belgaum",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Ambattur",
    "link": "/city/ambattur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Tirunelveli",
    "link": "/city/tirunelveli",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Band in Malegaon",
    "link": "/city/malegaon",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Gaya",
    "link": "/city/gaya",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Udaipur",
    "link": "/city/udaipur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Singer in Maheshtala",
    "link": "/city/maheshtala",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Davanagere",
    "link": "/city/davanagere",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Kozhikode",
    "link": "/city/kozhikode",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Kurnool",
    "link": "/city/kurnool",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Rajpur Sonarpur",
    "link": "/city/rajpur-sonarpur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Rajahmundry",
    "link": "/city/rajahmundry",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Bokaro",
    "link": "/city/bokaro",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in South Dumdum",
    "link": "/city/south-dumdum",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Bellary",
    "link": "/city/bellary",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Patiala",
    "link": "/city/patiala",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Gopalpur",
    "link": "/city/gopalpur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Agartala",
    "link": "/city/agartala",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Bhagalpur",
    "link": "/city/bhagalpur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Muzaffarnagar",
    "link": "/city/muzaffarnagar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Bhatpara",
    "link": "/city/bhatpara",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Panihati",
    "link": "/city/panihati",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Music in Latur",
    "link": "/city/latur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Dhule",
    "link": "/city/dhule",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Tirupati",
    "link": "/city/tirupati",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Rohtak",
    "link": "/city/rohtak",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Korba",
    "link": "/city/korba",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Bhilwara",
    "link": "/city/bhilwara",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Berhampur",
    "link": "/city/berhampur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Muzaffarpur",
    "link": "/city/muzaffarpur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Ahmednagar",
    "link": "/city/ahmednagar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Mathura",
    "link": "/city/mathura",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Kollam",
    "link": "/city/kollam",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Avadi",
    "link": "/city/avadi",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Singer in Kadapa",
    "link": "/city/kadapa",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Kamarhati",
    "link": "/city/kamarhati",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Sambalpur",
    "link": "/city/sambalpur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Bilaspur",
    "link": "/city/bilaspur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Shahjahanpur",
    "link": "/city/shahjahanpur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Ghazal Singer in Satara",
    "link": "/city/satara",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Bijapur",
    "link": "/city/bijapur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Rampur",
    "link": "/city/rampur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Shivamogga",
    "link": "/city/shivamogga",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Chandrapur",
    "link": "/city/chandrapur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Junagadh",
    "link": "/city/junagadh",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Thrissur",
    "link": "/city/thrissur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Alwar",
    "link": "/city/alwar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Bardhaman",
    "link": "/city/bardhaman",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Kulti",
    "link": "/city/kulti",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Kakinada",
    "link": "/city/kakinada",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Music in Nizamabad",
    "link": "/city/nizamabad",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Sufi Singer in Parbhani",
    "link": "/city/parbhani",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Tumkur",
    "link": "/city/tumkur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Khammam",
    "link": "/city/khammam",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Ozhukarai",
    "link": "/city/ozhukarai",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Bihar Sharif",
    "link": "/city/bihar-sharif",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Panipat",
    "link": "/city/panipat",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Band in Darbhanga",
    "link": "/city/darbhanga",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Bally",
    "link": "/city/bally",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Band in Aizawl",
    "link": "/city/aizawl",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Dewas",
    "link": "/city/dewas",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Ichalkaranji",
    "link": "/city/ichalkaranji",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Karnal",
    "link": "/city/karnal",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Bathinda",
    "link": "/city/bathinda",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Jalna",
    "link": "/city/jalna",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Eluru",
    "link": "/city/eluru",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Barasat",
    "link": "/city/barasat",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Kirari Suleman Nagar",
    "link": "/city/kirari-suleman-nagar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Band in Purnia",
    "link": "/city/purnia",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Satna",
    "link": "/city/satna",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Mau",
    "link": "/city/mau",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Sonipat",
    "link": "/city/sonipat",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Farrukhabad",
    "link": "/city/farrukhabad",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Sagar",
    "link": "/city/sagar",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Durg",
    "link": "/city/durg",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Imphal",
    "link": "/city/imphal",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Ratlam",
    "link": "/city/ratlam",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Hapur",
    "link": "/city/hapur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Band in Anantapur",
    "link": "/city/anantapur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Arrah",
    "link": "/city/arrah",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Music in Karimnagar",
    "link": "/city/karimnagar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Etawah",
    "link": "/city/etawah",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Ambernath",
    "link": "/city/ambernath",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Singer for Events in North Dumdum",
    "link": "/city/north-dumdum",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Singer in Bharatpur",
    "link": "/city/bharatpur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Begusarai",
    "link": "/city/begusarai",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in New Delhi",
    "link": "/city/new-delhi",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Gandhidham",
    "link": "/city/gandhidham",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Baranagar",
    "link": "/city/baranagar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Tiruvottiyur",
    "link": "/city/tiruvottiyur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Band in Puducherry",
    "link": "/city/puducherry",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Sikar",
    "link": "/city/sikar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Thoothukudi",
    "link": "/city/thoothukudi",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Rewa",
    "link": "/city/rewa",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Mirzapur",
    "link": "/city/mirzapur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Raichur",
    "link": "/city/raichur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Pali",
    "link": "/city/pali",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Ramagundam",
    "link": "/city/ramagundam",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Silchar",
    "link": "/city/silchar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Haridwar",
    "link": "/city/haridwar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Band in Vijayanagaram",
    "link": "/city/vijayanagaram",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Tenali",
    "link": "/city/tenali",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Nagercoil",
    "link": "/city/nagercoil",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Sri Ganganagar",
    "link": "/city/sri-ganganagar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Karawal Nagar",
    "link": "/city/karawal-nagar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Music in Mango",
    "link": "/city/mango",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Thanjavur",
    "link": "/city/thanjavur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Sufi Singer in Bulandshahr",
    "link": "/city/bulandshahr",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Uluberia",
    "link": "/city/uluberia",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Ghazal Singer in Katni",
    "link": "/city/katni",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Music in Sambhal",
    "link": "/city/sambhal",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Singrauli",
    "link": "/city/singrauli",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Nadiad",
    "link": "/city/nadiad",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Secunderabad",
    "link": "/city/secunderabad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Band in Naihati",
    "link": "/city/naihati",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Singer in Yamunanagar",
    "link": "/city/yamunanagar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Bidhannagar",
    "link": "/city/bidhannagar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Band in Pallavaram",
    "link": "/city/pallavaram",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Bidar",
    "link": "/city/bidar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sufi Singer in Munger",
    "link": "/city/munger",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Singer in Panchkula",
    "link": "/city/panchkula",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Burhanpur",
    "link": "/city/burhanpur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Music in Raurkela Industrial Township",
    "link": "/city/raurkela-industrial-township",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Kharagpur",
    "link": "/city/kharagpur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Dindigul",
    "link": "/city/dindigul",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Gandhinagar",
    "link": "/city/gandhinagar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Hospet",
    "link": "/city/hospet",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Nangloi Jat",
    "link": "/city/nangloi-jat",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Malda",
    "link": "/city/malda",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Ghazal Singer in Ongole",
    "link": "/city/ongole",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Deoghar",
    "link": "/city/deoghar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Chapra",
    "link": "/city/chapra",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Singer in Haldia",
    "link": "/city/haldia",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Khandwa",
    "link": "/city/khandwa",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Nandyal",
    "link": "/city/nandyal",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Morena",
    "link": "/city/morena",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Amroha",
    "link": "/city/amroha",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Anand",
    "link": "/city/anand",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Bhind",
    "link": "/city/bhind",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Bhalswa Jahangir Pur",
    "link": "/city/bhalswa-jahangir-pur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Madhyamgram",
    "link": "/city/madhyamgram",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Bhiwani",
    "link": "/city/bhiwani",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Music in Berhampore",
    "link": "/city/berhampore",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Ambala",
    "link": "/city/ambala",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Singer in Morbi",
    "link": "/city/morbi",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Fatehpur",
    "link": "/city/fatehpur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Raebareli",
    "link": "/city/raebareli",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Khora",
    "link": "/city/khora",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Band in Chittoor",
    "link": "/city/chittoor",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Bhusawal",
    "link": "/city/bhusawal",
    "type": "party",
    "subtext": ""
  }
];

export default function SeoCardsSection() {
  return (
    <section className="seo-cards-section">
      <div className="seo-cards-container">
        <div className="seo-cards-header">
          <h2>Find the Best Singers Across India</h2>
          <p>Book top-rated live musicians for your weddings, house parties, and corporate events in any city.</p>
        </div>
        
        <div className="seo-cards-scroll-wrapper">
          <div className="seo-cards-flex">
            {seoCards.map((card, idx) => (
              <Link href={card.link} key={idx} className="seo-card group">
                <div className="seo-card-icon">
                  {card.type === 'wedding' && <Sparkles size={24} />}
                  {card.type === 'party' && <Music size={24} />}
                  {card.type === 'live' && <MapPin size={24} />}
                  {card.type === 'corporate' && <Music size={24} />}
                </div>
                <div className="seo-card-content">
                  <h3>{card.title}</h3>
                  {card.subtext && <p className="seo-card-subtext">{card.subtext}</p>}
                  <span className="seo-card-link-text">Explore Artists →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      
    </section>
  );
}
