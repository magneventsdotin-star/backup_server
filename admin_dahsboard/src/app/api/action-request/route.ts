import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
      const { error: err } = await supabase
        .from('bookings')
        .update({
          status: action === 'approve' ? 'confirmed' : 'cancelled'
        })
        .eq('id', id);
      error = err;
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
