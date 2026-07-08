import SEOLandingPage from '@/app/components/common/SEOLandingPage'

export const metadata = {
  title: 'Live Musicians for Hire Near Me | Magnevents',
  description: 'Looking for live musicians for hire near you? Browse Magnevents for talented bands, instrumentalists, and singers in your area.',
  alternates: {
    canonical: 'https://www.magnevents.in/live-musicians-for-hire-near-me',
  },
  openGraph: {
    title: 'Live Musicians for Hire Near Me | Magnevents',
    description: 'Looking for live musicians for hire near you? Browse Magnevents for talented bands, instrumentalists, and singers in your area.',
    url: 'https://www.magnevents.in/live-musicians-for-hire-near-me',
    siteName: 'Magnevents',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function LiveMusiciansNearMePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Local Musician Booking",
    "provider": {
      "@type": "Organization",
      "name": "Magnevents",
      "url": "https://www.magnevents.in"
    }
  }

  return (
    <SEOLandingPage
      heroTitle="Live Musicians for Hire Near You"
      heroSubtitle="Connect with the finest local artists, bands, and instrumentalists. Ready to perform at your next event."
      schema={schema}
    />
  )
}
