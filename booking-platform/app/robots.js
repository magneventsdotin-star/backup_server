export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.magnevents.in';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/', 
        '/admin/', 
        '/_next/', 
        '/private/', 
        '/preview/', 
        '/*?*' // Disallow URLs with query parameters to avoid duplicate content
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
