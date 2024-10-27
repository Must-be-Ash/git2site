import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { Repository } from '@/lib/models/repository';
import { connectDB } from '@/lib/db';

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
  try {
    const { repositoryId, url } = await req.json();

    if (!repositoryId || !url) {
      return NextResponse.json({ error: 'Repository ID and URL are required' }, { status: 400 });
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

    // Save the thumbnail URL to the database
    await connectDB();
    await Repository.findByIdAndUpdate(repositoryId, {
      thumbnailUrl: `data:image/png;base64,${screenshot}`
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate thumbnail' }, 
      { status: 500 }
    );
  }
}
