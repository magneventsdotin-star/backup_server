import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    const action = searchParams.get('action');

    if (!id || !type || !action) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    let error = null;

    if (type === 'duplicate_approval') {
      const { error: err } = await supabase
        .from('duplicate_approvals')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          approved_by: 'Email Action',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      error = err;
    } else if (type === 'pricing_plan') {
      const { error: err } = await supabase
        .from('pricing_plans')
        .update({
          is_live: action === 'approve',
          pending_approval: false
        })
        .eq('id', id);
      error = err;
    } else if (type === 'client_request') {
      const { data: booking, error: fetchErr } = await supabase
        .from('bookings')
        .select('*, artists(name)')
        .eq('id', id)
        .single();
      
      if (fetchErr) {
        error = fetchErr;
      } else {
        const { error: err } = await supabase
          .from('bookings')
          .update({
            status: action === 'approve' ? 'confirmed' : 'cancelled'
          })
          .eq('id', id);
        error = err;

        // Send confirmation email to client if approved
        if (!error && action === 'approve' && booking && booking.client_email && booking.client_email !== 'N/A') {
          try {
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
            });

            let clientMessage = '';
            let subject = 'Update on your Magnevents Request';

            if (booking.event_type === 'Artist Registration') {
              subject = 'Welcome to Magnevents!';
              clientMessage = `Your artist registration has been reviewed and approved by our team. Welcome aboard!`;
            } else if (booking.event_type === 'Call Request') {
              subject = 'Magnevents - We received your query';
              clientMessage = `Thank you for reaching out to Magnevents! We have received your query and one of our specialists will call you shortly to discuss your specific needs.`;
            } else {
              const artistName = booking.artists?.name ? ` for ${booking.artists.name}` : '';
              subject = 'Your Magnevents Booking is Confirmed!';
              clientMessage = `Great news! Your booking request${artistName} has been confirmed by our team. We will reach out shortly with the next steps.`;
            }

            const htmlBody = `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4f46e5;">Hello ${booking.client_name},</h2>
                <p style="font-size: 16px; color: #334155; line-height: 1.5;">${clientMessage}</p>
                <br/>
                <p style="font-size: 14px; color: #64748b;">Best regards,<br/><strong>The Magnevents Team</strong></p>
              </div>
            `;

            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: booking.client_email,
              subject: subject,
              html: htmlBody,
            });
            console.log("Client confirmation email sent successfully");
          } catch (mailErr) {
            console.error("Failed to send client confirmation email:", mailErr);
          }
        }
      }
    } else {
      return new NextResponse('Invalid request type', { status: 400 });
    }

    if (error) throw error;

    // Return a simple success page
    const bgColor = action === 'approve' ? '#10b981' : '#ef4444';
    const text = action === 'approve' ? 'Request Approved Successfully!' : 'Request Rejected Successfully!';
    
    return new NextResponse(`
      <html>
        <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f8fafc;">
          <div style="text-align: center; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: ${bgColor}; color: white; width: 64px; height: 64px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 20px auto; font-size: 32px;">
              ✓
            </div>
            <h1 style="color: #0f172a; margin-bottom: 10px;">${text}</h1>
            <p style="color: #64748b;">You can safely close this window.</p>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (err: any) {
    console.error("Action error:", err);
    return new NextResponse('Internal Server Error: ' + err.message, { status: 500 });
  }
}
