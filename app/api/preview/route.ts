import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import type { Browser, Page } from 'puppeteer-core';
import puppeteer from 'puppeteer-core';

const getBrowser = async () => {
  // Local development
  if (process.env.NODE_ENV !== 'production') {
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
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--ignore-certificate-errors'
    ],
    defaultViewport: {
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
    },
    executablePath: await (async () => {
      const execPath = await chromium.executablePath();
      return execPath || '/opt/chromium/chrome';
    })(),
    headless: true
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
    
    if (!browser) {
      throw new Error('Failed to launch browser');
    }

    page = await browser.newPage();
    
    // Set a default background color
    await page.evaluateHandle('document.documentElement.style.background = "white"');
    
    console.log('Navigating to page...');
    await page.goto(url, {
      waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
      timeout: 30000,
    });

    // Add a small delay to ensure everything is rendered
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Taking screenshot...');
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      encoding: 'base64',
      fullPage: false,
      captureBeyondViewport: false,
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
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.error('Error closing page:', e);
      }
    }
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Error closing browser:', e);
      }
    }
  }
}
