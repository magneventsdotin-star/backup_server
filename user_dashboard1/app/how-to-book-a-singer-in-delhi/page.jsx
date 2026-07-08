import SEOLandingPage from '@/app/components/common/SEOLandingPage'

export const metadata = {
  title: 'How to Book a Singer in Delhi | Magnevents',
  description: 'Learn the easiest way to book a singer in Delhi for your event. Follow our simple steps to hire live bands and vocalists securely.',
  alternates: {
    canonical: 'https://www.magnevents.in/how-to-book-a-singer-in-delhi',
  },
  openGraph: {
    title: 'How to Book a Singer in Delhi | Magnevents',
    description: 'Learn the easiest way to book a singer in Delhi for your event. Follow our simple steps to hire live bands and vocalists securely.',
    url: 'https://www.magnevents.in/how-to-book-a-singer-in-delhi',
    siteName: 'Magnevents',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function HowToBookSingerInDelhiPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Book a Singer in Delhi",
    "author": {
      "@type": "Organization",
      "name": "Magnevents"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Magnevents",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.magnevents.in/icon-512.png"
      }
    }
  }

  return (
    <SEOLandingPage
      heroTitle="How to Book a Singer in Delhi"
      heroSubtitle="Booking top live entertainment in Delhi is easier than ever. Follow our seamless process to secure the perfect artist for your event."
      schema={schema}
    />
  )
}
