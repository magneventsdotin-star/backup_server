import SEOLandingPage from '@/app/components/common/SEOLandingPage'

export const metadata = {
  title: 'Book Top Singers & Live Performers | Magnevents',
  description: 'Book top singers and live artists for your next big event. Magnevents offers premium live music experiences with seamless booking.',
  alternates: {
    canonical: 'https://www.magnevents.in/book-top-singers',
  },
  openGraph: {
    title: 'Book Top Singers & Live Performers | Magnevents',
    description: 'Book top singers and live artists for your next big event. Magnevents offers premium live music experiences with seamless booking.',
    url: 'https://www.magnevents.in/book-top-singers',
    siteName: 'Magnevents',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function BookTopSingersPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Premium Artist Booking",
    "provider": {
      "@type": "Organization",
      "name": "Magnevents",
      "url": "https://www.magnevents.in"
    }
  }

  return (
    <SEOLandingPage
      heroTitle="Book Top Singers"
      heroSubtitle="Find the perfect voice for your grand event. Discover industry-leading talent and make your celebration unforgettable."
      schema={schema}
    />
  )
}
