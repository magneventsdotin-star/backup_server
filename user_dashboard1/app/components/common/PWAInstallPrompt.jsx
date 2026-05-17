"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import '@/app/styles/components/PWAInstallPrompt.css';

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Safety check for server rendering environment
    if (typeof window === 'undefined') return;

    // 1. Detect if the app is already running in standalone/installed mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      return;
    }

    // 2. Check if the user has previously dismissed the install prompt persistently
    const isDismissed = localStorage.getItem('magnevents-pwa-dismissed');
    if (isDismissed === 'true') {
      return;
    }

    // 3. Identify iOS Safari users
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    
    if (isAppleDevice) {
      setIsIOS(true);
      // Wait 3 seconds to show the premium iOS install hint elegantly on load
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // 4. Android/Desktop: Show the card ONLY if native beforeinstallprompt is captured
    const handleInstallable = () => {
      setShowPrompt(true);
    };

    // If deferredPrompt is already populated globally by our early script
    if (window.deferredPrompt) {
      setShowPrompt(true);
    }

    window.addEventListener('pwa-installable', handleInstallable);
    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    const promptEvent = window.deferredPrompt;
    if (!promptEvent) return;

    try {
      // Show native installer popup immediately
      promptEvent.prompt();
      
      // Wait for the user to resolve the prompt
      const { outcome } = await promptEvent.userChoice;
      
      if (outcome === 'accepted') {
        localStorage.setItem('magnevents-pwa-dismissed', 'true');
        window.deferredPrompt = null;
        setShowPrompt(false);
      }
    } catch (err) {
      console.error("Error launching native PWA install prompt:", err);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('magnevents-pwa-dismissed', 'true');
    setShowPrompt(false);
  };

  return (
    <>
      <AnimatePresence>
        {showPrompt && !showIOSGuide && (
          <motion.div 
            className="pwa-floating-card"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            <div className="pwa-card-glow" />
            <div className="pwa-card-content">
              <div className="pwa-app-logo" style={{ overflow: 'hidden', position: 'relative' }}>
                <Image 
                  src="/assets/magnevents-logo.jpg" 
                  alt="Magnevents Logo" 
                  fill
                  sizes="48px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="pwa-text-block">
                <h4>Install Magnevents App</h4>
                <p>Enjoy offline bookings, rapid touch load times, and premium full-screen interface.</p>
              </div>
            </div>
            
            <div className="pwa-action-buttons">
              <button className="pwa-btn-dismiss" onClick={handleDismiss}>
                Maybe Later
              </button>
              <button className="pwa-btn-install" onClick={handleInstallClick}>
                Install App
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Step-by-Step Interactive Guide */}
      <AnimatePresence>
        {showIOSGuide && (
          <motion.div 
            className="pwa-ios-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowIOSGuide(false)}
          >
            <motion.div 
              className="pwa-ios-modal-card"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ios-modal-indicator" />
              <div className="ios-modal-header">
                <h3>📲 Install App on iPhone</h3>
                <p>Run Magnevents as a native full-screen app in 3 quick steps:</p>
              </div>

              <div className="ios-steps-list">
                <div className="ios-step-row">
                  <span className="ios-step-badge">1</span>
                  <p>Tap the **Share** icon <code>📤</code> at the bottom of Safari.</p>
                </div>
                <div className="ios-step-row">
                  <span className="ios-step-badge">2</span>
                  <p>Scroll down the share list and select **"Add to Home Screen"** <code>➕</code>.</p>
                </div>
                <div className="ios-step-row">
                  <span className="ios-step-badge">3</span>
                  <p>Tap **"Add"** in the top right corner of your screen!</p>
                </div>
              </div>

              <button className="ios-modal-btn-close" onClick={() => { setShowIOSGuide(false); setShowPrompt(false); localStorage.setItem('magnevents-pwa-dismissed', 'true'); }}>
                Got It, Thanks!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
