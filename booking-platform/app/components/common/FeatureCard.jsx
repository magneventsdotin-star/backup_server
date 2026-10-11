"use client"
import { motion } from 'framer-motion'

export default function FeatureCard({ icon, title, desc, accent = 'matrix' }) {
  return (
    <div className={`why-card ${accent}-border`}>
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}
