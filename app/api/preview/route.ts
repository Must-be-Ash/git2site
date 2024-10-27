import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Create new page
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });

    // Navigate to URL
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      encoding: 'base64'
    });

    // Close browser
    await browser.close();

    // Return the screenshot as base64
    return NextResponse.json({
      preview: `data:image/jpeg;base64,${screenshot}`
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}
