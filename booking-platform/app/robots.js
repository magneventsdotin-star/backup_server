export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.magnevents.in';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/', 
          '/dashboard/',
          '/private/', 
          '/preview/', 
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/ai-search',
          '/artists',
          '/services',
          '/pricing',
          '/how-to-book',
          '/city/',
          '/artist/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/private/',
          '/preview/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
