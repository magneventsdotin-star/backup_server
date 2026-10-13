import HeroSection from '@/app/components/home/HeroSection'
import HeroVideosSection from '@/app/components/home/HeroVideosSection'
import TopPerformerSection from '@/app/components/home/TopPerformerSection'
import FeaturedArtistsSection from '@/app/components/home/FeaturedArtistsSection'
import WhyChooseSection from '@/app/components/home/WhyChooseSection'
import HowToBookSection from '@/app/components/home/HowToBookSection'
import TestimonialsSection from '@/app/components/home/TestimonialsSection'
import FaqSection from '@/app/components/home/FaqSection'
import ContactSection from '@/app/components/home/ContactSection'
import SeoCardsSection from '@/app/components/home/SeoCardsSection'
import SectionDivider from '@/app/components/common/SectionDivider'
import '@/app/styles/pages/HomePage.css'

export const metadata = {
  alternates: {
    canonical: '/',
  },
};

export const revalidate = 86400; // Cache on Edge CDN for instant loading

export default function HomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Magnevents",
    "url": "https://www.magnevents.in",
    "logo": "https://www.magnevents.in/logo.webp",
    "sameAs": [
      "https://www.instagram.com/magnevents.in?igsh=MXY2NmtjMm82bTFnaA==",
      "https://facebook.com/magnevents"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="hp">
        <HeroSection />
        <SectionDivider className="hp-section-divider--mobile-only" />
        <HeroVideosSection />
        <SectionDivider className="hp-section-divider--mobile-only" />
        <TopPerformerSection />
        <SectionDivider className="hp-section-divider--mobile-only" />
        <FeaturedArtistsSection />
        <SectionDivider className="hp-section-divider--mobile-only" />
        <WhyChooseSection />
        <HowToBookSection />
        <TestimonialsSection />
        <SectionDivider className="hp-section-divider--mobile-only" />
        <FaqSection />
        <SectionDivider className="hp-section-divider--mobile-only" />
        <ContactSection />
        <SeoCardsSection className="seo-cards-desktop-only" />
      </div>

    </>
  )
}
