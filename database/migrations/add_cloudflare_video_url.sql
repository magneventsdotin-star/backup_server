-- Add cloudflare_video_url column to artists table
ALTER TABLE artists ADD COLUMN IF NOT EXISTS cloudflare_video_url TEXT;
