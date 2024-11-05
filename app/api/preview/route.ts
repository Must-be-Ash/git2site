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

  // Production - Vercel serverless environment
  return puppeteer.launch({
    args: [
      ...chromium.args,
      '--hide-scrollbars',
      '--disable-web-security',
      '--font-render-hinting=none'
    ],
    defaultViewport: {
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
    },
    executablePath: await chromium.executablePath(),
    headless: true as boolean,
  });
};

export async function POST(req: Request) {
  let browser: Browser | null = null;
  let page: Page | null = null;
  
  try {
    console.log('Starting preview generation...');
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('Launching browser for URL:', url);
    browser = await getBrowser();
    page = await browser.newPage();
    
    // Set a default background color
    await page.evaluateHandle('document.documentElement.style.background = "white"');
    
    console.log('Navigating to page...');
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for network to be idle to ensure all content is loaded
    await page.waitForNetworkIdle({ timeout: 5000 });

    console.log('Taking screenshot...');
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      encoding: 'base64',
      fullPage: false,
    });

    console.log('Preview generation successful');
    return NextResponse.json({
      preview: `data:image/jpeg;base64,${screenshot}`
    });

  } catch (error: unknown) {
    console.error('Preview generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to generate preview', details: errorMessage },
      { status: 500 }
    );
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}
