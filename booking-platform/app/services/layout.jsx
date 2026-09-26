export const metadata = {
  title: 'Our Services | Live Entertainment & Artist Booking | Magnevents',
  description: 'Explore our entertainment services: live singers for private house parties, wedding bands, DJ booking near you, live bands in Pune & Kochi, and stage artists.',
  keywords: [
    'singers near me',
    'singer for house party',
    'live singer for private party',
    'live singer for house party',
    'house gig',
    'book singer music band',
    'book live singer',
    'dj in kochi',
    'dj booking near me',
    'live band in pune',
    'wedding live music',
    'corporate entertainment services'
  ],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Our Services | Live Entertainment & Artist Booking | Magnevents',
    description: 'Explore our services including live bands, solo singers, DJs, and performers for weddings, corporate events, and private house parties.',
    url: '/services',
  }
};

export default function ServicesLayout({ children }) {
  return <>{children}</>;
}
