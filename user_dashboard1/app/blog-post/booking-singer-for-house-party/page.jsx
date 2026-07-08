import SEOLandingPage from '@/app/components/common/SEOLandingPage'

export const metadata = {
  title: 'Booking Singer for House Party | Magnevents Blog',
  description: 'The rising trend of booking singers for house parties. Learn how live music can transform your private gatherings into memorable nights.',
  alternates: {
    canonical: 'https://www.magnevents.in/blog-post/booking-singer-for-house-party',
  },
  openGraph: {
    title: 'Booking Singer for House Party | Magnevents Blog',
    description: 'The rising trend of booking singers for house parties. Learn how live music can transform your private gatherings into memorable nights.',
    url: 'https://www.magnevents.in/blog-post/booking-singer-for-house-party',
    siteName: 'Magnevents',
    locale: 'en_IN',
    type: 'article',
  },
}

export default function BlogPostHousePartySingerPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "The Rising Trend of Booking Singers for House Parties",
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
      heroTitle="The Rising Trend of Booking Singers for House Parties"
      heroSubtitle="Discover why hiring a live musician is the ultimate upgrade for your private celebrations."
      schema={schema}
    />
  )
}
