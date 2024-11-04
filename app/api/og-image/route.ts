import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Try to find og:image
    let imageUrl = $('meta[property="og:image"]').attr('content');

    // If no og:image, try twitter:image
    if (!imageUrl) {
      imageUrl = $('meta[name="twitter:image"]').attr('content');
    }

    // If still no image, try first image on the page
    if (!imageUrl) {
      imageUrl = $('img').first().attr('src');
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error fetching og:image:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
} 