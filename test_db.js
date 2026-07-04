require('dotenv').config({ path: './admin_dahsboard/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('artists').select('artist_no, name').limit(5);
  if (error) console.error(error);
  else console.log(data);
}
test();
