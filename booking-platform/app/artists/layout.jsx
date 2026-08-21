export const metadata = {
  title: 'Hire Live Bands, Singers & Musicians | Browse Artists | Magnevents',
  description: 'Explore our curated list of India\'s best live singers, devotional artists, and bands. Filter by category and city to find the perfect entertainment for your next event.',
  openGraph: {
    title: 'Hire Live Bands, Singers & Musicians | Browse Artists | Magnevents',
    description: 'Explore our curated list of India\'s best live singers, devotional artists, and bands. Filter by category and city to find the perfect entertainment for your next event.',
    url: '/artists',
    siteName: 'Magnevents',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hire Live Bands, Singers & Musicians | Browse Artists | Magnevents',
    description: 'Explore our curated list of India\'s best live singers, devotional artists, and bands. Filter by category and city to find the perfect entertainment for your next event.',
    images: ['/icon-512.png'],
  },
};

export default function ArtistsLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
