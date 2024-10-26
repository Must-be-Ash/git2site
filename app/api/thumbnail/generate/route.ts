import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Repository } from '@/lib/models/repository';
import { generateThumbnail } from '@/lib/thumbnailService';

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
