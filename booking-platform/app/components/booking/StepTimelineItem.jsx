"use client"
import { motion } from 'framer-motion'

export default function StepTimelineItem({ step, index, isLast }) {
  const isEven = index % 2 === 0

  return (
    <div
      className={`step-item ${isEven ? 'left' : 'right'}`}
    >
      <div className="step-blob" style={{ backgroundColor: step.color }}>
        {step.icon}
      </div>

      {!isLast && <div className="step-connector" />}

      <div className="step-content">
        <span className="step-num" style={{ color: step.color }}>
          Step {index + 1}
        </span>
        <h3>{step.title}</h3>
        <p>{step.desc}</p>
      </div>
    </div>
  )
}
