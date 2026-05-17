import dynamic from 'next/dynamic'
import HeroSection from '@/app/components/home/HeroSection'
import TopPerformerSection from '@/app/components/home/TopPerformerSection'
import CategoriesSection from '@/app/components/home/CategoriesSection'
import FeaturedArtistsSection from '@/app/components/home/FeaturedArtistsSection'
import WhyChooseSection from '@/app/components/home/WhyChooseSection'
import HowToBookSection from '@/app/components/home/HowToBookSection'
import '@/app/styles/pages/HomePage.css'

const TestimonialsSection = dynamic(() => import('@/app/components/home/TestimonialsSection'), { ssr: true })
const FaqSection = dynamic(() => import('@/app/components/home/FaqSection'), { ssr: true })
const InfoCards = dynamic(() => import('@/app/components/home/InfoCards'), { ssr: true })
const ContactSection = dynamic(() => import('@/app/components/home/ContactSection'), { ssr: true })

export default function HomePage() {
  return (
    <div className="hp">
      <HeroSection />
      <TopPerformerSection />
      <CategoriesSection />
      <FeaturedArtistsSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <HowToBookSection />
      <FaqSection />
      <InfoCards />
      <ContactSection />
    </div>
  )
}
