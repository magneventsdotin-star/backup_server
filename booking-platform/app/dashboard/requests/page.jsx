import Link from 'next/link';
import { Clock, ArrowLeft, Music, Mail } from 'lucide-react';

export const metadata = {
  title: 'Booking Requests & Status | Magnevents',
  description: 'Track your event booking requests, artist responses, and confirmation updates on Magnevents.',
};

export default function BookingRequestsPage() {
  return (
    <div style={{ backgroundColor: '#090a0f', color: '#f8fafc', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Navigation back link */}
        <Link href="/dashboard" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#fbbf24',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          marginBottom: '24px'
        }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Page Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '36px'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            Event Booking Requests & Tracking
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px' }}>
            Track your event inquiries submitted to Magnevents artists and view real-time status updates.
          </p>
        </div>

        {/* Search & Info Card */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '20px',
          padding: '40px 32px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'rgba(251, 191, 36, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            margin: '0 auto 20px auto',
            border: '1px solid rgba(251, 191, 36, 0.2)'
          }}>
            <Clock size={30} />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
            Looking for a specific booking request?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '550px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
            When you submit a booking request for an artist on Magnevents, you receive a confirmation email with a direct tracking link and booking ID.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/artists" style={{
              backgroundColor: '#fbbf24',
              color: '#0f172a',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Music size={16} /> Book an Artist Now
            </Link>
            <a href="mailto:support@magnevents.in" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <Mail size={16} /> Contact Support
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
