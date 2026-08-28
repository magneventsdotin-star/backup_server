import { notFound } from 'next/navigation';
import { supabase } from '@database/connection/supabase';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { city_slug } = params;
  
  const { data: city } = await supabase
    .from('seo_cities')
    .select('*')
    .eq('slug', city_slug)
    .eq('is_active', true)
    .single();

  if (!city) {
    return { title: 'City Not Found - Magnevents' };
  }

  return {
    title: city.seo_title || `Hire Best Singers in ${city.name} | Magnevents`,
    description: city.meta_description || `Find and book top-rated live singers, bands, and musicians for weddings, corporate events, and parties in ${city.name}.`,
    alternates: {
      canonical: `https://www.magnevents.in/city/${city.slug}`,
    }
  };
}

export default async function CityLandingPage({ params }) {
  const { city_slug } = params;

  // 1. Fetch City
  const { data: city } = await supabase
    .from('seo_cities')
    .select('*')
    .eq('slug', city_slug)
    .eq('is_active', true)
    .single();

  if (!city) {
    notFound();
  }

  // 2. Fetch SEO Blogs for this city
  const { data: blogs } = await supabase
    .from('seo_blogs')
    .select('title, slug, created_at, featured_image_url')
    .eq('city_id', city.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  // 3. Schema Markup
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": city.seo_title || `Hire Singers in ${city.name}`,
    "description": city.meta_description,
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
                           <div className="blog-img-placeholder">🎙️</div>
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

      <style jsx>{`
        .city-landing-page {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding-top: 80px;
        }
        .city-hero {
          text-align: center;
          padding: 60px 20px;
          background: linear-gradient(180deg, #111 0%, #000 100%);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .city-hero h1 {
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 900;
          margin-bottom: 16px;
          background: linear-gradient(90deg, #fff, #a5b4fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .city-subtitle {
          font-size: 18px;
          color: #a1a1aa;
          max-width: 600px;
          margin: 0 auto;
        }
        .city-content-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .seo-content {
          color: #d4d4d8;
          line-height: 1.8;
          font-size: 16px;
          margin-bottom: 60px;
        }
        .seo-content h2 { color: #fff; margin-top: 30px; font-size: 24px; }
        .seo-content h3 { color: #fff; margin-top: 20px; font-size: 20px; }
        .blogs-section h2 {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 30px;
        }
        .blogs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .blog-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .blog-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
        }
        .blog-card-img {
          height: 180px;
          background: #111;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .blog-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .blog-img-placeholder {
          font-size: 48px;
        }
        .blog-card-content {
          padding: 20px;
        }
        .blog-card-content h3 {
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.4;
          margin: 0 0 12px 0;
        }
        .read-more {
          color: #818cf8;
          font-size: 14px;
          font-weight: 600;
        }
        .no-blogs {
          color: #71717a;
          font-style: italic;
        }
      `}</style>
    </>
  );
}
