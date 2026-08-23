import { supabase } from '@database/connection/supabase';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.magnevents.in';

  // Ensure no trailing slashes in static routes to prevent canonical issues
  const staticRoutes = [
    '',
    '/artists',
    '/gallery',
    '/services',
    '/pricing',
    '/how-to-book',
    '/testimonials',
    '/why-choose',
    '/blog-post',
    '/register',
    '/book-singer-for-house-party-in-delhi',
    '/book-live-band-in-delhi',
    '/book-singer-for-wedding'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  let dynamicRoutes = [];
  try {
    const { data: artists } = await supabase
      .from('artists')
      .select('id, is_live')
      .eq('is_live', true);

    if (artists) {
      dynamicRoutes = artists.map((artist) => ({
        url: `${baseUrl}/artist/${artist.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }));
    }
    
    // We can also fetch dynamic locations if a locations table exists
    // but assuming static for now based on previous sitemap
  } catch (error) {
    console.error('Error fetching dynamic routes for sitemap', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
