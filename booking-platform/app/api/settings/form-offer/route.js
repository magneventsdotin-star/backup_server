import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only initialize if we have the keys, otherwise it fails at build time or when missing
const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  const defaultSettings = { 
    isVisible: true,
    textDesktop: "🎉 Exclusive Offer: First-time users get a special discount on their booking!",
    textMobile: "🎉 Special Discount on First Booking!"
  };

  if (!supabase) {
    return NextResponse.json(defaultSettings, { headers: corsHeaders });
  }

  try {
    const { data, error } = await supabase
      .from('top_ad_settings')
      .select('*')
      .eq('id', 2)
      .single();

    if (error || !data) {
      return NextResponse.json(defaultSettings, { headers: corsHeaders });
    }

    return NextResponse.json({
      isVisible: data.is_visible,
      textDesktop: data.text_desktop || defaultSettings.textDesktop,
      textMobile: data.text_mobile || defaultSettings.textMobile
    }, { headers: corsHeaders });
  } catch (err) {
    console.error('Error fetching top ad settings from Supabase:', err);
    return NextResponse.json(defaultSettings, { headers: corsHeaders });
  }
}

export async function POST(req) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // First fetch current to merge
    const { data: current, error: fetchErr } = await supabase
      .from('top_ad_settings')
      .select('*')
      .eq('id', 2)
      .single();

    const updateData = {};
    if (body.hasOwnProperty('isVisible')) updateData.is_visible = !!body.isVisible;
    if (body.hasOwnProperty('textDesktop')) updateData.text_desktop = body.textDesktop;
    if (body.hasOwnProperty('textMobile')) updateData.text_mobile = body.textMobile;

    let result;
    if (fetchErr || !current) {
      // Row doesn't exist, insert it
      updateData.id = 2;
      // Provide defaults for missing
      if (!updateData.hasOwnProperty('is_visible')) updateData.is_visible = true;
      if (!updateData.hasOwnProperty('text_desktop')) updateData.text_desktop = "🎉 Exclusive Offer: First-time users get a special discount on their booking!";
      if (!updateData.hasOwnProperty('text_mobile')) updateData.text_mobile = "🎉 Special Discount on First Booking!";
      
      result = await supabase.from('top_ad_settings').insert([updateData]).select().single();
    } else {
      // Update existing
      result = await supabase.from('top_ad_settings').update(updateData).eq('id', 2).select().single();
    }

    if (result.error) throw result.error;

    return NextResponse.json({ 
      success: true, 
      isVisible: result.data.is_visible,
      textDesktop: result.data.text_desktop,
      textMobile: result.data.text_mobile
    }, { headers: corsHeaders });

  } catch (e) {
    console.error('Error updating top ad settings in Supabase:', e);
    return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders });
  }
}
