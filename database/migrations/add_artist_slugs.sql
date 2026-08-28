-- Add slug column to artists
ALTER TABLE public.artists ADD COLUMN slug VARCHAR(255);

-- Make it unique after populating (optional, but good practice)
-- First, run the NodeJS script to populate all existing slugs!
-- Then you can run:
-- ALTER TABLE public.artists ADD CONSTRAINT artists_slug_unique UNIQUE (slug);
