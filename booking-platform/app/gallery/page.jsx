"use client"

import { motion } from 'framer-motion'
import { AppShellWrapper } from '@/app/layouts/AppShellWrapper'
import '@/app/styles/pages/Gallery.css'
import { GALLERY_ITEMS } from '@/app/constants'

export default function GalleryPage() {
  return (
    <main className="gallery-page-layout">
      <div className="lux-container">
        <header className="gallery-header">
          <span className="accent-tag">MOMENTS</span>
          <h1>Live <span className="text-gradient">Gallery</span></h1>
          <p>A visual journey through the most extraordinary performances curated by Magnevents.</p>
        </header>

        <div className="gallery-masonry">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`gallery-item ${item.size}`}
            >
              <div className="gallery-media" style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={typeof item.img === "object" ? item.img?.src : item.img}
                  alt={item.title} style={{ objectFit: "cover", width: "100%", height: "100%", position: "absolute", inset: 0 }}  />
                <div className="gallery-overlay">
                  <h3>{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

