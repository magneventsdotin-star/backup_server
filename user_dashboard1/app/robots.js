export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://magnevents.com';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/private/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
