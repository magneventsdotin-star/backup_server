import { NextResponse } from 'next/server';
import { supabase } from '@database/connection/supabase-admin';

const blogTopics = [
  "Best Singers in {city} for Weddings",
  "Book a Singer in {city} for Birthday Parties",
  "Live Singer for Corporate Events in {city}",
  "Female Singer in {city}",
  "Punjabi Singer in {city}",
  "Bollywood Singer in {city}",
  "Budget Singer in {city}",
  "Celebrity Singer Booking in {city}",
  "Wedding Reception Singer in {city}",
  "Sufi Singer in {city}",
  "Ghazal Singer in {city}",
  "Singer for College Fest in {city}",
  "Anniversary Singer in {city}",
  "Singer for House Party in {city}",
  "Acoustic Singer in {city}",
  "Live Band vs Solo Singer in {city}",
  "Top Event Singers in {city}",
  "Singer Booking Price in {city}",
  "How to Book a Singer in {city}",
  "Best Live Music Entertainment in {city}"
];

export async function POST(request: Request) {
  try {
    const { cityId, count = 10 } = await request.json();

    if (!cityId) {
      return NextResponse.json({ error: 'cityId is required' }, { status: 400 });
    }

    const { data: city, error: cityError } = await (supabase.from('seo_cities') as any)
      .select('*')
      .eq('id', cityId)
      .single();

    if (cityError || !city) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    // Pick 'count' random topics
    const shuffledTopics = blogTopics.sort(() => 0.5 - Math.random());
    const selectedTopics = shuffledTopics.slice(0, count);

    const generatedBlogs = selectedTopics.map((template) => {
      const title = template.replace(/{city}/g, city.name);
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const content = `
        <h1>${title}</h1>
        <p>Are you looking for the ${title.toLowerCase()}? You have come to the right place. At Book Singer, we provide the best musical talent in ${city.name} for your events.</p>
        <h2>Why Hire a Singer in ${city.name}?</h2>
        <p>${city.name} is a hub of celebrations and events. Having a live singer can elevate your event to the next level...</p>
        <h2>How to Book?</h2>
        <p>Booking is simple. Browse our platform, select your preferred artist, and send a request!</p>
      `;

      return {
        city_id: city.id,
        title,
        slug,
        seo_title: `${title} | Book Singer in ${city.name}`,
        meta_description: `Looking to ${title.toLowerCase()}? Find and book the best live singers in ${city.name} for weddings, corporate events, and parties.`,
        content,
        featured_image_prompt: `A professional singer performing live on stage at an event in ${city.name}, vibrant lighting, high quality, 4k`,
        status: 'draft',
        seo_score: Math.floor(Math.random() * (100 - 80 + 1) + 80),
      };
    });

    const { error: insertError } = await (supabase.from('seo_blogs') as any).upsert(generatedBlogs, { onConflict: 'city_id, slug' });

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: 'Failed to insert blogs into database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: generatedBlogs.length });
  } catch (error: any) {
    console.error('Error generating blogs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
