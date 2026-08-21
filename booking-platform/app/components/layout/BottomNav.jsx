"use client"

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { HomeIcon, ServicesIcon, AboutIcon, ContactIcon, RegisterIcon, ArtistsIcon, PricingIcon, ProfileIcon } from '@/app/components/icons/NavigationIcons'
import { useScrollDirection } from '@/app/hooks/useScrollDirection'
import '@/app/styles/components/BottomNav.css'

function Tab({ path, icon, label, isActive }) {
  const iconColor = isActive ? '#FFE032' : '#8a8f98'

  return (
    <Link
      href={path}
      className={`booking-tab-btn ${isActive ? 'is-active' : ''}`}
      aria-current={isActive ? 'page' : undefined}
      style={{
        flex: 1,
        border: 'none',
        background: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        color: isActive ? '#FFE032' : '#8a8f98',
        padding: '10px 4px 6px',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        transition: 'all 200ms ease',
        opacity: isActive ? 1 : 0.7,
        textDecoration: 'none'
      }}
    >
      {icon(iconColor)}
      <span className="booking-tab-label" style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</span>
    </Link>
  )
}

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  function active(path) {
    return pathname === path
  }

  const scrollDirection = useScrollDirection()

  return (
    <>
      <div 
        className="booking-bottom-nav" 
        style={{
          transform: scrollDirection === 'down' ? 'translateY(150%)' : 'translateY(0)'
        }}
      >
        {/* Slot 1: Home */}
        <Tab path="/" icon={(color) => <HomeIcon color={color} />} label="Home" isActive={active('/')} />
        
        {/* Slot 2: Artists */}
        <Tab path="/artists" icon={(color) => <ArtistsIcon color={color} />} label="Artists" isActive={active('/artists')} />
        
        {/* Slot 3: Center Elevated Register FAB */}
        <div className="register-fab-container">
          <button
            className="booking-tab-btn register-center-fab"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-register-modal', { detail: { view: 'event' } }));
            }}
          >
            <RegisterIcon color="#fff" />
            <span className="fab-label">Register</span>
          </button>
        </div>

      
        <Tab path="/blog-post" icon={(color) => <AboutIcon color={color} />} label="Blog" isActive={active('/blog-post')} />
        <Tab
          path="/pricing"
          icon={(color) => <PricingIcon color={color} />}
          label="Pricing"
          isActive={active('/pricing')}
        />
      </div>

      <div className="booking-bottom-nav-spacer" />
    </>
  )
}
