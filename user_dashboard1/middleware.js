import { NextResponse, userAgent } from 'next/server'

export function middleware(request) {
  const { device } = userAgent(request)
  const isMobile = device.type === 'mobile' || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(request.headers.get('user-agent') || '')
  
  console.log('[Middleware] Checking device type:', device.type, 'isMobile:', isMobile, 'path:', request.nextUrl.pathname);

  // Rewrite to mobile home for fast loading
  if (isMobile && request.nextUrl.pathname === '/') {
    console.log('[Middleware] Rewriting to /mobile-home');
    const url = request.nextUrl.clone()
    url.pathname = '/mobile-home'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
