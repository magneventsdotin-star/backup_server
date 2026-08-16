import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    // 1. Verify Vercel Cron Secret to ensure no unauthorized triggers
    const authHeader = req.headers.get('authorization');
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      // Allow testing locally if CRON_SECRET is not set, otherwise block
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // 2. Connect to Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Calculate "Start of Today" in IST (UTC+5:30)
    // To handle Vercel cron drift (e.g., running at 12:15 AM instead of 11:55 PM),
    // we subtract 2 hours before determining the date. This ensures 11:55 PM and 12:15 AM
    // both resolve to the same intended calendar day.
    const now = new Date();
    const adjustedTime = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(adjustedTime.getTime() + istOffset);
    
    // Set to midnight IST
    istTime.setUTCHours(0, 0, 0, 0);
    
    // Convert midnight IST back to UTC
    const startOfTodayUTC = new Date(istTime.getTime() - istOffset);
    const endOfTodayUTC = new Date(startOfTodayUTC.getTime() + 24 * 60 * 60 * 1000);

    // 4. Query the count from Supabase
    const { count, error } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfTodayUTC.toISOString())
      .lt('created_at', endOfTodayUTC.toISOString());

    if (error) {
      throw error;
    }

    // 5. Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const dateStr = istTime.toLocaleDateString('en-IN', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 40px 20px; text-align: center;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #0f172a; margin-top: 0;">Daily Submission Report</h2>
          <p style="color: #64748b; font-size: 14px;">Report for ${dateStr}</p>
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <span style="font-size: 48px; font-weight: bold; color: #3b82f6;">${count}</span>
            <p style="color: #475569; margin: 10px 0 0 0; font-size: 16px;">Forms Submitted Today</p>
          </div>
          <p style="color: #94a3b8; font-size: 12px;">This automated report is generated daily at 11:55 PM IST.</p>
        </div>
      </div>
    `;

    // 6. Send the Email
    await transporter.sendMail({
      from: `"Magnevents Daily Report" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📊 Daily Form Submissions: ${count}`,
      html: htmlBody,
    });

    return NextResponse.json({ success: true, count, date: dateStr });
  } catch (error) {
    console.error('Daily cron error:', error);
    return NextResponse.json({ error: 'Failed to process daily report' }, { status: 500 });
  }
}
