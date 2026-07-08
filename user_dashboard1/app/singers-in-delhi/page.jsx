import SEOLandingPage from '@/app/components/common/SEOLandingPage'

export const metadata = {
  title: 'Book Top Singers in Delhi | Magnevents',
  description: 'Book the best live singers in Delhi for your wedding, corporate event, or private party. Browse top vocalists and hire easily with Magnevents.',
  alternates: {
    canonical: 'https://www.magnevents.in/singers-in-delhi',
  },
  openGraph: {
    title: 'Book Top Singers in Delhi | Magnevents',
    description: 'Book the best live singers in Delhi for your wedding, corporate event, or private party. Browse top vocalists and hire easily with Magnevents.',
    url: 'https://www.magnevents.in/singers-in-delhi',
    siteName: 'Magnevents',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function SingersInDelhiPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Live Singer Booking",
    "provider": {
      "@type": "Organization",
      "name": "Magnevents",
      "url": "https://www.magnevents.in"
    },
    "areaServed": {
      "@type": "City",
      "name": "Delhi"
    }
  }

  return (
    <SEOLandingPage
      heroTitle="Book Top Singers in Delhi"
      heroSubtitle="Elevate your event with live vocal performances. Browse and book the finest singers in Delhi NCR for your special occasion."
      schema={schema}
    />
  )
}
