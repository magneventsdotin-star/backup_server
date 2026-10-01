import { supabase } from '@database/connection/supabase';
import { defaultBlogs } from '@/app/blog-post/data';

export const revalidate = 86400; // Cache sitemap for 24 hours

export default async function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.magnevents.in').replace(/\/+$/, '');
  const now = new Date().toISOString();

  // 1. Core High-Priority Static Pages (Must all return HTTP 200)
  const coreRoutes = [
    { route: '', priority: 1.0, changeFrequency: 'daily' },
    { route: '/ai-search', priority: 0.95, changeFrequency: 'daily' },
    { route: '/artists', priority: 0.95, changeFrequency: 'daily' },
    { route: '/services', priority: 0.9, changeFrequency: 'weekly' },
    { route: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
    { route: '/how-to-book', priority: 0.85, changeFrequency: 'weekly' },
    { route: '/why-choose', priority: 0.85, changeFrequency: 'weekly' },
    { route: '/gallery', priority: 0.8, changeFrequency: 'weekly' },
    { route: '/testimonials', priority: 0.8, changeFrequency: 'weekly' },
    { route: '/blog-post', priority: 0.85, changeFrequency: 'weekly' },
    { route: '/register', priority: 0.75, changeFrequency: 'monthly' },
    { route: '/register/artist', priority: 0.75, changeFrequency: 'monthly' },
  ].map((item) => ({
    url: `${baseUrl}${item.route}`,
    lastModified: now,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  // 2. High-Intent Event & Location Landing Pages (Served via [location_slug])
  const landingPages = [
    '/singers-near-me',
    '/singer-for-house-party',
    '/live-singer-for-private-party',
    '/live-singer-for-house-party',
    '/house-gig',
    '/book-singer-music-band',
    '/book-live-singer',
    '/singer-in-delhi',
    '/singer-in-noida',
    '/singer-in-gurgaon',
    '/singer-in-mumbai',
    '/singer-in-bangalore',
    '/singer-in-pune',
    '/singer-in-hyderabad',
    '/singer-in-kolkata',
    '/singer-in-jaipur',
    '/singer-in-lucknow',
    '/singer-in-ahmedabad',
    '/singer-in-chandigarh',
    '/singer-in-bhubaneswar',
    '/singer-in-chennai',
    '/singer-in-indore',
    '/singer-in-bhopal',
    '/singer-in-kanpur',
    '/singer-in-nagpur',
    '/singer-in-patna',
    '/singer-in-vadodara',
    '/singer-in-ghaziabad',
    '/singer-in-faridabad',
    '/singer-in-varanasi',
    '/singer-in-agra',
    '/singer-in-nashik',
    '/singer-in-ranchi',
    '/singer-in-amritsar',
    '/singer-in-ludhiana',
    '/dj-in-delhi',
    '/dj-in-noida',
    '/dj-in-mumbai',
    '/dj-in-bangalore',
    '/dj-in-kochi',
    '/dj-in-pune',
    '/dj-booking-near-me',
    '/live-band-in-delhi',
    '/live-band-in-mumbai',
    '/live-band-in-pune',
    '/live-band-in-bangalore',
    '/live-band-in-hyderabad',
    '/live-band-in-jaipur',
    '/live-band-in-chandigarh',
    '/wedding-singer-in-delhi',
    '/wedding-singer-in-mumbai',
    '/wedding-singer-in-pune',
    '/wedding-singer-in-jaipur',
    '/wedding-band-in-delhi',
    '/wedding-band-in-mumbai',
    '/wedding-band-in-hyderabad',
    '/book-singer-for-house-party-in-delhi',
    '/book-live-band-in-delhi',
    '/book-singer-for-wedding',
    '/corporate-musician-in-bangalore',
    '/corporate-musician-in-delhi',
    '/corporate-musician-in-mumbai',
    '/house-party-singer-in-ahmedabad',
    '/house-party-singer-in-delhi',
    '/house-party-singer-in-gurgaon',
    '/house-party-singer-in-noida',
    '/wedding-singer-in-chennai',
    '/sufi-singer-in-kolkata',
    '/sufi-singer-in-delhi',
    '/wedding-musicians-in-surat',
    '/corporate-singer-in-jaipur',
    '/corporate-musician-in-lucknow',
    '/live-singer-in-kanpur',
    '/wedding-singer-in-nagpur',
    '/private-event-singer-in-indore',
    '/house-party-singer-in-thane',
    '/shaadi-singer-in-bhopal',
    '/sufi-singer-in-visakhapatnam',
    '/bollywood-singer-in-pimpri-chinchwad',
    '/birthday-singer-in-patna',
    '/corporate-singer-in-vadodara',
    '/shaadi-singer-in-ghaziabad',
    '/sangeet-singer-in-ludhiana',
    '/corporate-singer-in-agra',
    '/ghazal-singer-in-nashik',
    '/ghazal-singer-in-delhi',
    '/ghazal-singer-in-mumbai',
    '/ghazal-singer-in-bhubaneswar',
    '/live-band-in-ranchi',
    '/house-party-singer-in-faridabad',
    '/live-singer-in-meerut',
    '/acoustic-singer-in-rajkot',
    '/acoustic-singer-in-delhi',
    '/corporate-event-singer-in-kalyan-dombivli',
    '/acoustic-singer-in-vasai-virar',
    '/live-band-in-varanasi',
    '/corporate-singer-in-srinagar',
    '/bollywood-singer-in-aurangabad',
    '/corporate-event-singer-in-dhanbad',
    '/acoustic-singer-in-amritsar',
    '/punjabi-singer-in-navi-mumbai',
    '/punjabi-singer-in-delhi',
    '/punjabi-singer-in-chandigarh',
    '/live-singer-in-allahabad',
    '/corporate-musician-in-howrah',
    '/birthday-singer-in-gwalior',
    '/birthday-singer-in-jabalpur',
    '/house-party-singer-in-coimbatore',
    '/live-singer-in-vijayawada',
    '/corporate-musician-in-jodhpur',
    '/corporate-musician-in-madurai',
    '/live-singer-in-raipur',
    '/corporate-musician-in-kota',
    '/corporate-musician-in-chandigarh',
    '/corporate-event-singer-in-guwahati',
    '/ghazal-singer-in-solapur',
    '/corporate-event-singer-in-hubli-dharwad',
    '/live-band-in-mysore',
    '/corporate-musician-in-tiruchirappalli',
    '/live-singer-in-bareilly',
    '/corporate-event-singer-in-aligarh',
    '/live-band-in-tiruppur',
    '/corporate-event-singer-in-gurgaon',
    '/punjabi-singer-in-moradabad',
    '/corporate-singer-in-jalandhar',
    '/punjabi-singer-in-salem',
    '/wedding-band-in-warangal',
    '/shaadi-singer-in-mira-bhayandar',
    '/bollywood-singer-in-jalgaon',
    '/acoustic-singer-in-guntur',
    '/corporate-singer-in-thiruvananthapuram',
    '/wedding-band-in-bhiwandi',
    '/sufi-singer-in-saharanpur',
    '/live-band-in-gorakhpur',
    '/wedding-musicians-in-bikaner',
    '/shaadi-singer-in-amravati',
    '/corporate-musician-in-noida',
    '/house-party-singer-in-jamshedpur',
    '/live-singer-in-bhilai',
    '/live-music-in-cuttack',
    '/bollywood-singer-in-firozabad',
    '/corporate-event-singer-in-kochi',
    '/shaadi-singer-in-nellore',
    '/sangeet-singer-in-bhavnagar',
    '/sangeet-singer-in-dehradun',
    '/singer-for-events-in-durgapur',
    '/shaadi-singer-in-asansol',
    '/birthday-singer-in-rourkela',
    '/shaadi-singer-in-nanded',
    '/corporate-musician-in-kolhapur',
    '/punjabi-singer-in-ajmer',
    '/wedding-musicians-in-akola',
    '/singer-for-events-in-gulbarga',
    '/live-singer-in-jamnagar',
    '/birthday-singer-in-ujjain',
    '/birthday-singer-in-loni',
    '/bollywood-singer-in-siliguri',
    '/live-band-in-jhansi',
    '/live-singer-in-ulhasnagar',
    '/corporate-musician-in-jammu',
    '/live-music-in-sangli-miraj-kupwad',
    '/wedding-band-in-mangalore',
    '/acoustic-singer-in-erode',
    '/wedding-singer-in-belgaum',
    '/house-party-singer-in-ambattur',
    '/sangeet-singer-in-tirunelveli',
    '/live-band-in-malegaon',
    '/singer-for-events-in-gaya',
    '/wedding-singer-in-udaipur',
    '/live-singer-in-maheshtala',
    '/corporate-singer-in-davanagere',
    '/house-party-singer-in-kozhikode',
    '/wedding-musicians-in-kurnool',
    '/corporate-event-singer-in-rajpur-sonarpur',
    '/wedding-band-in-rajahmundry',
    '/corporate-musician-in-bokaro',
    '/corporate-musician-in-south-dumdum',
    '/wedding-musicians-in-bellary',
    '/bollywood-singer-in-patiala',
    '/corporate-event-singer-in-gopalpur',
    '/sangeet-singer-in-agartala',
    '/corporate-musician-in-bhagalpur',
    '/wedding-band-in-muzaffarnagar',
    '/house-party-singer-in-bhatpara',
    '/shaadi-singer-in-panihati',
    '/live-music-in-latur',
    '/singer-for-events-in-dhule',
    '/punjabi-singer-in-tirupati',
    '/singer-for-events-in-rohtak',
    '/private-event-singer-in-korba',
    '/sangeet-singer-in-bhilwara',
    '/house-party-singer-in-berhampur',
    '/acoustic-singer-in-muzaffarpur',
    '/corporate-event-singer-in-ahmednagar',
    '/punjabi-singer-in-mathura',
    '/private-event-singer-in-kollam',
    '/acoustic-singer-in-avadi',
    '/live-singer-in-kadapa',
    '/wedding-singer-in-kamarhati',
    '/corporate-musician-in-sambalpur',
    '/corporate-musician-in-bilaspur',
    '/bollywood-singer-in-shahjahanpur',
    '/ghazal-singer-in-satara',
    '/wedding-musicians-in-bijapur',
    '/punjabi-singer-in-rampur',
    '/shaadi-singer-in-shivamogga',
    '/house-party-singer-in-chandrapur',
    '/wedding-band-in-junagadh',
    '/private-event-singer-in-thrissur',
    '/acoustic-singer-in-alwar',
    '/shaadi-singer-in-bardhaman',
    '/wedding-band-in-kulti',
    '/corporate-singer-in-kakinada',
    '/live-music-in-nizamabad',
    '/sufi-singer-in-parbhani',
    '/house-party-singer-in-tumkur',
    '/shaadi-singer-in-khammam',
    '/singer-for-events-in-ozhukarai',
    '/corporate-event-singer-in-bihar-sharif',
    '/wedding-singer-in-panipat',
    '/live-band-in-darbhanga',
    '/house-party-singer-in-bally',
    '/live-band-in-aizawl',
    '/wedding-musicians-in-dewas',
    '/singer-for-events-in-ichalkaranji',
    '/corporate-event-singer-in-karnal',
    '/corporate-event-singer-in-bathinda',
    '/corporate-musician-in-jalna',
    '/wedding-singer-in-eluru',
    '/singer-for-events-in-barasat',
    '/wedding-singer-in-kirari-suleman-nagar',
    '/live-band-in-purnia',
    '/birthday-singer-in-satna',
    '/corporate-event-singer-in-mau',
    '/sangeet-singer-in-sonipat',
    '/wedding-singer-in-farrukhabad',
    '/private-event-singer-in-sagar',
    '/corporate-singer-in-durg',
    '/shaadi-singer-in-imphal',
    '/wedding-singer-in-ratlam',
    '/bollywood-singer-in-hapur',
    '/live-band-in-anantapur',
    '/private-event-singer-in-arrah',
    '/live-music-in-karimnagar',
    '/wedding-singer-in-etawah',
    '/private-event-singer-in-ambernath',
    '/singer-for-events-in-north-dumdum',
    '/live-singer-in-bharatpur',
    '/singer-for-events-in-begusarai',
    '/shaadi-singer-in-new-delhi',
    '/corporate-singer-in-gandhidham',
    '/corporate-singer-in-baranagar',
    '/singer-for-events-in-tiruvottiyur',
    '/live-band-in-puducherry',
    '/corporate-event-singer-in-sikar',
    '/house-party-singer-in-thoothukudi',
    '/singer-for-events-in-rewa',
    '/corporate-singer-in-mirzapur',
    '/wedding-singer-in-raichur',
    '/corporate-event-singer-in-pali',
    '/corporate-event-singer-in-ramagundam',
    '/singer-for-events-in-silchar',
    '/corporate-event-singer-in-haridwar',
    '/live-band-in-vijayanagaram',
    '/corporate-event-singer-in-tenali',
    '/house-party-singer-in-nagercoil',
    '/sangeet-singer-in-sri-ganganagar',
    '/sangeet-singer-in-karawal-nagar',
    '/live-music-in-mango',
    '/punjabi-singer-in-thanjavur',
    '/sufi-singer-in-bulandshahr',
    '/corporate-musician-in-uluberia',
    '/ghazal-singer-in-katni',
    '/live-music-in-sambhal',
    '/house-party-singer-in-singrauli',
    '/singer-for-events-in-nadiad',
    '/birthday-singer-in-secunderabad',
    '/live-band-in-naihati',
    '/live-singer-in-yamunanagar',
    '/corporate-singer-in-bidhannagar',
    '/live-band-in-pallavaram',
    '/wedding-band-in-bidar',
    '/sufi-singer-in-munger',
    '/live-singer-in-panchkula',
    '/wedding-musicians-in-burhanpur',
    '/live-music-in-raurkela-industrial-township',
    '/house-party-singer-in-kharagpur',
    '/wedding-singer-in-dindigul',
    '/shaadi-singer-in-gandhinagar',
    '/corporate-singer-in-hospet',
    '/corporate-musician-in-nangloi-jat',
    '/corporate-event-singer-in-malda',
    '/ghazal-singer-in-ongole',
    '/acoustic-singer-in-deoghar',
    '/wedding-band-in-chapra',
    '/live-singer-in-haldia',
    '/bollywood-singer-in-khandwa',
    '/sangeet-singer-in-nandyal',
    '/corporate-event-singer-in-morena',
    '/sangeet-singer-in-amroha',
    '/sangeet-singer-in-anand',
    '/wedding-singer-in-bhind',
    '/wedding-band-in-bhalswa-jahangir-pur',
    '/private-event-singer-in-madhyamgram',
    '/punjabi-singer-in-bhiwani',
    '/live-music-in-berhampore',
    '/house-party-singer-in-ambala',
    '/live-singer-in-morbi',
    '/wedding-singer-in-fatehpur',
    '/wedding-singer-in-raebareli',
    '/corporate-singer-in-khora',
    '/live-band-in-chittoor',
    '/birthday-singer-in-bhusawal'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 3. Dynamic Database Routes (Safe & Isolated per Resource)
  let artistRoutes = [];
  try {
    const { data: artists } = await supabase
      .from('artists')
      .select('id, name, alias, is_live, updated_at')
      .eq('is_live', true);

    if (artists && artists.length > 0) {
      artistRoutes = artists.map((artist) => {
        const rawName = artist.alias || artist.name || artist.id;
        const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        return {
          url: `${baseUrl}/artist/${slug || artist.id}`,
          lastModified: artist.updated_at ? new Date(artist.updated_at).toISOString() : now,
          changeFrequency: 'weekly',
          priority: 0.9,
        };
      });
    }
  } catch (err) {
    console.error('Error fetching artists for sitemap:', err);
  }

  let cityRoutes = [];
  try {
    const { data: cities } = await supabase
      .from('seo_cities')
      .select('slug, updated_at')
      .eq('is_active', true);

    if (cities && cities.length > 0) {
      cityRoutes = cities.map((city) => ({
        url: `${baseUrl}/city/${city.slug}`,
        lastModified: city.updated_at ? new Date(city.updated_at).toISOString() : now,
        changeFrequency: 'daily',
        priority: 0.9,
      }));
    }
  } catch (err) {
    console.error('Error fetching cities for sitemap:', err);
  }

  let cityBlogRoutes = [];
  try {
    const { data: seoBlogs } = await supabase
      .from('seo_blogs')
      .select('slug, updated_at, seo_cities(slug)')
      .eq('status', 'published');

    if (seoBlogs && seoBlogs.length > 0) {
      cityBlogRoutes = seoBlogs
        .filter((blog) => blog.seo_cities?.slug && blog.slug)
        .map((blog) => ({
          url: `${baseUrl}/city/${blog.seo_cities.slug}/blog/${blog.slug}`,
          lastModified: blog.updated_at ? new Date(blog.updated_at).toISOString() : now,
          changeFrequency: 'weekly',
          priority: 0.85,
        }));
    }
  } catch (err) {
    console.error('Error fetching SEO city blogs for sitemap:', err);
  }

  let generalBlogRoutes = [];
  try {
    // A. Database Blogs
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, updated_at');

    if (blogs && blogs.length > 0) {
      generalBlogRoutes = blogs
        .filter((b) => b.slug)
        .map((b) => ({
          url: `${baseUrl}/blog-post/${b.slug}`,
          lastModified: b.updated_at ? new Date(b.updated_at).toISOString() : now,
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
    }

    // B. Static Default Blogs (fallback & fast discoverability)
    if (defaultBlogs && Array.isArray(defaultBlogs)) {
      const staticBlogUrls = defaultBlogs.map((b) => ({
        url: `${baseUrl}/blog-post/${b.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
      generalBlogRoutes = [...generalBlogRoutes, ...staticBlogUrls];
    }
  } catch (err) {
    console.error('Error fetching general blogs for sitemap:', err);
  }

  // 4. Combine and Deduplicate URLs
  const allEntries = [
    ...coreRoutes,
    ...landingPages,
    ...artistRoutes,
    ...cityRoutes,
    ...cityBlogRoutes,
    ...generalBlogRoutes,
  ];

  const seenUrls = new Set();
  const deduplicated = [];

  for (const entry of allEntries) {
    if (entry.url && !seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      deduplicated.push(entry);
    }
  }

  return deduplicated;
}
