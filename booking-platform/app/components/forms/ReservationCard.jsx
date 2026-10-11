"use client";

import { motion } from 'framer-motion'

export default function ReservationCard({ title, desc, actionLabel, onAction, isExternal, href, direction }) {
  const content = (
    <>
      <h3>{title}</h3>
      <p>{desc}</p>
      {isExternal ? (
        <a href={href} className="book-outline-btn">
          {actionLabel}
        </a>
      ) : (
        <button className="book-main-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </>
  )

  return (
    <div className="book-card">
      {content}
    </div>
  )
}
