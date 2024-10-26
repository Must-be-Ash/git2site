import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Repository } from '@/lib/models/repository';
import { generateThumbnail } from '@/lib/thumbnailService';
import puppeteer from 'puppeteer';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repoId = searchParams.get('repo');

  if (!repoId) {
    return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 });
  }

  try {
    await connectDB();
    const repository = await Repository.findById(repoId);

    if (!repository) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
    }

    if (!repository.thumbnailUrl) {
      const thumbnailUrl = await generateThumbnail(repository.url, repository.name);
      repository.thumbnailUrl = thumbnailUrl;
      await repository.save();
    }

    // Redirect to the actual thumbnail URL
    return NextResponse.redirect(repository.thumbnailUrl);
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
