import { notFound } from 'next/navigation';
import { supabase } from '@database/connection/supabase';
import Link from 'next/link';
import { Mic2 } from 'lucide-react';
import '../../seo-pages.css';

function slugToName(slug) {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata({ params }) {
  const { city_slug } = params;
  
  const { data: city } = await supabase
    .from('seo_cities')
    .select('*')
    .eq('slug', city_slug)
    .eq('is_active', true)
    .single();

  const cityName = city?.name || slugToName(city_slug);

  return {
    title: city?.seo_title || `Hire Best Singers in ${cityName} | Magnevents`,
    description: city?.meta_description || `Find and book top-rated live singers, bands, and musicians for weddings, corporate events, and parties in ${cityName}.`,
    alternates: {
      canonical: `https://www.magnevents.in/city/${city_slug}`,
    }
  };
}

export default async function CityLandingPage({ params }) {
  const { city_slug } = params;

  // 1. Fetch City
  let { data: city } = await supabase
    .from('seo_cities')
    .select('*')
    .eq('slug', city_slug)
    .eq('is_active', true)
    .single();

  // 1b. Fallback if city not in database
  if (!city) {
    city = {
      id: null,
      name: slugToName(city_slug),
      slug: city_slug,
      seo_title: '',
      meta_description: '',
      h1: '',
      content: '',
    };
  }

  // 2. Fetch SEO Blogs for this city (only if it has a real DB ID)
  let blogs = [];
  if (city.id) {
    const { data } = await supabase
      .from('seo_blogs')
      .select('title, slug, created_at, featured_image_url')
      .eq('city_id', city.id)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    blogs = data || [];
  }

  // 3. Schema Markup
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": city.seo_title || `Hire Singers in ${city.name}`,
    "description": city.meta_description || `Book live singers in ${city.name}`,
    "url": `https://www.magnevents.in/city/${city.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="city-landing-page">
        <div className="city-hero">
          <h1>{city.h1 || `Book the Best Singers in ${city.name}`}</h1>
          <p className="city-subtitle">
            Make your events in {city.name} unforgettable with top live music entertainment.
          </p>
        </div>

        <div className="city-content-container">
          <div className="city-main-content">
            {city.content && (
              <div 
                className="seo-content"
                dangerouslySetInnerHTML={{ __html: city.content }}
              />
            )}

            <div className="blogs-section">
              <h2>Top Music & Entertainment Guides in {city.name}</h2>
              {blogs && blogs.length > 0 ? (
                <div className="blogs-grid">
                  {blogs.map((blog, idx) => (
                    <Link href={`/city/${city.slug}/blog/${blog.slug}`} key={idx} className="blog-card">
                      <div className="blog-card-img">
                         {blog.featured_image_url ? (
                           <img src={blog.featured_image_url} alt={blog.title} />
                         ) : (
                           <div className="blog-img-placeholder">
                             <Mic2 size={40} className="placeholder-icon" />
                           </div>
                         )}
                      </div>
                      <div className="blog-card-content">
                        <h3>{blog.title}</h3>
                        <span className="read-more">Read Article →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="no-blogs">More exciting content coming soon!</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
