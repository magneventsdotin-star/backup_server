const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ecwaqfsjajeidhslybdi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjd2FxZnNqYWplaWRoc2x5YmRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE3ODUyNiwiZXhwIjoyMDkxNzU0NTI2fQ.Pcanl1WQDZgXXXbpKdEqnK5xBQSBqFdWnegdVo9bV9Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const blogs = [
  {
    title: "How to Choose the Perfect Live Singer for Your House Party in Delhi NCR",
    subtitle: "Expert Guide for House Parties",
    image_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop",
    slug: "choose-perfect-live-singer-house-party-delhi-ncr",
    is_published: true,
    content: `
Hosting a house party in Delhi NCR and want to elevate the vibe? Booking a live singer is the ultimate way to create an unforgettable experience for your guests. Whether it's a birthday bash, a cozy winter get-together, or an anniversary dinner, live music brings a unique energy that a Spotify playlist simply cannot match.

### 1. Understand Your Audience
Before you book an artist on **Magnevents**, consider the demographic of your guests. Do they enjoy retro Bollywood classics, soulful Sufi tracks, acoustic indie pop, or high-energy Punjabi numbers? 

### 2. Assess Your Space and Acoustics
A live band might be too loud for a small living room, but an acoustic solo singer or a duo with a cajon can fit perfectly into intimate spaces. Magnevents provides artists who bring their own compact, professional sound setups optimized for house parties, ensuring crisp sound without overwhelming your neighbors.

### 3. Plan the Flow of the Event
A great performer knows how to read the room. Typically, artists start with slow, ambient tracks as guests arrive and mingle, gradually increasing the tempo as the night progresses. Discuss the setlist and flow with your chosen artist beforehand.

### 4. Book Early Through Magnevents
The best artists in Delhi, Gurgaon, and Noida are booked weeks in advance, especially during the festive season. With Magnevents, you can browse verified artists, watch their performance videos, and book them instantly with transparent pricing and no hidden fees.

Make your next house party the talk of the town. Explore our roster of talented live singers today!
    `
  },
  {
    title: "Top 5 Reasons to Hire a Live Band for Your Wedding Reception",
    subtitle: "Wedding Entertainment Tips",
    image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    slug: "reasons-to-hire-live-band-wedding-reception",
    is_published: true,
    content: `
Your wedding reception is the grand finale of your celebrations, and the entertainment you choose dictates the mood of the entire evening. While a DJ is a classic choice, hiring a live band through **Magnevents** offers a dynamic and luxurious touch that will leave your guests mesmerized.

### 1. Unmatched Interactive Energy
A live band doesn't just play music; they perform. The lead singer interacts with the crowd, encourages sing-alongs, and adapts to the energy of the dance floor in real-time. This level of crowd engagement is unparalleled.

### 2. A Premium, Luxurious Feel
There is something inherently elegant about live instrumentation. The visual appeal of a drummer, guitarist, and vocalist performing live adds a concert-like, premium aesthetic to your stage setup.

### 3. Customizable Setlists
When you book through Magnevents, you can communicate directly with the band to curate a setlist that reflects your personal journey. Want a special acoustic rendition of your favorite song for your first dance? A live band can make that happen seamlessly.

### 4. Cross-Generational Appeal
A great wedding band seamlessly transitions from golden era classics for the older guests to contemporary chart-toppers for the younger crowd, ensuring everyone hits the dance floor.

### 5. Professional Setup and Sound
Magnevents ensures that the bands come equipped with professional sound engineers and top-tier equipment, guaranteeing flawless audio quality throughout your event.

Don't settle for ordinary. Elevate your big day with a spectacular live band!
    `
  },
  {
    title: "Corporate Event Entertainment: Why Live Music is a Game Changer",
    subtitle: "Corporate Event Planning",
    image_url: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?q=80&w=1000&auto=format&fit=crop",
    slug: "corporate-event-entertainment-live-music",
    is_published: true,
    content: `
Corporate events often suffer from a reputation of being stiff and monotonous. Whether it's an annual gala, a product launch, or a year-end party, breaking the ice and keeping employees or clients engaged is crucial. Enter live music.

### Setting the Right Tone
An instrumental jazz trio or a soulful solo acoustic artist can provide the perfect background ambiance during networking sessions or gala dinners. It fills the awkward silences and gives the event a sophisticated edge.

### Boosting Morale and Engagement
For year-end parties or success celebrations, a high-energy live band performing popular hits acts as the ultimate stress-reliever. It encourages employees to let their hair down and bond outside of the office environment.

### Brand Image
Hosting an event with high-quality live entertainment reflects positively on your company. It shows that you value your team and clients enough to invest in premium experiences. 

### Why Choose Magnevents for Corporate Bookings?
At **Magnevents**, we understand the professionalism required for corporate gigs. Our artists are punctual, professionally dressed, and experts at reading a corporate crowd. Plus, our transparent pricing and invoice management make the booking process seamless for your finance team.
    `
  },
  {
    title: "Sufi Singers for Corporate Events: Adding Soul to Your Evening",
    subtitle: "Genre Spotlight",
    image_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
    slug: "sufi-singers-corporate-events-delhi",
    is_published: true,
    content: `
Sufi music has an unparalleled ability to touch the soul and create an atmosphere of profound depth and joy. In recent years, Sufi nights have become incredibly popular for both corporate gatherings and private weddings.

### The Magic of Sufi
With its roots in mystical poetry, Sufi music performed live creates a mesmerizing trance. Artists singing tracks by Nusrat Fateh Ali Khan or modern Bollywood Sufi hits bring a sense of grandeur and emotional connection to the event.

### Perfect for Gala Dinners
If you are hosting a formal sit-down dinner or an awards night, a Sufi artist provides powerful, captivating entertainment without turning the event into a loud club scene. 

### Finding the Right Sufi Artist
Booking an authentic Sufi performer can be challenging. **Magnevents** features a curated list of exceptional Sufi vocalists and bands across Delhi NCR, Mumbai, and Bangalore. You can watch their live performance videos on our platform to ensure their voice and vibe match your vision.

Add a touch of musical divinity to your next event with our premium Sufi artists.
    `
  },
  {
    title: "How Much Does it Cost to Book a Live Singer in India?",
    subtitle: "Pricing & Budgeting",
    image_url: "https://images.unsplash.com/photo-1520625907470-349079a4ec21?q=80&w=1000&auto=format&fit=crop",
    slug: "cost-to-book-live-singer-india",
    is_published: true,
    content: `
One of the most common questions we get at **Magnevents** is regarding the budget for hiring live entertainment. The truth is, the cost varies significantly based on several factors. Let's break it down.

### Factors Influencing Artist Fees
1. **Experience and Popularity**: A budding indie artist playing at cafes might charge between ₹10,000 to ₹25,000. A seasoned professional with reality TV appearances or a strong YouTube presence can range from ₹50,000 to ₹1,50,000+. Celebrity singers cost significantly more.
2. **Band Size**: A solo singer with a backing track is the most budget-friendly. Adding a guitarist, keyboardist, or a full 5-piece band increases the cost proportionally due to the number of musicians involved.
3. **Event Duration**: Standard sets are usually 90 to 120 minutes. Longer performances or multiple sets will incur additional charges.
4. **Sound and Equipment**: Does the artist bring their own PA system, or do you need to rent sound equipment? (Magnevents offers end-to-end sound solutions!).

### The Magnevents Transparency Promise
Traditionally, event planners add massive hidden markups to artist fees. **Magnevents** disrupts this by offering transparent, upfront pricing. The price you see is the price you pay, ensuring you get the best talent within your budget.

Explore artists by budget filters on our platform today!
    `
  },
  {
    title: "Acoustic vs. Full Band: What's Right for Your Event?",
    subtitle: "Event Planning Guide",
    image_url: "https://images.unsplash.com/photo-1460723237483-2092109400db?q=80&w=1000&auto=format&fit=crop",
    slug: "acoustic-vs-full-band-right-for-your-event",
    is_published: true,
    content: `
Choosing between an acoustic solo/duo and a full live band is a critical decision that impacts the vibe, logistics, and budget of your event.

### The Case for Acoustic Artists
**Best for**: House parties, intimate gatherings, cocktail hours, and small corporate dinners.
Acoustic artists bring a raw, intimate, and soulful energy. They don't take up much physical space and their sound levels are highly manageable. They are perfect for events where you want guests to be able to converse easily while enjoying great background music.

### The Case for a Full Live Band
**Best for**: Wedding receptions, sangeets, large corporate galas, and college fests.
If your goal is to get 100+ people dancing and jumping, you need the heavy bass and rhythmic drive of a full band. The visual impact of a drum kit, electric guitars, and multiple vocalists on a stage commands attention and dictates the energy of the room.

### Make the Right Choice with Magnevents
Still unsure? The experts at **Magnevents** can consult with you, analyze your venue size, guest count, and desired atmosphere, and recommend the perfect setup for your special day.
    `
  },
  {
    title: "The Rise of Bollywood Unplugged for Weddings",
    subtitle: "Music Trends",
    image_url: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5287e?q=80&w=1000&auto=format&fit=crop",
    slug: "rise-of-bollywood-unplugged-weddings",
    is_published: true,
    content: `
Gone are the days when wedding music meant only heavy dhol beats or blaring DJ tracks. A massive trend sweeping the Indian wedding scene is **Bollywood Unplugged**.

### What is Bollywood Unplugged?
It involves artists performing stripped-down, acoustic, or semi-acoustic renditions of popular Bollywood songs. Think acoustic guitars, a cajon or tabla, and soulful vocals reimagining fast-paced tracks into beautiful melodies.

### Why It Works
This genre is incredibly versatile. It is the perfect accompaniment for a sundowner Mehndi, a sophisticated Cocktail evening, or the emotional backdrop for the Bridal Entry. It offers a blend of nostalgia and modern musicality that appeals to both the older generation and young friends.

### Book Unplugged Artists
At **Magnevents**, we host some of the finest Bollywood Unplugged artists in the country. Their ability to mashup classic Kishore Kumar melodies with modern Arijit Singh hits will leave your wedding guests spellbound.
    `
  },
  {
    title: "5 Things to Ask Before Booking a Live Performer",
    subtitle: "Booking Tips",
    image_url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1000&auto=format&fit=crop",
    slug: "5-things-to-ask-before-booking-live-performer",
    is_published: true,
    content: `
Booking a live singer or band is exciting, but to ensure a flawless event, you need to iron out the technical and logistical details. Here are 5 critical questions to ask:

1. **What are your technical requirements (Tech Rider)?** 
   Do they need specific microphones, monitors, or a drum kit?
2. **How much space do you need?** 
   Ensure your venue stage or designated performance area can comfortably accommodate the artists and their gear.
3. **What is your break schedule?** 
   Bands usually take a 15-20 minute break during a long set. Plan the event flow (like speeches or cake cutting) around this break.
4. **Do you take song requests?** 
   Some artists love interacting and taking live requests, while others prefer sticking to their rehearsed, high-impact setlist.
5. **Who provides the PA system?**
   Clarify if the artist brings their own sound, or if you need to hire a local sound vendor.

*Pro Tip*: When you book through **Magnevents**, our dedicated event managers handle all these technical logistics for you, ensuring a completely stress-free experience!
    `
  },
  {
    title: "How Live Entertainment Transforms Restaurant Ambience",
    subtitle: "Hospitality Insights",
    image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop",
    slug: "how-live-entertainment-transforms-restaurant-ambience",
    is_published: true,
    content: `
In the fiercely competitive hospitality industry, great food is no longer enough to guarantee repeat footfall. Diners are looking for 'experiences', and live music is the most effective way to elevate the dining atmosphere.

### Increased Dwell Time
Live music encourages guests to linger. They order that extra cocktail or stay for dessert because they want to hear the end of the artist's set. This directly boosts the average table spend.

### Distinct Brand Identity
A jazz brunch on Sundays, an acoustic indie night on Wednesdays, or a high-energy Bollywood band on Saturdays—curating specific music genres helps define your restaurant's brand and attracts targeted demographics.

### Social Media Amplification
Diners are highly likely to record and share a great live performance on Instagram, providing free, authentic marketing for your venue.

**Magnevents** partners with cafes, lounges, and luxury hotels to provide a steady, reliable roster of vetted musicians, ensuring your weekend programming is always a hit.
    `
  },
  {
    title: "Magnevents: Revolutionizing Artist Booking in India",
    subtitle: "Company News",
    image_url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1000&auto=format&fit=crop",
    slug: "magnevents-revolutionizing-artist-booking-india",
    is_published: true,
    content: `
The live entertainment booking industry in India has historically been fragmented, opaque, and driven by middle-men. Finding a good artist meant relying on word-of-mouth, haggling over prices, and hoping the artist actually turns up with good sound equipment.

**Magnevents** was built to change this. 

### Transparent Booking
We brought the booking process online. Browse hundreds of verified artists, watch their high-quality performance videos, and see upfront pricing. No hidden fees, no unnecessary markups.

### Quality Assurance
Every artist on the Magnevents platform is vetted for performance quality, professionalism, and reliability. We only work with the best, so you don't have to worry about the outcome of your event.

### End-to-End Solutions
We don't just connect you with an artist; we ensure the performance is a success. From handling technical sound riders to providing on-ground support, we manage the entire entertainment vertical for your event.

Discover the future of live entertainment booking. Discover Magnevents.
    `
  }
];

async function seed() {
  console.log('Seeding blogs...');
  
  for (const blog of blogs) {
    const { error } = await supabase.from('blogs').upsert(blog, { onConflict: 'slug' });
    if (error) {
      console.error('Error inserting blog:', blog.title, error);
    } else {
      console.log('Successfully inserted:', blog.title);
    }
  }
  
  console.log('Done seeding 10 blogs!');
}

seed();
