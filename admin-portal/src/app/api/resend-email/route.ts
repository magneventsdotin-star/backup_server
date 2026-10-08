import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(req: Request) {
  try {
    const { emailId, emailIds } = await req.json();
    const idsToProcess: string[] = emailIds || (emailId ? [emailId] : []);

    if (idsToProcess.length === 0) {
      return NextResponse.json({ error: 'No email ID provided' }, { status: 400 });
    }

    const adminEmail = process.env.EMAIL_USER || 'magneventsdotin@gmail.com';
    const emailPass = process.env.EMAIL_PASS || '';

    if (!adminEmail || !emailPass) {
      return NextResponse.json({ error: 'Email credentials not configured in environment variables' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: adminEmail,
        pass: emailPass,
      },
    });

    const supabase = getSupabaseAdmin();
    const results = [];

    for (const id of idsToProcess) {
      const { data: emailRecord, error: fetchErr } = await supabase
        .from('emails')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchErr || !emailRecord) {
        results.push({ id, status: 'error', error: 'Email record not found' });
        continue;
      }

      try {
        const isHtml = emailRecord.body && emailRecord.body.includes('<');
        await transporter.sendMail({
          from: `"Magnevents System" <${adminEmail}>`,
          to: emailRecord.recipient_email || adminEmail,
          subject: emailRecord.subject,
          ...(isHtml ? { html: emailRecord.body } : { text: emailRecord.body }),
        });

        // Update database log as sent
        await supabase
          .from('emails')
          .update({
            status: 'sent',
            error_message: null,
            sent_at: new Date().toISOString(),
          })
          .eq('id', id);

        results.push({ id, status: 'sent' });
      } catch (sendErr: any) {
        await supabase
          .from('emails')
          .update({
            status: 'failed',
            error_message: sendErr.message,
          })
          .eq('id', id);

        results.push({ id, status: 'failed', error: sendErr.message });
      }
    }

    const hasFailures = results.some(r => r.status === 'failed' || r.status === 'error');
    return NextResponse.json({
      success: !hasFailures,
      results,
    });
  } catch (error: any) {
    console.error('[ResendEmailAPI] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
