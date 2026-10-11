"use client"
import { motion } from 'framer-motion'

export default function TestimonialCard({ review }) {
  return (
    <div className="testi-card">
      <div className="stars">
        {"★".repeat(review.stars || 5)}
      </div>
      <p className="testi-text">&ldquo;{review.text}&rdquo;</p>
      <div className="testi-user">
        <div className="user-info">
          <strong>{review.name}</strong>
          <span>{review.location || review.city}</span>
        </div>
      </div>
    </div>
  )
}
