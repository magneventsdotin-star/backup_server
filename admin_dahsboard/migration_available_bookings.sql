ALTER TABLE public.artists 
ADD COLUMN IF NOT EXISTS available_bookings integer DEFAULT 0;
