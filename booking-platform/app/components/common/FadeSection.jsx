"use client";

import { useRef, useEffect, useState } from 'react'

export default function FadeSection({ children, className = '', delay = 0, ...props }) {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })

    // Use IntersectionObserver for fade-in instead of framer-motion
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { rootMargin: '-60px' }
    )
    if (ref.current) observer.observe(ref.current)

    return () => {
      window.removeEventListener('resize', checkMobile)
      observer.disconnect()
    }
  }, [])

  // Always render the same <section> element on SSR and client
  // Only apply animation classes after mount to prevent hydration mismatch
  let sectionClass = className
  if (mounted) {
    if (isMobile) {
      sectionClass = `${className} is-mobile-static`
    } else {
      sectionClass = `${className} fade-section ${inView ? 'fade-section-visible' : ''}`
    }
  }

  return (
    <section
      ref={ref}
      className={sectionClass}
      suppressHydrationWarning
      {...props}
    >
      {children}
    </section>
  )
}
