-- Migration: Add Dedicated Visitor Details & Locality Columns to Analytics
-- Note: The tracking system already stores all IP, Locality, and User details inside 'details' (JSONB).
-- Running this script adds dedicated top-level columns and indexes for faster SQL queries and analytics filters.

ALTER TABLE public.analytics 
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 7),
ADD COLUMN IF NOT EXISTS device_type TEXT,
ADD COLUMN IF NOT EXISTS browser TEXT,
ADD COLUMN IF NOT EXISTS os TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT;

-- Create indexes for fast filtering and dashboard queries
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_ip_address ON public.analytics(ip_address);
CREATE INDEX IF NOT EXISTS idx_analytics_city ON public.analytics(city);
CREATE INDEX IF NOT EXISTS idx_analytics_country ON public.analytics(country);
CREATE INDEX IF NOT EXISTS idx_analytics_device_type ON public.analytics(device_type);
CREATE INDEX IF NOT EXISTS idx_analytics_details_gin ON public.analytics USING gin(details);
