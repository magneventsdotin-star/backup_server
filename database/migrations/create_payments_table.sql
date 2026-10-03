-- ==============================================================================
-- Migration: Create Payments Table for Razorpay Transactions
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL,
    payment_id TEXT NOT NULL UNIQUE,
    signature TEXT,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 99.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(50) NOT NULL DEFAULT 'captured',
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    reference_code TEXT,
    notes TEXT,
    gateway VARCHAR(50) NOT NULL DEFAULT 'razorpay',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON public.payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_phone ON public.payments(customer_phone);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
DROP POLICY IF EXISTS "Service role has full access to payments" ON public.payments;
CREATE POLICY "Service role has full access to payments"
ON public.payments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow authenticated admins to view payments
DROP POLICY IF EXISTS "Admins can view payments" ON public.payments;
CREATE POLICY "Admins can view payments"
ON public.payments
FOR SELECT
TO authenticated
USING (true);
