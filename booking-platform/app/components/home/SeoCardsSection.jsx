"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Music, Sparkles } from 'lucide-react';
import './seo-cards.css';

const seoCards = [
  {
    "title": "Wedding Band in Mumbai",
    "link": "/artists?category=Live%20band&city=Mumbai",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Band in Delhi",
    "link": "/artists?category=Live%20band&city=Delhi",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Bangalore",
    "link": "/artists?category=Musician&city=Bangalore",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Hyderabad",
    "link": "/artists?category=Live%20band&city=Hyderabad",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Ahmedabad",
    "link": "/artists?category=Singer&city=Ahmedabad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Chennai",
    "link": "/artists?category=Singer&city=Chennai",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sufi Singer in Kolkata",
    "link": "/artists?category=Singer&city=Kolkata",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Surat",
    "link": "/artists?category=Musician&city=Surat",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Pune",
    "link": "/artists?category=Singer&city=Pune",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Jaipur",
    "link": "/artists?category=Singer&city=Jaipur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Lucknow",
    "link": "/artists?category=Musician&city=Lucknow",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Singer in Kanpur",
    "link": "/artists?category=Singer&city=Kanpur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Nagpur",
    "link": "/artists?category=Singer&city=Nagpur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Indore",
    "link": "/artists?category=Singer&city=Indore",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Thane",
    "link": "/artists?category=Singer&city=Thane",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Bhopal",
    "link": "/artists?category=Singer&city=Bhopal",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sufi Singer in Visakhapatnam",
    "link": "/artists?category=Singer&city=Visakhapatnam",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Pimpri-Chinchwad",
    "link": "/artists?category=Singer&city=Pimpri%20Chinchwad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Patna",
    "link": "/artists?category=Singer&city=Patna",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Vadodara",
    "link": "/artists?category=Singer&city=Vadodara",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Ghaziabad",
    "link": "/artists?category=Singer&city=Ghaziabad",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Ludhiana",
    "link": "/artists?category=Singer&city=Ludhiana",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Agra",
    "link": "/artists?category=Singer&city=Agra",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Ghazal Singer in Nashik",
    "link": "/artists?category=Singer&city=Nashik",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Band in Ranchi",
    "link": "/artists?category=Live%20band&city=Ranchi",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Faridabad",
    "link": "/artists?category=Singer&city=Faridabad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Singer in Meerut",
    "link": "/artists?category=Singer&city=Meerut",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Rajkot",
    "link": "/artists?category=Singer&city=Rajkot",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Kalyan-Dombivli",
    "link": "/artists?category=Singer&city=Kalyan%20Dombivli",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Vasai-Virar",
    "link": "/artists?category=Singer&city=Vasai%20Virar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Band in Varanasi",
    "link": "/artists?category=Live%20band&city=Varanasi",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Srinagar",
    "link": "/artists?category=Singer&city=Srinagar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Aurangabad",
    "link": "/artists?category=Singer&city=Aurangabad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Dhanbad",
    "link": "/artists?category=Singer&city=Dhanbad",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Amritsar",
    "link": "/artists?category=Singer&city=Amritsar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Navi Mumbai",
    "link": "/artists?category=Singer&city=Navi%20Mumbai",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Singer in Allahabad",
    "link": "/artists?category=Singer&city=Allahabad",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Howrah",
    "link": "/artists?category=Musician&city=Howrah",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Gwalior",
    "link": "/artists?category=Singer&city=Gwalior",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Jabalpur",
    "link": "/artists?category=Singer&city=Jabalpur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Coimbatore",
    "link": "/artists?category=Singer&city=Coimbatore",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Singer in Vijayawada",
    "link": "/artists?category=Singer&city=Vijayawada",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Jodhpur",
    "link": "/artists?category=Musician&city=Jodhpur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Madurai",
    "link": "/artists?category=Musician&city=Madurai",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Singer in Raipur",
    "link": "/artists?category=Singer&city=Raipur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Kota",
    "link": "/artists?category=Musician&city=Kota",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Chandigarh",
    "link": "/artists?category=Musician&city=Chandigarh",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Guwahati",
    "link": "/artists?category=Singer&city=Guwahati",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Ghazal Singer in Solapur",
    "link": "/artists?category=Singer&city=Solapur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Hubli-Dharwad",
    "link": "/artists?category=Singer&city=Hubli%20Dharwad",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Band in Mysore",
    "link": "/artists?category=Live%20band&city=Mysore",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Tiruchirappalli",
    "link": "/artists?category=Musician&city=Tiruchirappalli",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Singer in Bareilly",
    "link": "/artists?category=Singer&city=Bareilly",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Aligarh",
    "link": "/artists?category=Singer&city=Aligarh",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Band in Tiruppur",
    "link": "/artists?category=Live%20band&city=Tiruppur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Gurgaon",
    "link": "/artists?category=Singer&city=Gurgaon",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Moradabad",
    "link": "/artists?category=Singer&city=Moradabad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Jalandhar",
    "link": "/artists?category=Singer&city=Jalandhar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Ghazal Singer in Bhubaneswar",
    "link": "/artists?category=Singer&city=Bhubaneswar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Salem",
    "link": "/artists?category=Singer&city=Salem",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Warangal",
    "link": "/artists?category=Live%20band&city=Warangal",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Mira-Bhayandar",
    "link": "/artists?category=Singer&city=Mira%20Bhayandar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Jalgaon",
    "link": "/artists?category=Singer&city=Jalgaon",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Guntur",
    "link": "/artists?category=Singer&city=Guntur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Thiruvananthapuram",
    "link": "/artists?category=Singer&city=Thiruvananthapuram",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Bhiwandi",
    "link": "/artists?category=Live%20band&city=Bhiwandi",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sufi Singer in Saharanpur",
    "link": "/artists?category=Singer&city=Saharanpur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Band in Gorakhpur",
    "link": "/artists?category=Live%20band&city=Gorakhpur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Bikaner",
    "link": "/artists?category=Musician&city=Bikaner",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Amravati",
    "link": "/artists?category=Singer&city=Amravati",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Noida",
    "link": "/artists?category=Musician&city=Noida",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Jamshedpur",
    "link": "/artists?category=Singer&city=Jamshedpur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Singer in Bhilai",
    "link": "/artists?category=Singer&city=Bhilai",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Music in Cuttack",
    "link": "/artists?category=Singer&city=Cuttack",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Firozabad",
    "link": "/artists?category=Singer&city=Firozabad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Kochi",
    "link": "/artists?category=Singer&city=Kochi",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Nellore",
    "link": "/artists?category=Singer&city=Nellore",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Bhavnagar",
    "link": "/artists?category=Singer&city=Bhavnagar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Dehradun",
    "link": "/artists?category=Singer&city=Dehradun",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Durgapur",
    "link": "/artists?category=Singer&city=Durgapur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Asansol",
    "link": "/artists?category=Singer&city=Asansol",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Rourkela",
    "link": "/artists?category=Singer&city=Rourkela",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Nanded",
    "link": "/artists?category=Singer&city=Nanded",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Kolhapur",
    "link": "/artists?category=Musician&city=Kolhapur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Ajmer",
    "link": "/artists?category=Singer&city=Ajmer",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Akola",
    "link": "/artists?category=Musician&city=Akola",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Gulbarga",
    "link": "/artists?category=Singer&city=Gulbarga",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Singer in Jamnagar",
    "link": "/artists?category=Singer&city=Jamnagar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Ujjain",
    "link": "/artists?category=Singer&city=Ujjain",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Loni",
    "link": "/artists?category=Singer&city=Loni",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Siliguri",
    "link": "/artists?category=Singer&city=Siliguri",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Band in Jhansi",
    "link": "/artists?category=Live%20band&city=Jhansi",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Singer in Ulhasnagar",
    "link": "/artists?category=Singer&city=Ulhasnagar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Jammu",
    "link": "/artists?category=Musician&city=Jammu",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Music in Sangli-Miraj & Kupwad",
    "link": "/artists?category=Singer&city=Sangli%20Miraj%20And%20Kupwad",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Mangalore",
    "link": "/artists?category=Live%20band&city=Mangalore",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Erode",
    "link": "/artists?category=Singer&city=Erode",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Belgaum",
    "link": "/artists?category=Singer&city=Belgaum",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Ambattur",
    "link": "/artists?category=Singer&city=Ambattur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Tirunelveli",
    "link": "/artists?category=Singer&city=Tirunelveli",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Band in Malegaon",
    "link": "/artists?category=Live%20band&city=Malegaon",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Gaya",
    "link": "/artists?category=Singer&city=Gaya",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Udaipur",
    "link": "/artists?category=Singer&city=Udaipur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Singer in Maheshtala",
    "link": "/artists?category=Singer&city=Maheshtala",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Davanagere",
    "link": "/artists?category=Singer&city=Davanagere",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Kozhikode",
    "link": "/artists?category=Singer&city=Kozhikode",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Kurnool",
    "link": "/artists?category=Musician&city=Kurnool",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Rajpur Sonarpur",
    "link": "/artists?category=Singer&city=Rajpur%20Sonarpur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Rajahmundry",
    "link": "/artists?category=Live%20band&city=Rajahmundry",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Bokaro",
    "link": "/artists?category=Musician&city=Bokaro",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in South Dumdum",
    "link": "/artists?category=Musician&city=South%20Dumdum",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Bellary",
    "link": "/artists?category=Musician&city=Bellary",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Patiala",
    "link": "/artists?category=Singer&city=Patiala",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Gopalpur",
    "link": "/artists?category=Singer&city=Gopalpur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Agartala",
    "link": "/artists?category=Singer&city=Agartala",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Bhagalpur",
    "link": "/artists?category=Musician&city=Bhagalpur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Muzaffarnagar",
    "link": "/artists?category=Live%20band&city=Muzaffarnagar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Bhatpara",
    "link": "/artists?category=Singer&city=Bhatpara",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Panihati",
    "link": "/artists?category=Singer&city=Panihati",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Music in Latur",
    "link": "/artists?category=Singer&city=Latur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Dhule",
    "link": "/artists?category=Singer&city=Dhule",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Tirupati",
    "link": "/artists?category=Singer&city=Tirupati",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Rohtak",
    "link": "/artists?category=Singer&city=Rohtak",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Korba",
    "link": "/artists?category=Singer&city=Korba",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Bhilwara",
    "link": "/artists?category=Singer&city=Bhilwara",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Berhampur",
    "link": "/artists?category=Singer&city=Berhampur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Muzaffarpur",
    "link": "/artists?category=Singer&city=Muzaffarpur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Ahmednagar",
    "link": "/artists?category=Singer&city=Ahmednagar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Mathura",
    "link": "/artists?category=Singer&city=Mathura",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Kollam",
    "link": "/artists?category=Singer&city=Kollam",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Avadi",
    "link": "/artists?category=Singer&city=Avadi",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Singer in Kadapa",
    "link": "/artists?category=Singer&city=Kadapa",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Kamarhati",
    "link": "/artists?category=Singer&city=Kamarhati",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Sambalpur",
    "link": "/artists?category=Musician&city=Sambalpur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Bilaspur",
    "link": "/artists?category=Musician&city=Bilaspur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Shahjahanpur",
    "link": "/artists?category=Singer&city=Shahjahanpur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Ghazal Singer in Satara",
    "link": "/artists?category=Singer&city=Satara",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Bijapur",
    "link": "/artists?category=Musician&city=Bijapur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Rampur",
    "link": "/artists?category=Singer&city=Rampur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Shivamogga",
    "link": "/artists?category=Singer&city=Shivamogga",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Chandrapur",
    "link": "/artists?category=Singer&city=Chandrapur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Junagadh",
    "link": "/artists?category=Live%20band&city=Junagadh",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Thrissur",
    "link": "/artists?category=Singer&city=Thrissur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Alwar",
    "link": "/artists?category=Singer&city=Alwar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Bardhaman",
    "link": "/artists?category=Singer&city=Bardhaman",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Kulti",
    "link": "/artists?category=Live%20band&city=Kulti",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Kakinada",
    "link": "/artists?category=Singer&city=Kakinada",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Music in Nizamabad",
    "link": "/artists?category=Singer&city=Nizamabad",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Sufi Singer in Parbhani",
    "link": "/artists?category=Singer&city=Parbhani",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Tumkur",
    "link": "/artists?category=Singer&city=Tumkur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Khammam",
    "link": "/artists?category=Singer&city=Khammam",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Ozhukarai",
    "link": "/artists?category=Singer&city=Ozhukarai",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Bihar Sharif",
    "link": "/artists?category=Singer&city=Bihar%20Sharif",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Panipat",
    "link": "/artists?category=Singer&city=Panipat",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Band in Darbhanga",
    "link": "/artists?category=Live%20band&city=Darbhanga",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Bally",
    "link": "/artists?category=Singer&city=Bally",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Band in Aizawl",
    "link": "/artists?category=Live%20band&city=Aizawl",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Dewas",
    "link": "/artists?category=Musician&city=Dewas",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Ichalkaranji",
    "link": "/artists?category=Singer&city=Ichalkaranji",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Karnal",
    "link": "/artists?category=Singer&city=Karnal",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Bathinda",
    "link": "/artists?category=Singer&city=Bathinda",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Jalna",
    "link": "/artists?category=Musician&city=Jalna",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Eluru",
    "link": "/artists?category=Singer&city=Eluru",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Barasat",
    "link": "/artists?category=Singer&city=Barasat",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Kirari Suleman Nagar",
    "link": "/artists?category=Singer&city=Kirari%20Suleman%20Nagar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Band in Purnia",
    "link": "/artists?category=Live%20band&city=Purnia",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Satna",
    "link": "/artists?category=Singer&city=Satna",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Mau",
    "link": "/artists?category=Singer&city=Mau",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Sonipat",
    "link": "/artists?category=Singer&city=Sonipat",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Farrukhabad",
    "link": "/artists?category=Singer&city=Farrukhabad",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Sagar",
    "link": "/artists?category=Singer&city=Sagar",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Durg",
    "link": "/artists?category=Singer&city=Durg",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Imphal",
    "link": "/artists?category=Singer&city=Imphal",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Ratlam",
    "link": "/artists?category=Singer&city=Ratlam",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Hapur",
    "link": "/artists?category=Singer&city=Hapur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Band in Anantapur",
    "link": "/artists?category=Live%20band&city=Anantapur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Arrah",
    "link": "/artists?category=Singer&city=Arrah",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Music in Karimnagar",
    "link": "/artists?category=Singer&city=Karimnagar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Etawah",
    "link": "/artists?category=Singer&city=Etawah",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Ambernath",
    "link": "/artists?category=Singer&city=Ambernath",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Singer for Events in North Dumdum",
    "link": "/artists?category=Singer&city=North%20Dumdum",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Singer in Bharatpur",
    "link": "/artists?category=Singer&city=Bharatpur",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Begusarai",
    "link": "/artists?category=Singer&city=Begusarai",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in New Delhi",
    "link": "/artists?category=Singer&city=New%20Delhi",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Gandhidham",
    "link": "/artists?category=Singer&city=Gandhidham",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Baranagar",
    "link": "/artists?category=Singer&city=Baranagar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Tiruvottiyur",
    "link": "/artists?category=Singer&city=Tiruvottiyur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Band in Puducherry",
    "link": "/artists?category=Live%20band&city=Puducherry",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Sikar",
    "link": "/artists?category=Singer&city=Sikar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Thoothukudi",
    "link": "/artists?category=Singer&city=Thoothukudi",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Rewa",
    "link": "/artists?category=Singer&city=Rewa",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Mirzapur",
    "link": "/artists?category=Singer&city=Mirzapur",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Raichur",
    "link": "/artists?category=Singer&city=Raichur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Pali",
    "link": "/artists?category=Singer&city=Pali",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Ramagundam",
    "link": "/artists?category=Singer&city=Ramagundam",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Silchar",
    "link": "/artists?category=Singer&city=Silchar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Haridwar",
    "link": "/artists?category=Singer&city=Haridwar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Band in Vijayanagaram",
    "link": "/artists?category=Live%20band&city=Vijayanagaram",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Tenali",
    "link": "/artists?category=Singer&city=Tenali",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Nagercoil",
    "link": "/artists?category=Singer&city=Nagercoil",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Sri Ganganagar",
    "link": "/artists?category=Singer&city=Sri%20Ganganagar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Karawal Nagar",
    "link": "/artists?category=Singer&city=Karawal%20Nagar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Music in Mango",
    "link": "/artists?category=Singer&city=Mango",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Thanjavur",
    "link": "/artists?category=Singer&city=Thanjavur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Sufi Singer in Bulandshahr",
    "link": "/artists?category=Singer&city=Bulandshahr",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Uluberia",
    "link": "/artists?category=Musician&city=Uluberia",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Ghazal Singer in Katni",
    "link": "/artists?category=Singer&city=Katni",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Music in Sambhal",
    "link": "/artists?category=Singer&city=Sambhal",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Singrauli",
    "link": "/artists?category=Singer&city=Singrauli",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Singer for Events in Nadiad",
    "link": "/artists?category=Singer&city=Nadiad",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Secunderabad",
    "link": "/artists?category=Singer&city=Secunderabad",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Band in Naihati",
    "link": "/artists?category=Live%20band&city=Naihati",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Singer in Yamunanagar",
    "link": "/artists?category=Singer&city=Yamunanagar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Bidhannagar",
    "link": "/artists?category=Singer&city=Bidhannagar",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Band in Pallavaram",
    "link": "/artists?category=Live%20band&city=Pallavaram",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Bidar",
    "link": "/artists?category=Live%20band&city=Bidar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sufi Singer in Munger",
    "link": "/artists?category=Singer&city=Munger",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Live Singer in Panchkula",
    "link": "/artists?category=Singer&city=Panchkula",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Musicians in Burhanpur",
    "link": "/artists?category=Musician&city=Burhanpur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Music in Raurkela Industrial Township",
    "link": "/artists?category=Singer&city=Raurkela%20Industrial%20Township",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Kharagpur",
    "link": "/artists?category=Singer&city=Kharagpur",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Dindigul",
    "link": "/artists?category=Singer&city=Dindigul",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Shaadi Singer in Gandhinagar",
    "link": "/artists?category=Singer&city=Gandhinagar",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Hospet",
    "link": "/artists?category=Singer&city=Hospet",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Musician in Nangloi Jat",
    "link": "/artists?category=Musician&city=Nangloi%20Jat",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Malda",
    "link": "/artists?category=Singer&city=Malda",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Ghazal Singer in Ongole",
    "link": "/artists?category=Singer&city=Ongole",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Acoustic Singer in Deoghar",
    "link": "/artists?category=Singer&city=Deoghar",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Chapra",
    "link": "/artists?category=Live%20band&city=Chapra",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Live Singer in Haldia",
    "link": "/artists?category=Singer&city=Haldia",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Bollywood Singer in Khandwa",
    "link": "/artists?category=Singer&city=Khandwa",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Nandyal",
    "link": "/artists?category=Singer&city=Nandyal",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Event Singer in Morena",
    "link": "/artists?category=Singer&city=Morena",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Amroha",
    "link": "/artists?category=Singer&city=Amroha",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Sangeet Singer in Anand",
    "link": "/artists?category=Singer&city=Anand",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Bhind",
    "link": "/artists?category=Singer&city=Bhind",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Band in Bhalswa Jahangir Pur",
    "link": "/artists?category=Live%20band&city=Bhalswa%20Jahangir%20Pur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Private Event Singer in Madhyamgram",
    "link": "/artists?category=Singer&city=Madhyamgram",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Punjabi Singer in Bhiwani",
    "link": "/artists?category=Singer&city=Bhiwani",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Music in Berhampore",
    "link": "/artists?category=Singer&city=Berhampore",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "House Party Singer in Ambala",
    "link": "/artists?category=Singer&city=Ambala",
    "type": "party",
    "subtext": ""
  },
  {
    "title": "Live Singer in Morbi",
    "link": "/artists?category=Singer&city=Morbi",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Fatehpur",
    "link": "/artists?category=Singer&city=Fatehpur",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Wedding Singer in Raebareli",
    "link": "/artists?category=Singer&city=Raebareli",
    "type": "wedding",
    "subtext": ""
  },
  {
    "title": "Corporate Singer in Khora",
    "link": "/artists?category=Singer&city=Khora",
    "type": "corporate",
    "subtext": ""
  },
  {
    "title": "Live Band in Chittoor",
    "link": "/artists?category=Live%20band&city=Chittoor",
    "type": "live",
    "subtext": ""
  },
  {
    "title": "Birthday Singer in Bhusawal",
    "link": "/artists?category=Singer&city=Bhusawal",
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
