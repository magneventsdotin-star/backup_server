import { notFound } from 'next/navigation';
import { supabase } from '@database/connection/supabase';
import Link from 'next/link';
import SEOLandingHero from '@/app/components/common/SEOLandingHero';
import SEOArtistsGrid from '@/app/components/common/SEOArtistsGrid';
import VideoGridSection from '@/app/components/home/VideoGridSection';
import PromotionalOfferSection from '@/app/components/home/PromotionalOfferSection';
import ContactSection from '@/app/components/home/ContactSection';
import AllCitiesSection from '@/app/components/common/AllCitiesSection';
import '../../../../seo-pages.css';

export const revalidate = 86400; // Cache at Edge CDN for 24 hours


function slugToName(slug) {
  if (!slug) return 'India';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function parseCategoryAndSubCategory(title, slug) {
  const text = `${title || ''} ${slug || ''}`.toLowerCase();
  
  let category = 'Singer';
  let subCategory = '';

  if (text.includes('dj')) category = 'Dj';
  else if (text.includes('band') || text.includes('live band')) category = 'Live band';
  else if (text.includes('comedian') || text.includes('standup')) category = 'Comedian';
  else if (text.includes('musician') || text.includes('instrumentalist')) category = 'Musician';
  else if (text.includes('singer') || text.includes('vocalist') || text.includes('artist')) category = 'Singer';

  if (text.includes('ghazal') || text.includes('gazal')) subCategory = 'Gazals';
  else if (text.includes('sufi')) subCategory = 'Sufi';
  else if (text.includes('retro') || text.includes('90s')) subCategory = 'Retro';
  else if (text.includes('punjabi') || text.includes('bhangra')) subCategory = 'Punjabi';
  else if (text.includes('bollywood')) subCategory = 'Bollywood';
  else if (text.includes('rock')) subCategory = 'Rock';
  else if (text.includes('classical')) subCategory = 'Classical';
  else if (text.includes('acoustic')) subCategory = 'Acoustic';

  return { category, subCategory };
}

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const { city_slug, blog_slug } = awaitedParams;
  
  const decodedCitySlug = decodeURIComponent(city_slug || '').trim();
  const normalizedCitySlug = decodedCitySlug.toLowerCase().replace(/\s+/g, '-');
  const decodedBlogSlug = decodeURIComponent(blog_slug || '').trim();
  const normalizedBlogSlug = decodedBlogSlug.toLowerCase().replace(/\s+/g, '-');

  let { data: blog } = await supabase
    .from('seo_blogs')
    .select('*, seo_cities(slug, name)')
    .or(`slug.eq."${decodedBlogSlug}",slug.eq."${normalizedBlogSlug}"`)
    .single();

  if (!blog) {
    return { title: 'Blog Not Found - Magnevents' };
  }

  const cityName = blog.seo_cities?.name || slugToName(city_slug);

  return {
    title: blog.seo_title || `${blog.title} | Magnevents ${cityName}`,
    description: blog.meta_description || `Guide and tips for ${blog.title}. Hire verified live singers & performers in ${cityName} directly with 0% commission.`,
    alternates: {
      canonical: `/city/${city_slug}/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.seo_title || blog.title,
      description: blog.meta_description,
      images: blog.featured_image_url ? [{ url: blog.featured_image_url }] : [],
    }
  };
}

export default async function CityBlogPage({ params }) {
  const awaitedParams = await params;
  const { city_slug, blog_slug } = awaitedParams;

  const decodedCitySlug = decodeURIComponent(city_slug || '').trim();
  const normalizedCitySlug = decodedCitySlug.toLowerCase().replace(/\s+/g, '-');
  const decodedBlogSlug = decodeURIComponent(blog_slug || '').trim();
  const normalizedBlogSlug = decodedBlogSlug.toLowerCase().replace(/\s+/g, '-');

  let { data: blog } = await supabase
    .from('seo_blogs')
    .select('*, seo_cities(id, slug, name)')
    .or(`slug.eq."${decodedBlogSlug}",slug.eq."${normalizedBlogSlug}"`)
    .single();

  if (!blog) {
    notFound();
  }

  const cityName = blog.seo_cities?.name || slugToName(city_slug);
  const { category, subCategory } = parseCategoryAndSubCategory(blog.title, blog.slug);

  // Fetch top 5 curated artists from database for this category & city
  const topArtists = await getTopArtistsForSEO({
    category,
    subCategory,
    city: cityName,
    limit: 5
  });

  // Fetch other blogs in the same city for related guides
  let relatedBlogs = [];
  if (blog.city_id || blog.seo_cities?.id) {
    const cityId = blog.city_id || blog.seo_cities?.id;
    const { data: relData } = await supabase
      .from('seo_blogs')
      .select('title, slug, featured_image_url, created_at')
      .eq('city_id', cityId)
      .neq('slug', blog.slug)
      .limit(3);
    relatedBlogs = relData || [];
  }

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.magnevents.in/city/${city_slug}/blog/${blog.slug}`
      },
      "headline": blog.seo_title || blog.title,
      "description": blog.meta_description,
      "image": blog.featured_image_url || "https://pub-1802bb19214743ffa99aa227f25e7ede.r2.dev/assets/lux-singer-session.webp",
      "datePublished": blog.published_at || blog.created_at,
      "dateModified": blog.updated_at || blog.created_at,
      "author": {
        "@type": "Organization",
        "name": "Magnevents",
        "url": "https://www.magnevents.in"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.magnevents.in"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": cityName,
          "item": `https://www.magnevents.in/city/${city_slug}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": blog.title,
          "item": `https://www.magnevents.in/city/${city_slug}/blog/${blog.slug}`
        }
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="seo-blog-page-root">
        {/* Luxury Hero Banner with Interactive Booking Engine & Top 5 Verified Artists Showcase */}
        <SEOLandingHero
          heroTitle={blog.title}
          heroSubtitle={blog.meta_description || `Book verified, celebrated ${category}s directly for weddings, private parties, birthday bashes & celebrations in ${cityName}. 100% Artist Arrival Guarantee.`}
          category={category}
          city={cityName}
          subCategory={subCategory}
          topArtists={topArtists}
        />

        {/* Blog Article & Interactive Reading Experience */}
        <div className="seo-blog-article-wrapper">
          <div className="seo-blog-article-container">
            {/* Breadcrumb Strip */}
            <nav className="seo-blog-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className="sep">/</span>
              <Link href={`/city/${city_slug}`}>{cityName}</Link>
              <span className="sep">/</span>
              <span className="current">{blog.title}</span>
            </nav>

            <div className="seo-blog-main-grid">
              {/* Main Article Content */}
              <article className="seo-blog-article-body">
                {/* Article Header Metadata */}
                <div className="seo-article-header-meta">
                  <span className="seo-article-tag">
                    <span>✨</span>
                    <span>VERIFIED ENTERTAINMENT GUIDE</span>
                  </span>
                  <span className="seo-article-read-time">📖 4 min read</span>
                  <span className="seo-article-location">📍 {cityName}</span>
                </div>

                {/* Featured Banner Image */}
                {blog.featured_image_url && (
                  <div className="seo-article-featured-img-wrap">
                    <img 
                      src={blog.featured_image_url} 
                      alt={blog.title}
                      className="seo-article-featured-img"
                    />
                    <div className="seo-img-glow-overlay" />
                  </div>
                )}

                {/* Key Highlights / Fast Takeaways Box */}
                <div className="seo-article-highlight-box">
                  <div className="seo-highlight-header">
                    <span className="seo-highlight-icon">⭐</span>
                    <h4>Quick Highlights for Booking in {cityName}</h4>
                  </div>
                  <ul>
                    <li><strong>Direct Artist Rates:</strong> 0% agency markup with transparent upfront pricing.</li>
                    <li><strong>100% Arrival Guarantee:</strong> Backed by Magnevents backup artist network.</li>
                    <li><strong>Full Sound Coordination:</strong> Professional sound setup, mics, and sound engineering available.</li>
                  </ul>
                </div>

                {/* Main Rendered HTML Content */}
                <div 
                  className="seo-blog-html-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Direct Consultation / Booking Callout Card */}
                <div className="seo-blog-cta-card">
                  <div className="seo-cta-card-content">
                    <span className="seo-cta-badge">⚡ INSTANT ARTIST BOOKING</span>
                    <h3>Ready to hire a live singer in {cityName}?</h3>
                    <p>Get instant price quotes, performance video clips, and availability for your date within 6 minutes.</p>
                    <div className="seo-cta-actions">
                      <a
                        href={`https://wa.me/918076515257?text=${encodeURIComponent(`Hi Magnevents! I read your article "${blog.title}". I want to check availability & quotes for live singers in ${cityName}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="seo-cta-whatsapp-btn"
                      >
                        <span>💬 WhatsApp Instant Quote</span>
                      </a>
                      <a
                        href="#seo-lead-form"
                        className="seo-cta-lead-btn"
                      >
                        <span>⚡ Book Online (0% Brokerage)</span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>

              {/* Sidebar with Quick Perks & Related Guides */}
              <aside className="seo-blog-sidebar">
                <div className="seo-sidebar-sticky">
                  {/* Card 1: Fast Quote Widget */}
                  <div className="seo-sidebar-card booking-perks-card">
                    <div className="seo-sidebar-head">
                      <span className="seo-sidebar-badge">⚡ FAST QUOTE</span>
                      <h4>Planning an Event in {cityName}?</h4>
                      <p>Talk to our artist booking manager directly & receive custom packages for {cityName}.</p>
                    </div>
                    <a
                      href={`https://wa.me/918076515257?text=${encodeURIComponent(`Hi! I want to check available artists for my event in ${cityName}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="seo-sidebar-whatsapp-link"
                    >
                      <span>💬 Chat with Booking Specialist</span>
                    </a>
                    <div className="seo-sidebar-perks-list">
                      <div className="perk-item">
                        <span className="perk-icon">🛡️</span>
                        <span>100% Artist Arrival Guarantee</span>
                      </div>
                      <div className="perk-item">
                        <span className="perk-icon">⚡</span>
                        <span>Direct Artist Connect (Zero Fees)</span>
                      </div>
                      <div className="perk-item">
                        <span className="perk-icon">🎵</span>
                        <span>500+ Verified Live Performers</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Related Blogs / Guides */}
                  {relatedBlogs && relatedBlogs.length > 0 && (
                    <div className="seo-sidebar-card related-guides-card">
                      <div className="seo-sidebar-head">
                        <span className="seo-sidebar-badge">📚 GUIDES</span>
                        <h4>More Guides in {cityName}</h4>
                      </div>
                      <div className="seo-related-blogs-list">
                        {relatedBlogs.map((rBlog, idx) => (
                          <Link 
                            key={idx} 
                            href={`/city/${city_slug}/blog/${rBlog.slug}`}
                            className="seo-related-blog-item"
                          >
                            {rBlog.featured_image_url && (
                              <img src={rBlog.featured_image_url} alt={rBlog.title} />
                            )}
                            <div>
                              <h5>{rBlog.title}</h5>
                              <span className="read-arrow">Read Guide →</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/* Promotional Offers Banner */}
        <PromotionalOfferSection />

        {/* Full City Artists Grid */}
        <div className="seo-blog-full-artists-section">
          <SEOArtistsGrid category={category} city={cityName} fallbackArtists={topArtists} />
        </div>

        {/* Video Grid Section */}
        <VideoGridSection />

        {/* Contact / Inquiry Section */}
        <ContactSection />

        {/* Nationwide All Cities Directory */}
        <AllCitiesSection currentCity={cityName} />
      </div>
    </>
  );
}
