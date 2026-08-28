import { redirect } from 'next/navigation';

export default function CityBlogListingRedirect({ params }) {
  // Redirect /city/mumbai/blog back to /city/mumbai
  // since the city landing page already serves as the blog listing page
  redirect(`/city/${params.city_slug}`);
}
