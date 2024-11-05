import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import type { Browser, Page } from 'puppeteer-core';
import puppeteer from 'puppeteer-core';

const getBrowser = async () => {
  // Local development
  if (process.env.NODE_ENV === 'development') {
    return puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
  }
  // Production - use chromium
  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
};

export async function POST(req: Request) {
  let browser: Browser | null = null;
  let page: Page | null = null;
  
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    browser = await getBrowser();
    page = await browser.newPage();
    
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
    });

    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'base64'
    });

    return NextResponse.json({
      preview: `data:image/png;base64,${screenshot}`
    });

  } catch (error) {
    console.error('Preview generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}
