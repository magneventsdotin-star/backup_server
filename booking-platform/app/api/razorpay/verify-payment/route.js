import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@database/connection/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer_name,
      customer_phone
    } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { error: 'Razorpay secret not configured in environment.' },
        { status: 500 }
      );
    }

    // Verify signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Payment signature verification failed.' },
        { status: 400 }
      );
    }

    // Reference code for customer receipt
    const referenceCode = `MAG-99-${Date.now().toString().slice(-6)}`;

    // 1. Insert into dedicated payments table
    try {
      if (supabase) {
        await supabase.from('payments').insert([
          {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            signature: razorpay_signature,
            amount: 2.00,
            currency: 'INR',
            status: 'captured',
            customer_name: customer_name || '',
            customer_phone: customer_phone || '',
            reference_code: referenceCode,
            notes: '₹2 Test Token Booking (Testing Phase)',
            gateway: 'razorpay'
          }
        ]);
      }
    } catch (payDbErr) {
      console.warn('Payments table insert note:', payDbErr.message);
    }

    // 2. Also record in bookings table so it appears in Admin Portal Dashboard
    try {
      if (supabase) {
        await supabase.from('bookings').insert([
          {
            client_name: customer_name,
            client_phone: customer_phone,
            event_type: 'Live Artist Slot Booking (Confirmed)',
            budget: 'Confirmed Booking',
            notes: `[PAYMENT VERIFIED VIA RAZORPAY] Payment ID: ${razorpay_payment_id}, Order ID: ${razorpay_order_id}. First-time 55%-65% OFF Applied.`,
            status: 'confirmed',
            booking_source: 'website',
            source_form: 'Quick Booking Modal',
            reference_code: referenceCode
          }
        ]);
      }
    } catch (bookDbErr) {
      console.warn('Bookings table insert note:', bookDbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and slot confirmed!',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      referenceCode: referenceCode
    });
  } catch (error) {
    console.error('Payment verification API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
