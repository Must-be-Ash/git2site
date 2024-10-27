import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'base64'
    });

    await browser.close();

    return NextResponse.json({ 
      preview: `data:image/png;base64,${screenshot}` 
    });

  } catch (error) {
    console.error('Preview generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' }, 
      { status: 500 }
    );
  }
}
