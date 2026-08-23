'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function toggleBlogPublishStatus(id: string, newStatus: boolean) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured. Missing Service Role Key.');
  }

  const { data, error } = await supabaseAdmin
    .from('blogs')
    .update({ is_published: newStatus })
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, data };
}

export async function deleteBlogPostAction(id: string) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured. Missing Service Role Key.');
  }

  const { error } = await supabaseAdmin
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
