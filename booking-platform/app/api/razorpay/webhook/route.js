import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@database/connection/supabase';

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('Invalid Razorpay Webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventName = event.event;

    console.log(`[Razorpay Webhook] Received event: ${eventName}`);

    // Handle payment.captured or order.paid
    if (eventName === 'payment.captured' || eventName === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;

      const paymentId = paymentEntity?.id;
      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const amount = paymentEntity?.amount ? paymentEntity.amount / 100 : 99;
      const customerName = paymentEntity?.notes?.customer_name || 'Customer';
      const customerPhone = paymentEntity?.notes?.customer_phone || paymentEntity?.contact || '';
      const customerEmail = paymentEntity?.email || '';

      const referenceCode = `MAG-99-${Date.now().toString().slice(-6)}`;

      // 1. Record into public.payments
      try {
        if (supabase && paymentId) {
          await supabase.from('payments').upsert(
            [
              {
                order_id: orderId || 'N/A',
                payment_id: paymentId,
                amount: amount,
                currency: 'INR',
                status: 'captured',
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: customerEmail,
                reference_code: referenceCode,
                notes: `Webhook Event: ${eventName}`,
                gateway: 'razorpay'
              }
            ],
            { onConflict: 'payment_id' }
          );
        }
      } catch (err) {
        console.warn('Webhook payments table update notice:', err.message);
      }

      // 2. Record into public.bookings
      try {
        if (supabase) {
          await supabase.from('bookings').insert([
            {
              client_name: customerName,
              client_phone: customerPhone,
              client_email: customerEmail,
              event_type: 'Live Artist Slot Booking (Paid)',
              budget: `₹${amount} Token Paid`,
              notes: `[WEBHOOK CONFIRMED] Payment ID: ${paymentId}, Order ID: ${orderId}`,
              status: 'confirmed',
              booking_source: 'website',
              source_form: 'Razorpay Webhook',
              reference_code: referenceCode
            }
          ]);
        }
      } catch (err) {
        console.warn('Webhook bookings table update notice:', err.message);
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (error) {
    console.error('Razorpay Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
