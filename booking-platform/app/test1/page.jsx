import HeroSection from '@/app/components/home/HeroSection'
import HeroVideosSection from '@/app/components/home/HeroVideosSection'
import TopPerformerSection from '@/app/components/home/TopPerformerSection'
import CategoriesSection from '@/app/components/home/CategoriesSection'
import FeaturedArtistsSection from '@/app/components/home/FeaturedArtistsSection'
import WhyChooseSection from '@/app/components/home/WhyChooseSection'
import TestimonialsSection from '@/app/components/home/TestimonialsSection'
import HowToBookSection from '@/app/components/home/HowToBookSection'
import FaqSection from '@/app/components/home/FaqSection'
import ContactSection from '@/app/components/home/ContactSection'
import SeoCardsSection from '@/app/components/home/SeoCardsSection'
import SeoKeywordFooter from '@/app/components/home/SeoKeywordFooter'
import DesignComparisonBar from '@/app/components/common/DesignComparisonBar'
import '@/app/styles/pages/HomePage.css'
import '@/app/styles/pages/design-variants.css'

export const metadata = {
  title: 'Test 1: Cinematic Noir (Coral Pulse) | Magnevents Design Lab',
  robots: 'noindex, nofollow',
};

export default function Test1Page() {
  return (
    <>
      <DesignComparisonBar activeVariant="test1" />
      <div className="hp hp-theme-test1">
        <HeroSection />
        <HeroVideosSection />
        <TopPerformerSection />
        <CategoriesSection />
        <FeaturedArtistsSection />
        <WhyChooseSection />
        <HowToBookSection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
        <SeoCardsSection />
        <SeoKeywordFooter />
      </div>
    </>
  );
}
