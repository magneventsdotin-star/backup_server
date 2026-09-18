-- Migration: Add Geolocation tracking columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS detected_location TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT;
