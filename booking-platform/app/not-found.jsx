import Link from 'next/link';
import { Home, Music, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '404 - Page Not Found | Magnevents',
  description: 'The page you are looking for does not exist or has been moved.',
};

export default function NotFound() {
  return (
    <div style={{
      backgroundColor: '#090a0f',
      color: '#f8fafc',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        
        {/* Glow Badge */}
        <div style={{
          display: 'inline-block',
          background: 'rgba(251, 191, 36, 0.12)',
          color: '#fbbf24',
          padding: '6px 18px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '1px',
          marginBottom: '20px',
          border: '1px solid rgba(251, 191, 36, 0.2)'
        }}>
          404 ERROR
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 1.1,
          marginBottom: '16px'
        }}>
          Page Not Found
        </h1>

        <p style={{
          color: '#94a3b8',
          fontSize: '16px',
          lineHeight: 1.6,
          marginBottom: '36px',
          maxWidth: '480px',
          margin: '0 auto 36px auto'
        }}>
          Oops! The page you are looking for doesn't exist or may have been moved to another section.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/" style={{
            backgroundColor: '#fbbf24',
            color: '#0f172a',
            padding: '12px 28px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 20px -4px rgba(251, 191, 36, 0.4)'
          }}>
            <Home size={16} /> Back to Home
          </Link>

          <Link href="/artists" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#ffffff',
            padding: '12px 28px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <Music size={16} /> Browse Artists
          </Link>
        </div>

      </div>
    </div>
  );
}
