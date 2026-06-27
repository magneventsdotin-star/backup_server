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
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${action === 'approve' ? 'Approved' : 'Rejected'} - Magnevents</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
            
            body {
              font-family: 'Inter', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #0B0E14; /* Dark sleek background */
              background-image: radial-gradient(circle at top right, rgba(91, 90, 247, 0.1), transparent 400px), 
                                radial-gradient(circle at bottom left, rgba(91, 90, 247, 0.05), transparent 400px);
            }
            .card {
              text-align: center;
              background: #141824;
              padding: 48px 40px;
              border-radius: 24px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
              border: 1px solid rgba(255, 255, 255, 0.05);
              max-width: 400px;
              width: 90%;
              animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .logo-container {
              margin-bottom: 32px;
            }
            .logo-container img {
              height: 48px;
              width: auto;
            }
            .icon-circle {
              background-color: ${bgColor};
              color: white;
              width: 72px;
              height: 72px;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0 auto 24px auto;
              font-size: 36px;
              box-shadow: 0 0 24px ${bgColor}66;
              animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both;
            }
            h1 {
              color: #ffffff;
              margin: 0 0 12px 0;
              font-size: 24px;
              font-weight: 800;
              letter-spacing: -0.02em;
            }
            p {
              color: #94a3b8;
              font-size: 15px;
              line-height: 1.6;
              margin: 0;
            }
            .button {
              display: inline-block;
              margin-top: 32px;
              padding: 12px 24px;
              background-color: rgba(255, 255, 255, 0.05);
              color: #ffffff;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              font-size: 14px;
              transition: all 0.2s;
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .button:hover {
              background-color: rgba(255, 255, 255, 0.1);
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.5); }
              to { opacity: 1; transform: scale(1); }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="logo-container">
              <!-- Using the same logo as the dashboard -->
              <img src="/logo.webp" alt="Magnevents Logo" onerror="this.src='https://ui-avatars.com/api/?name=Magnevents&background=0D8ABC&color=fff&rounded=true'"/>
            </div>
            <div class="icon-circle">
              ${action === 'approve' ? '✓' : '✕'}
            </div>
            <h1>${text}</h1>
            <p>Your action has been recorded in the database and confirmation emails have been dispatched.</p>
            <a href="javascript:window.close();" class="button">Close Window</a>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  } catch (err: any) {
    console.error("Action error:", err);
    return new NextResponse('Internal Server Error: ' + err.message, { status: 500 });
  }
}
