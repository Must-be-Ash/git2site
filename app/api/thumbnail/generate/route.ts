import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import type { Browser, Page } from 'puppeteer-core';
import puppeteer from 'puppeteer-core';
import { Repository } from '@/lib/models/repository';
import { connectDB } from '@/lib/db';

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repoId = searchParams.get('repo');

  if (!repoId) {
    return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 });
  }

  try {
    await connectDB();
    const repository = await Repository.findById(repoId);
    if (!repository || !repository.websiteUrl) {
      return NextResponse.json({ error: 'Repository or website URL not found' }, { status: 404 });
    }

    // Generate thumbnail using puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    await page.goto(repository.websiteUrl);
    const screenshot = await page.screenshot({ type: 'png' });
    await browser.close();

    // Update repository with thumbnail
    repository.thumbnailUrl = `data:image/png;base64,${Buffer.from(screenshot).toString('base64')}`;
    await repository.save();

    return new NextResponse(screenshot, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return NextResponse.json({ error: 'Failed to generate thumbnail' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    const { url, width = 1200, height = 630 } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    browser = await getBrowser();
    page = await browser.newPage();

    await page.setViewport({
      width: Number(width),
      height: Number(height),
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
      thumbnail: `data:image/png;base64,${screenshot}`
    });

  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate thumbnail' },
      { status: 500 }
    );
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
}
