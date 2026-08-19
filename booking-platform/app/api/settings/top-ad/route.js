import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

async function getSettings() {
  try {
    const data = await fs.readFile(settingsPath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { 
      topAdVisible: true,
      textDesktop: "🎉 Exclusive Offer: First-time users get 10% OFF their booking!",
      textMobile: "🎉 10% OFF First Booking!"
    };
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ 
    isVisible: settings.topAdVisible,
    textDesktop: settings.textDesktop || "🎉 Exclusive Offer: First-time users get 10% OFF their booking!",
    textMobile: settings.textMobile || "🎉 10% OFF First Booking!"
  }, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const settings = await getSettings();
    
    if (body.hasOwnProperty('isVisible')) {
      settings.topAdVisible = !!body.isVisible;
    }
    if (body.hasOwnProperty('textDesktop')) {
      settings.textDesktop = body.textDesktop;
    }
    if (body.hasOwnProperty('textMobile')) {
      settings.textMobile = body.textMobile;
    }
    
    // Ensure dir exists
    await fs.mkdir(path.dirname(settingsPath), { recursive: true });
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      isVisible: settings.topAdVisible,
      textDesktop: settings.textDesktop,
      textMobile: settings.textMobile
    }, { headers: corsHeaders });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders });
  }
}
