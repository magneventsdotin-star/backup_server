import { notFound, redirect } from 'next/navigation';
import SEOLandingPage from '@/app/components/common/SEOLandingPage';
import { generateOverview, generateServices, generateFAQs, generateRelatedLinks } from '@/app/utils/seoTemplates';
import { getTopArtistsForSEO } from '@/app/utils/fetchTopArtists';

export const revalidate = 86400; // Cache at Edge CDN for 24 hours - instant 5ms loading

export async function generateMetadata({ params }) {
  // Await params in Next.js 15 before using properties
  const awaitedParams = await params;
  const rawSlug = decodeURIComponent(awaitedParams.location_slug || '').trim();
  const location_slug = rawSlug.toLowerCase().replace(/[\s_]+/g, '-').replace(/\/+$/, '');
  
  const formattedTitle = location_slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `${formattedTitle} | Verified Artists | Magnevents`,
    description: `Looking for the best ${formattedTitle}? Book verified artists, musicians, and performers for your house party, wedding, or corporate event via Magnevents.`,
    alternates: {
      canonical: `/${location_slug}`,
    }
  };
}

export default async function LocationServicePage({ params }) {
  const awaitedParams = await params;
  const rawSlug = decodeURIComponent(awaitedParams.location_slug || '').trim();
  const location_slug = rawSlug.toLowerCase().replace(/[\s_]+/g, '-').replace(/\/+$/, '');
  
  const validKeywords = ['singer', 'band', 'dj', 'comedian', 'anchor', 'dancer', 'magician', 'guitarist', 'music', 'artist', 'ghazal', 'gazal', 'sufi', 'gig'];
  const isValidKeyword = validKeywords.some(kw => location_slug.includes(kw));

  const majorCities = [
    'delhi', 'new-delhi', 'noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad',
    'mumbai', 'bangalore', 'bengaluru', 'pune', 'hyderabad', 'chennai', 'kolkata', 'ahmedabad',
    'chandigarh', 'jaipur', 'lucknow', 'surat', 'indore', 'patna', 'bhopal', 'agra',
    'kanpur', 'nagpur', 'thane', 'visakhapatnam', 'vadodara', 'ludhiana', 'nashik',
    'meerut', 'rajkot', 'varanasi', 'srinagar', 'aurangabad', 'dhanbad', 'amritsar',
    'allahabad', 'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada',
    'jodhpur', 'madurai', 'raipur', 'kota', 'guwahati', 'chandigarh', 'thiruvananthapuram', 'kochi'
  ];

  if (majorCities.includes(location_slug)) {
    redirect(`/city/${location_slug}`);
  }

  // If the raw URL slug contained spaces or non-canonical characters, redirect to the normalized URL
  if (awaitedParams.location_slug !== location_slug) {
    redirect(`/${location_slug}`);
  }

  if (!isValidKeyword) {
    notFound();
  }

  const formattedTitle = location_slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  let parsedCategory = 'Singer';
  let parsedSubCategory = '';
  let parsedCity = 'All Cities';
  const slugLower = location_slug;
  
  if (slugLower.includes('band')) parsedCategory = 'Live band';
  else if (slugLower.includes('musician') || slugLower.includes('music') || slugLower.includes('guitarist')) parsedCategory = 'Musician';
  else if (slugLower.includes('dj')) parsedCategory = 'Dj';
  else if (slugLower.includes('comedian')) parsedCategory = 'Comedian';
  else if (slugLower.includes('magician')) parsedCategory = 'Magician';
  else if (slugLower.includes('dancer')) parsedCategory = 'Dancer';
  else if (slugLower.includes('anchor')) parsedCategory = 'Anchor';
  else if (slugLower.includes('singer') || slugLower.includes('artist') || slugLower.includes('ghazal') || slugLower.includes('gazal') || slugLower.includes('sufi') || slugLower.includes('gig')) parsedCategory = 'Singer';

  if (slugLower.includes('ghazal') || slugLower.includes('gazal')) parsedSubCategory = 'Gazals';
  else if (slugLower.includes('sufi')) parsedSubCategory = 'Sufi';
  else if (slugLower.includes('sangeet')) parsedSubCategory = 'Sangeet';
  else if (slugLower.includes('wedding')) parsedSubCategory = 'Wedding';
  else if (slugLower.includes('retro')) parsedSubCategory = 'Retro';
  else if (slugLower.includes('punjabi')) parsedSubCategory = 'Punjabi';
  else if (slugLower.includes('bollywood')) parsedSubCategory = 'Bollywood';
  else if (slugLower.includes('rock')) parsedSubCategory = 'Rock';
  else if (slugLower.includes('classical')) parsedSubCategory = 'Classical';

  const parts = slugLower.split('-in-');
  if (parts.length > 1) {
    const cityStr = parts[1].replace(/-/g, ' ').trim();
    if (cityStr.toLowerCase() === 'delhi ncr') {
      parsedCity = 'Delhi NCR';
    } else {
      parsedCity = cityStr.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }

  // Fetch top 5 curated artists from the database for this category & city
  const topArtists = await getTopArtistsForSEO({
    category: parsedCategory,
    subCategory: parsedSubCategory,
    city: parsedCity,
    limit: 5
  });

  const overviewHtml = generateOverview(parsedCategory, parsedCity);
  const services = generateServices(parsedCategory, parsedCity);
  const faqs = generateFAQs(parsedCategory, parsedCity);
  const relatedLinks = generateRelatedLinks(parsedCategory, parsedCity);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `Best ${formattedTitle}`,
      "description": `Book verified ${formattedTitle} for your next event.`,
      "url": `https://www.magnevents.in/${location_slug}`
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
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
          "name": parsedCity,
          "item": `https://www.magnevents.in/city/${parsedCity.toLowerCase().replace(/ /g, '-')}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `Book ${parsedCategory} in ${parsedCity}`
        }
      ]
    }
  ];

  return (
    <SEOLandingPage 
      locationSlug={location_slug}
      heroTitle={`Top ${formattedTitle}`}
      heroSubtitle={`Book verified performers directly for your next grand event.`}
      schema={schema}
      category={parsedCategory}
      city={parsedCity}
      subCategory={parsedSubCategory}
      topArtists={topArtists}
      overviewHtml={overviewHtml}
      services={services}
      faqs={faqs}
      relatedLinks={relatedLinks}
    />
  );
}
