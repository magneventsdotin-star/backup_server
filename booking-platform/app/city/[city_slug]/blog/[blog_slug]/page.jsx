import { notFound } from 'next/navigation';
import { supabase } from '@database/connection/supabase';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { city_slug, blog_slug } = params;
  
  const { data: blog } = await supabase
    .from('seo_blogs')
    .select('*, seo_cities!inner(slug, name)')
    .eq('slug', blog_slug)
    .eq('seo_cities.slug', city_slug)
    .single();

  if (!blog) {
    return { title: 'Blog Not Found - Magnevents' };
  }

  return {
    title: blog.seo_title || blog.title,
    description: blog.meta_description,
    alternates: {
      canonical: `https://www.magnevents.in/city/${city_slug}/blog/${blog.slug}`,
    }
  };
}

export default async function CityBlogPage({ params }) {
  const { city_slug, blog_slug } = params;

  const { data: blog } = await supabase
    .from('seo_blogs')
    .select('*, seo_cities!inner(slug, name)')
    .eq('slug', blog_slug)
    .eq('seo_cities.slug', city_slug)
    .single();

  if (!blog) {
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.magnevents.in/city/${city_slug}/blog/${blog.slug}`
    },
    "headline": blog.seo_title || blog.title,
    "description": blog.meta_description,
    "image": blog.featured_image_url || "https://www.magnevents.in/logo.webp",
    "datePublished": blog.published_at || blog.created_at,
    "dateModified": blog.updated_at,
    "author": {
      "@type": "Organization",
      "name": "Magnevents",
      "url": "https://www.magnevents.in"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <div className="seo-blog-page">
        <div className="blog-container">
          <nav className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <Link href={`/city/${city_slug}`}>{blog.seo_cities.name}</Link>
            <span className="separator">/</span>
            <span className="current">{blog.title}</span>
          </nav>

          <article className="blog-content">
            {blog.featured_image_url && (
              <img 
                src={blog.featured_image_url} 
                alt={blog.title}
                className="featured-image"
              />
            )}
            
            <div 
              className="blog-html-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            
            <div className="cta-section">
              <h3>Ready to book a singer in {blog.seo_cities.name}?</h3>
              <p>Explore verified artists and live bands for your next event.</p>
              <Link href="/artists" className="cta-btn">Browse Artists</Link>
            </div>
          </article>
        </div>
      </div>

      <style jsx>{`
        .seo-blog-page {
          min-height: 100vh;
          background: #000;
          color: #fff;
          padding: 100px 20px 60px;
        }
        .blog-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #a1a1aa;
          margin-bottom: 40px;
        }
        .breadcrumb a {
          color: #818cf8;
          text-decoration: none;
        }
        .breadcrumb a:hover {
          text-decoration: underline;
        }
        .separator { color: #52525b; }
        .current { color: #f4f4f5; }
        
        .featured-image {
          width: 100%;
          border-radius: 20px;
          margin-bottom: 40px;
        }
        
        .blog-html-content {
          line-height: 1.8;
          font-size: 17px;
          color: #d4d4d8;
        }
        .blog-html-content :global(h1) {
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 24px;
          line-height: 1.2;
        }
        .blog-html-content :global(h2) {
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          margin: 40px 0 20px;
        }
        .blog-html-content :global(h3) {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin: 30px 0 16px;
        }
        .blog-html-content :global(p) {
          margin-bottom: 20px;
        }
        
        .cta-section {
          margin-top: 60px;
          padding: 40px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 16px;
          text-align: center;
        }
        .cta-section h3 {
          font-size: 24px;
          margin-bottom: 12px;
          color: #fff;
        }
        .cta-section p {
          color: #a1a1aa;
          margin-bottom: 24px;
        }
        .cta-btn {
          display: inline-block;
          background: #6366f1;
          color: #fff;
          padding: 12px 28px;
          border-radius: 8px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s;
        }
        .cta-btn:hover { background: #4f46e5; }
      `}</style>
    </>
  );
}
