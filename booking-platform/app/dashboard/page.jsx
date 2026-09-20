import Link from 'next/link';
import { 
  FiMusic, 
  FiCalendar, 
  FiUserCheck, 
  FiStar, 
  FiCheckCircle, 
  FiClock, 
  FiArrowRight, 
  FiZap, 
  FiShield, 
  FiHeart, 
  FiHelpCircle,
  FiPhoneCall
} from 'react-icons/fi';

export const metadata = {
  title: 'Dashboard & Event Hub | Magnevents',
  description: 'Manage your live artist bookings, track event inquiries, explore artist journeys, and connect with top musical talent across India on Magnevents.',
};

export default function DashboardPage() {
  const stats = [
    { label: 'Live Events Curated', value: '1,250+', icon: FiCalendar, color: '#fbbf24' },
    { label: 'Verified Artists', value: '450+', icon: FiMusic, color: '#c084fc' },
    { label: 'Happy Hosts', value: '98%', icon: FiHeart, color: '#f43f5e' },
    { label: 'Client Satisfaction', value: '4.9 ★', icon: FiStar, color: '#38bdf8' },
  ];

  const quickActions = [
    {
      title: 'Book a Live Singer',
      desc: 'Browse verified house party, sangeet, and wedding singers.',
      href: '/artists',
      btnText: 'Explore Singers',
      color: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'rgba(251, 191, 36, 0.3)',
      icon: FiMusic,
    },
    {
      title: 'Track Booking Requests',
      desc: 'View real-time status of your event booking requests and replies.',
      href: '/dashboard/requests',
      btnText: 'View Requests',
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'rgba(192, 132, 252, 0.3)',
      icon: FiClock,
    },
    {
      title: 'Register as an Artist',
      desc: 'Are you a singer, band, or performer? Join Magnevents today.',
      href: '/register/artist',
      btnText: 'Join as Artist',
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'rgba(56, 189, 248, 0.3)',
      icon: FiUserCheck,
    },
    {
      title: 'Pricing & Packages',
      desc: 'Transparent pricing for house parties, weddings & corporate shows.',
      href: '/pricing',
      btnText: 'Check Pricing',
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'rgba(52, 211, 153, 0.3)',
      icon: FiZap,
    },
  ];

  const journeySteps = [
    {
      step: '01',
      title: 'Discover & Handpick',
      desc: 'Browse verified artists, watch video performances, listen to live clips, and select the ideal performer for your occasion.',
    },
    {
      step: '02',
      title: 'Seamless Inquiries',
      desc: 'Send quick booking requests with your event date, budget, and location. Get direct quotes without hidden agency markups.',
    },
    {
      step: '03',
      title: 'Confirmed & Unforgettable',
      desc: 'Enjoy end-to-end sound setup assistance, verified artist arrival, and an unforgettable live musical experience.',
    },
  ];

  return (
    <div style={{ backgroundColor: '#090a0f', color: '#f8fafc', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header Hero Section */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          borderRadius: '24px',
          padding: '40px 32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '40px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)'
        }}>
          {/* Background Glow Effect */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '750px', position: 'relative', zIndex: 2 }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(251, 191, 36, 0.12)',
              color: '#fbbf24',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.8px',
              marginBottom: '16px',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}>
              ✨ MAGNEVENTS DASHBOARD & JOURNEY
            </span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px', color: '#ffffff' }}>
              Welcome to Your Live Music Hub
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.6, marginBottom: '28px' }}>
              Track your event inquiries, discover top-rated live singers, explore artist portfolios, and experience seamless event entertainment booking across India.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/dashboard/requests" style={{
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
                <FiClock size={16} /> Track My Requests
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
                <FiMusic size={16} /> Browse Singers <FiArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} style={{
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: `${item.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  border: `1px solid ${item.color}30`
                }}>
                  <Icon size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>{item.value}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action Cards */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiZap style={{ color: '#fbbf24' }} /> Quick Actions & Portals
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {quickActions.map((action, i) => {
              const ActionIcon = action.icon;
              return (
                <div key={i} style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  border: `1px solid ${action.borderColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}>
                  <div>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fbbf24',
                      marginBottom: '18px'
                    }}>
                      <ActionIcon size={22} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>{action.title}</h3>
                    <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '24px' }}>{action.desc}</p>
                  </div>

                  <Link href={action.href} style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#ffffff',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <span>{action.btnText}</span>
                    <FiArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Our Story & Journey Section */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '24px',
          padding: '40px 32px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '56px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px auto' }}>
            <span style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              HOW MAGNEVENTS WORKS
            </span>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginTop: '8px', marginBottom: '12px' }}>
              The Magnevents Experience & Journey
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6 }}>
              We bridge the gap between event hosts and extraordinary live musical artists across Delhi-NCR and India.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
            {journeySteps.map((step, idx) => (
              <div key={idx} style={{
                backgroundColor: 'rgba(30, 41, 59, 0.4)',
                borderRadius: '16px',
                padding: '28px 24px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: 'rgba(251, 191, 36, 0.25)',
                  marginBottom: '12px'
                }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support & Contact Footer Banner */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
          borderRadius: '20px',
          padding: '32px 28px',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(251, 191, 36, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <FiPhoneCall size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>Need Help with Your Event Booking?</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '2px' }}>Our event curation team is available to assist you 24/7.</p>
            </div>
          </div>

          <a 
            href="https://wa.me/919999999999?text=Hi%20Magnevents,%20I%20need%20assistance%20with%20booking%20an%20artist" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#25D366',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            WhatsApp Support
          </a>
        </div>

      </div>
    </div>
  );
}
