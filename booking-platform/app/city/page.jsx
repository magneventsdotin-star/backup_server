import { redirect } from 'next/navigation';

export default function CityIndexRedirect() {
  // If someone navigates to /city directly, redirect them to the home page 
  // where the massive list of all 200+ city cards is located.
  redirect('/');
}
