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
      const artistRoutes = artists.map((artist) => ({
        url: `${baseUrl}/artist/${artist.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.9,
      }));
      dynamicRoutes = [...dynamicRoutes, ...artistRoutes];
    }
    
    // Fetch SEO Cities
    const { data: cities } = await supabase
      .from('seo_cities')
      .select('slug, updated_at')
      .eq('is_active', true);
      
    if (cities) {
      const cityRoutes = cities.map((city) => ({
        url: `${baseUrl}/city/${city.slug}`,
        lastModified: city.updated_at || new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9,
      }));
      dynamicRoutes = [...dynamicRoutes, ...cityRoutes];
    }

    // Fetch SEO Blogs
    const { data: blogs } = await supabase
      .from('seo_blogs')
      .select('slug, updated_at, seo_cities!inner(slug)')
      .eq('status', 'published');

    if (blogs) {
      const blogRoutes = blogs.map((blog) => ({
        url: `${baseUrl}/city/${blog.seo_cities.slug}/blog/${blog.slug}`,
        lastModified: blog.updated_at || new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
      dynamicRoutes = [...dynamicRoutes, ...blogRoutes];
    }

  } catch (error) {
    console.error('Error fetching dynamic routes for sitemap', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
