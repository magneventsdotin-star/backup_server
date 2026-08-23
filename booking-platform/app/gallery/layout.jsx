export const metadata = {
  title: 'Event Gallery | Live Performances & Weddings | Magnevents',
  description: 'View our gallery of past events, live performances, weddings, and corporate nights powered by Magnevents artists.',
  alternates: {
    canonical: '/gallery',
  },
  openGraph: {
    title: 'Event Gallery | Live Performances & Weddings | Magnevents',
    description: 'View our gallery of past events, live performances, weddings, and corporate nights powered by Magnevents artists.',
    url: '/gallery',
  }
};

export default function GalleryLayout({ children }) {
  return <>{children}</>;
}
