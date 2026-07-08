
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.magnevents.in';

  

  const staticRoutes = [
    '',
    '/about',
    '/artists',
    '/gallery',
    '/services',
    '/pricing',
    '/how-to-book',
    '/testimonials',
    '/why-choose',
    '/search',
    '/singers-in-delhi',
    '/book-top-singers',
    '/book-singer-for-house-party',
    '/live-musicians-for-hire-near-me',
    '/how-to-book-a-singer-in-delhi',
    '/blog-post/booking-singer-for-house-party',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return [...staticRoutes];
}
