"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import BrandMark from '@/app/components/common/BrandMark'
import { NAV_LINKS } from '@/app/constants'

export default function MobilePanel({ isOpen, onClose, isLight, pathname, onOpenContactModal }) {
  const [showiOSGuide, setShowiOSGuide] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.deferredPrompt) {
      setIsInstallable(true)
    }

    const handleInstallable = () => {
      setIsInstallable(true)
    }

    window.addEventListener('pwa-installable', handleInstallable)
    return () => window.removeEventListener('pwa-installable', handleInstallable)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  function isLinkActive(path) {
    return pathname === path
  }

  const handleInstallClick = async () => {

    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      alert("Magnevents is already running as an installed App! 🎉")
      return
    }

    const promptEvent = window.deferredPrompt
    if (promptEvent) {
      promptEvent.prompt()
      const { outcome } = await promptEvent.userChoice
      if (outcome === 'accepted') {
        window.deferredPrompt = null
        setIsInstallable(false)
      }
    } else {

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      if (isIOS) {
        setShowiOSGuide(true)
        setTimeout(() => setShowiOSGuide(false), 8000)
      } else {
        alert("PWA Install Ready! Simply click the '+' or 'Install App' option in your browser's address bar to install Magnevents. 📲")
      }
    }
  }

  return (
    <>
      <aside className={`lux-mobile-panel ${isOpen ? 'open' : ''} ${isLight ? 'is-light' : 'is-dark'}`}>
        <div className="lux-mobile-panel-head">
          <Link href="/" onClick={onClose} aria-label="Magnevents Home" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <BrandMark size="sm" light={false} />
          </Link>
          <button
            type="button"
            className="lux-mobile-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="lux-mobile-links-container">
          {NAV_LINKS.map(link => {
            const isCategory = link.label.toLowerCase() === 'artists';

            if (isCategory) {
              return (
                <div key={link.label}>
                  <button
                    type="button"
                    className={`lux-mobile-link ${expandedCategory ? 'is-active' : ''}`}
                    onClick={() => setExpandedCategory(!expandedCategory)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      outline: 'none',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    <span>{link.label}</span>
                    <span style={{ fontSize: '11px', transition: 'transform 0.3s ease', transform: expandedCategory ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.7 }}>
                      ▼
                    </span>
                  </button>

                  {expandedCategory && (
                    <div className="lux-mobile-submenu">
                      <Link
                        href="/artists"
                        onClick={onClose}
                        style={{
                          fontWeight: 'bold',
                          color: 'var(--color-marigold, #E8B943)',
                          borderBottom: '1px dashed rgba(232, 185, 67, 0.25)',
                          paddingBottom: '8px',
                          marginBottom: '4px',
                          display: 'block'
                        }}
                      >
                        All Categories 📑
                      </Link>
                      {link.children.map(child => (
                        <Link key={child.path} href={child.path} onClick={onClose}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <React.Fragment key={link.label}>
                <div>
                  <Link
                    href={link.label === 'Contact Us' ? '#' : link.path}
                    className={`lux-mobile-link ${isLinkActive(link.path) ? 'is-active' : ''}`}
                    onClick={(e) => {
                      if (link.label === 'Contact Us') {
                        e.preventDefault();
                        onOpenContactModal('contact');
                        onClose();
                      } else {
                        onClose();
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </div>
                {/* AI Search link right after Artists in mobile menu */}
                {link.label.toLowerCase() === 'home' && (
                  <div>
                    <Link
                      href="/ai-search"
                      className={`lux-mobile-link ${isLinkActive('/ai-search') ? 'is-active' : ''}`}
                      onClick={onClose}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span>AI Search</span>
                      <span style={{ 
                        fontSize: '11px', 
                        padding: '2px 8px', 
                        borderRadius: '999px', 
                        background: 'rgba(232, 185, 67, 0.2)', 
                        color: 'var(--color-marigold, #E8B943)',
                        fontWeight: '700'
                      }}>
                        NEW
                      </span>
                    </Link>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        <div className="lux-mobile-actions" style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
          <button
            onClick={() => {
              onOpenContactModal('contact');
              onClose();
            }}
            className="lux-mobile-cta primary"
            style={{
              background: 'var(--color-coral, #E45F60)',
              color: '#ffffff',
              fontWeight: '700',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '15px',
              letterSpacing: '0.02em',
              boxShadow: '0 8px 24px rgba(228, 95, 96, 0.35)',
              cursor: 'pointer'
            }}
          >
            Contact Us
          </button>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-register-modal', { detail: { view: 'artist' } }));
              }
              onClose();
            }}
            className="lux-mobile-cta secondary"
            style={{
              background: 'rgba(41, 39, 42, 0.9)',
              color: 'var(--color-ivory, #F5F0E9)',
              fontWeight: '600',
              border: '1px solid rgba(216, 196, 183, 0.3)',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Register as Artist
          </button>

          {showiOSGuide && (
            <div className="ios-install-guide-toast">
              <p>To install: Tap the share button <span style={{fontSize: '16px'}}>📤</span> in Safari & select <strong>&ldquo;Add to Home Screen&rdquo;</strong> <span style={{fontSize: '16px'}}>📲</span>!</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#8a8f98', letterSpacing: '0.05em' }}>
            v1.1.0
          </div>
        </div>
      </aside>
      {isOpen && <button type="button" className="lux-mobile-backdrop" aria-label="Close menu" onClick={onClose} />}
    </>
  )
}
