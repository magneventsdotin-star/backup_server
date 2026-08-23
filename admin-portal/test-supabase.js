const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ecwaqfsjajeidhslybdi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjd2FxZnNqYWplaWRoc2x5YmRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjE3ODUyNiwiZXhwIjoyMDkxNzU0NTI2fQ.Pcanl1WQDZgXXXbpKdEqnK5xBQSBqFdWnegdVo9bV9Q'
);

async function test() {
  const { data: blogs, error: fetchError } = await supabase.from('blogs').select('*').limit(1);
  if (fetchError) {
    console.error('Fetch error:', fetchError);
    return;
  }
  if (!blogs || blogs.length === 0) {
    console.log('No blogs found');
    return;
  }
  const blog = blogs[0];
  console.log('Blog:', blog.id, 'is_published:', blog.is_published);
  
  const { data: updateData, error: updateError } = await supabase
    .from('blogs')
    .update({ is_published: !blog.is_published })
    .eq('id', blog.id)
    .select();
    
  console.log('Update result:', updateData, 'Error:', updateError);
}

test();
