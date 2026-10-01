export default function robots() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.magnevents.in').replace(/\/+$/, '');
  
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
          '/thank-you',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
