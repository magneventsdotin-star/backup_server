import { supabase } from '@database/connection/supabase';
import { findArtistBySlugOrId } from '@/app/utils/artistLookup';

export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const { id } = awaitedParams;
  
  const data = await findArtistBySlugOrId(supabase, id, 'name, alias, bio, artist_images(image_url)');

  const name = data?.alias || data?.name || 'Live Artist';
  const description = data?.bio ? data.bio.substring(0, 160) : `Book ${name} for your next event. Hire premium live entertainment and musicians for weddings, corporate events, and private parties via Magnevents.`;
  const image = data?.artist_images?.[0]?.image_url || '/icon-512.png';

  return {
    title: `${name} | Book Live Singer | Magnevents`,
    description,
    alternates: {
      canonical: `/artist/${id}`,
    },
    openGraph: {
      title: `${name} | Book Live Singer | Magnevents`,
      description,
      images: [image],
      url: `/artist/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | Book Live Singer | Magnevents`,
      description,
      images: [image],
    }
  };
}

export default async function ArtistLayout({ children, params }) {
  const awaitedParams = await params;
  const { id } = awaitedParams;
  
  const data = await findArtistBySlugOrId(supabase, id, 'name, alias, bio, artist_images(image_url), category, city, rating, successful_bookings');
  const name = data?.alias || data?.name || 'Live Artist';
  const image = data?.artist_images?.[0]?.image_url || '/icon-512.png';
  const bio = data?.bio || `Hire ${name}, a professional ${data?.category || 'artist'} from ${data?.city || 'India'} for your next event.`;

  const rating = Number(data?.rating) || 4.5;
  const reviewCount = Number(data?.successful_bookings) || 10;
  const hasReviews = (data?.successful_bookings && Number(data.successful_bookings) > 0) || (data?.rating && Number(data.rating) > 0);

  const schema = {
    "@context": "https://schema.org",
    "@type": ["Person", "PerformingGroup", "EntertainmentBusiness"],
    "name": name,
    "description": bio,
    "image": image,
    "jobTitle": data?.category || "Live Performer",
    "url": `https://www.magnevents.in/artist/${id}`,
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": data?.city || "Delhi NCR",
      "addressCountry": "IN"
    },
    "areaServed": data?.city || "India",
    ...(hasReviews ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.toFixed(1),
        "reviewCount": reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    } : {})
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
