import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processPendingOutbox } from '@/lib/queue/outboxProcessor';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    // 1. Authorization check for Vercel Cron or Admin Worker
    const authHeader = req.headers.get('authorization');
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
      process.env.NODE_ENV === 'production'
    ) {
      // Check query key fallback if called via webhook
      const url = new URL(req.url);
      const secretKey = url.searchParams.get('key');
      if (secretKey !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // 2. Connect to Supabase using service role for elevated queue processing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Process pending outbox batch (up to 20 jobs per tick)
    const result = await processPendingOutbox({ supabase, batchSize: 20 });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    console.error('[ProcessOutboxCron] Error processing queue:', error);
    return NextResponse.json({ error: 'Failed to process outbox queue', details: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  return GET(req);
}
