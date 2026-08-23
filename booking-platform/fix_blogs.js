const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ecwaqfsjajeidhslybdi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjd2FxZnNqYWplaWRoc2x5YmRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE3ODUyNiwiZXhwIjoyMDkxNzU0NTI2fQ.Pcanl1WQDZgXXXbpKdEqnK5xBQSBqFdWnegdVo9bV9Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const validImages = [
  "https://picsum.photos/id/117/1000/600",
  "https://picsum.photos/id/118/1000/600",
  "https://picsum.photos/id/119/1000/600",
  "https://picsum.photos/id/145/1000/600",
  "https://picsum.photos/id/158/1000/600",
  "https://picsum.photos/id/163/1000/600",
  "https://picsum.photos/id/175/1000/600",
  "https://picsum.photos/id/201/1000/600",
  "https://picsum.photos/id/249/1000/600",
  "https://picsum.photos/id/250/1000/600"
];

async function fix() {
  console.log('Fixing blogs...');
  
  const { data, error } = await supabase.from('blogs').select('id');
  
  if (error) {
    console.error(error);
    return;
  }
  
  for (let i = 0; i < data.length; i++) {
    const blog = data[i];
    const { error: updateError } = await supabase.from('blogs').update({
      is_published: false,
      image_url: validImages[i % validImages.length]
    }).eq('id', blog.id);
    
    if (updateError) {
      console.error('Error updating:', blog.id, updateError);
    } else {
      console.log('Successfully fixed:', blog.id);
    }
  }
  
  console.log('Done fixing blogs!');
}

fix();
