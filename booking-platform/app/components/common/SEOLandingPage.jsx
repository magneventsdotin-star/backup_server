"use client";

import CategoriesSection from '@/app/components/home/CategoriesSection';
import SEOArtistsGrid from '@/app/components/common/SEOArtistsGrid';
import SEODynamicContent from '@/app/components/common/SEODynamicContent';
import SEOLandingHero from '@/app/components/common/SEOLandingHero';
import VideoGridSection from '@/app/components/home/VideoGridSection';
import PromotionalOfferSection from '@/app/components/home/PromotionalOfferSection';
import TokenBookingSection99 from '@/app/components/common/TokenBookingSection99';
import ContactSection from '@/app/components/home/ContactSection';
import '@/app/styles/pages/HomePage.css';

export default function SEOLandingPage({ 
  locationSlug,
  heroTitle, 
  heroSubtitle, 
  schema, 
  category, 
  city,
  subCategory,
  topArtists = [],
  overviewHtml,
  services,
  faqs,
  relatedLinks
}) {
  const slugNormalized = (locationSlug || '').toLowerCase().trim().replace(/\/$/, '');
  const isAmrohaSangeet = slugNormalized === 'sangeet-singer-in-amroha';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="hp">
        {/* Luxury Hero with Interactive Booking Engine & Top 5 Verified Artists Showcase */}
        <SEOLandingHero
          heroTitle={heroTitle}
          heroSubtitle={heroSubtitle}
          category={category}
          city={city}
          subCategory={subCategory}
          topArtists={topArtists}
        />

        {/* Exclusive ₹99 Token Booking Section for this page only */}
        {isAmrohaSangeet && (
          <TokenBookingSection99
            city={city || "Amroha"}
            category={category || "Sangeet Singer"}
            locationSlug={slugNormalized || "sangeet-singer-in-amroha"}
          />
        )}

        <PromotionalOfferSection />

        {overviewHtml && services && faqs && relatedLinks ? (
          <SEODynamicContent 
            category={category}
            city={city}
            overviewHtml={overviewHtml}
            services={services}
            faqs={faqs}
            relatedLinks={relatedLinks}
          />
        ) : null}

        <VideoGridSection />
        <CategoriesSection />
        <SEOArtistsGrid category={category} city={city} fallbackArtists={topArtists} />

        <ContactSection />
      </div>
    </>
  );
}
