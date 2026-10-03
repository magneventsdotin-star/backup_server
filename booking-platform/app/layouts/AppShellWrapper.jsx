"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Nav from '@/app/components/layout/Nav';
import BottomNav from '@/app/components/layout/BottomNav';
import Footer from '@/app/components/common/Footer';
import { useMouseGlow } from '@/app/hooks/useMouseGlow';

const HIDE_CHROME_ON = ['/checkout', '/confirmed', '/login', '/signup', '/onboarding', '/chat', '/f/'];

export function AppShellWrapper({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useMouseGlow();

  // Use pathname-based logic only after mount to avoid hydration mismatch
  const hideChrome = mounted && HIDE_CHROME_ON.some(p => pathname.startsWith(p));

  const routeTransitionClass = mounted && ['/artists', '/services', '/gallery', '/events', '/pricing', '/book', '/blog-post', '/contact', '/search', '/markets']
    .includes(pathname)
    ? 'route-showcase'
    : 'route-default';

  const topPadding = mounted && !hideChrome && pathname !== '/' && pathname !== '/how-to-book'
    ? '72px'
    : '0px';

  return (
    <div className="flow-unify-shell">
      <div className="flow-unify-atmos" aria-hidden="true" />
      <div className="ambient-canvas" aria-hidden="true" />
      
      {!hideChrome && (
        <div id="unified-header" className="unified-header-container">
          <Nav />
        </div>
      )}

      <div className={`page-enter ${routeTransitionClass}`} style={{ minHeight: '100vh', paddingTop: topPadding }} suppressHydrationWarning>
        <div className="flow-unify-page-wrap">
          {children}
        </div>
        {!hideChrome && <Footer />}
      </div>

      {!hideChrome && (
        <>
          <BottomNav />
        </>
      )}
    </div>
  );
}
