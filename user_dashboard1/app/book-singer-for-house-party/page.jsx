import SEOLandingPage from '@/app/components/common/SEOLandingPage'

export const metadata = {
  title: 'Book Singer for House Party | Magnevents',
  description: 'Hire a live singer for your house party. Make your private gatherings unforgettable with soulful music and acoustic performances.',
  alternates: {
    canonical: 'https://www.magnevents.in/book-singer-for-house-party',
  },
  openGraph: {
    title: 'Book Singer for House Party | Magnevents',
    description: 'Hire a live singer for your house party. Make your private gatherings unforgettable with soulful music and acoustic performances.',
    url: 'https://www.magnevents.in/book-singer-for-house-party',
    siteName: 'Magnevents',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function BookSingerForHousePartyPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "House Party Entertainment",
    "provider": {
      "@type": "Organization",
      "name": "Magnevents",
      "url": "https://www.magnevents.in"
    }
  }

  return (
    <SEOLandingPage
      heroTitle="Book Singer for House Party"
      heroSubtitle="Transform your intimate gathering into a magical evening with the best acoustic artists and live singers."
      schema={schema}
    />
  )
}
