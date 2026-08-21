import dynamic from 'next/dynamic'
import HeroSection from '@/app/components/home/HeroSection'
import HeroVideosSection from '@/app/components/home/HeroVideosSection'

const TopPerformerSection = dynamic(() => import('@/app/components/home/TopPerformerSection'), { ssr: false })
const CategoriesSection = dynamic(() => import('@/app/components/home/CategoriesSection'), { ssr: false })
const FeaturedArtistsSection = dynamic(() => import('@/app/components/home/FeaturedArtistsSection'), { ssr: false })
const WhyChooseSection = dynamic(() => import('@/app/components/home/WhyChooseSection'), { ssr: false })
const TestimonialsSection = dynamic(() => import('@/app/components/home/TestimonialsSection'), { ssr: false })
const HowToBookSection = dynamic(() => import('@/app/components/home/HowToBookSection'), { ssr: false })
const FaqSection = dynamic(() => import('@/app/components/home/FaqSection'), { ssr: false })
const InfoCards = dynamic(() => import('@/app/components/home/InfoCards'), { ssr: false })
const ContactSection = dynamic(() => import('@/app/components/home/ContactSection'), { ssr: false })
import '@/app/styles/pages/HomePage.css'

export const metadata = {
  alternates: {
    canonical: '/',
  },
};

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
        <HeroVideosSection />
        <TopPerformerSection />
        <CategoriesSection />
        <FeaturedArtistsSection />
        <WhyChooseSection />
        <HowToBookSection />
        <TestimonialsSection />
        <FaqSection />
        <InfoCards />
        <ContactSection />
      </div>
    </>
  )
}
