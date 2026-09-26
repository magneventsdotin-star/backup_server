export const metadata = {
  title: "AI Event & Artist Search — Smart Live Musician Matcher | Magnevents",
  description: "Find and book verified live singers, bands, DJs, and performers in seconds with Magnevents AI Search. Instant smart matches, tailored setlists, and transparent direct pricing across India.",
  keywords: [
    "AI artist search",
    "AI event planning",
    "AI musician matcher",
    "book singer with AI",
    "smart event entertainment search",
    "hire live band online AI",
    "wedding singer match AI",
    "ghazal singer search",
    "corporate event entertainment AI",
    "Magnevents AI search",
    "live musicians booking India",
    "AI party singer booking",
    "AI wedding entertainment finder",
    "smart live band booking Delhi Mumbai Bangalore"
  ],
  alternates: {
    canonical: "https://www.magnevents.in/ai-search"
  },
  openGraph: {
    title: "Magnevents AI Event & Artist Search — Instant Musician Matching",
    description: "Describe your event in natural language. Our AI recommends verified live performers, custom setlists, and direct pricing with 0% agency markup.",
    url: "https://www.magnevents.in/ai-search",
    siteName: "Magnevents",
    images: [
      {
        url: "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/assets/lux-live-band-concert.webp",
        width: 1200,
        height: 630,
        alt: "Magnevents AI Event & Musician Search"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Event & Artist Search | Magnevents",
    description: "Match verified singers, bands & DJs in seconds with deep AI reasoning and direct pricing.",
    images: ["https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/assets/lux-live-band-concert.webp"]
  }
};

export default function AISearchLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Magnevents AI Event & Artist Matcher",
        "url": "https://www.magnevents.in/ai-search",
        "applicationCategory": "EntertainmentApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "description": "Next-generation AI live entertainment matcher for booking verified singers, live bands, DJs, and stage performers across India.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.magnevents.in/#website",
        "url": "https://www.magnevents.in",
        "name": "Magnevents",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.magnevents.in/ai-search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.magnevents.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "AI Event & Artist Search",
            "item": "https://www.magnevents.in/ai-search"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does Magnevents AI search help find singers and bands for my event?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Magnevents AI search analyzes your event details—such as occasion, preferred music genre, guest count, city, and budget—and matches you with curated, verified live artists instantly."
            }
          },
          {
            "@type": "Question",
            "name": "Can I book verified live artists directly using AI?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our AI Search provides instant pricing, artist portfolios, video reels, and direct booking capabilities with zero agency middlemen fees."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
