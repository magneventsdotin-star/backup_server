-- ==============================================================================
-- Migration: Reliable Transactional Outbox & Notification Queue Schema
-- Purpose: Ensures durable persistence of form submissions and reliable background
--          delivery of email and WhatsApp notifications with exponential backoff.
-- ==============================================================================

-- 1. Ensure extension for UUID generation is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Add Reference Code, Idempotency Key and Tracking Columns to 'bookings' table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS reference_code TEXT,
ADD COLUMN IF NOT EXISTS idempotency_key TEXT,
ADD COLUMN IF NOT EXISTS source_form TEXT,
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- Add index on reference_code and idempotency_key for fast lookup & deduplication
CREATE INDEX IF NOT EXISTS idx_bookings_reference_code ON public.bookings(reference_code);
CREATE INDEX IF NOT EXISTS idx_bookings_idempotency_key ON public.bookings(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- 3. Create 'notifications_outbox' table for durable background job processing
CREATE TABLE IF NOT EXISTS public.notifications_outbox (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    reference_code TEXT,
    channel TEXT NOT NULL DEFAULT 'email_admin', -- 'email_admin', 'email_customer', 'whatsapp_admin'
    recipient TEXT NOT NULL,
    subject TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'sent', 'retrying', 'failed'
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 5,
    next_retry_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    locked_until TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning-fast queue polling and job recovery
CREATE INDEX IF NOT EXISTS idx_outbox_queue_status_retry 
ON public.notifications_outbox(status, next_retry_at) 
WHERE status IN ('pending', 'retrying');

CREATE INDEX IF NOT EXISTS idx_outbox_booking_id 
ON public.notifications_outbox(booking_id);

CREATE INDEX IF NOT EXISTS idx_outbox_created_at 
ON public.notifications_outbox(created_at DESC);

-- 4. Ensure 'emails' log table has retry and error tracking columns for backward compatibility
ALTER TABLE public.emails
ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS last_attempt_at TIMESTAMPTZ;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.notifications_outbox ENABLE ROW LEVEL SECURITY;

-- Service Role has full access to process queue
DROP POLICY IF EXISTS "Service role full access on notifications_outbox" ON public.notifications_outbox;
CREATE POLICY "Service role full access on notifications_outbox" 
ON public.notifications_outbox 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 6. Trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_notifications_outbox_modtime() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW; 
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_notifications_outbox_modtime ON public.notifications_outbox;
CREATE TRIGGER trg_notifications_outbox_modtime
BEFORE UPDATE ON public.notifications_outbox
FOR EACH ROW EXECUTE PROCEDURE update_notifications_outbox_modtime();
