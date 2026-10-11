"use client";

export default function FadeSection({ children, className = '', ...props }) {
  return (
    <section
      className={`fade-section fade-section-visible ${className}`.trim()}
      suppressHydrationWarning
      {...props}
    >
      {children}
    </section>
  )
}
