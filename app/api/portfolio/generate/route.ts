import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Repository } from '@/lib/models/repository';
import { Octokit } from '@octokit/rest';

export async function POST(req: Request) {
  try {
    const { userId, step = 0, perPage = 10 } = await req.json();
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const octokit = new Octokit({ auth: user.githubAccessToken });

    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: perPage,
      page: step + 1,
    });

    const processedRepos = [];

    for (const repo of repos) {
      let existingRepo = await Repository.findOne({ userId, name: repo.name });
      let repoId;
      
      if (existingRepo) {
        await Repository.findByIdAndUpdate(existingRepo._id, {
          description: repo.description,
          url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          isPublic: !repo.private,
        });
        repoId = existingRepo._id;
      } else {
        const newRepo = new Repository({
          userId,
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          isPublic: !repo.private,
        });
        await newRepo.save();
        repoId = newRepo._id;
      }

      // Generate thumbnail
      const thumbnailResponse = await fetch('/api/thumbnail/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          repositoryId: repoId, 
          url: repo.homepage || repo.html_url 
        }),
      });

      if (!thumbnailResponse.ok) {
        console.error(`Failed to generate thumbnail for ${repo.name}`);
      }

      processedRepos.push(repoId);
    }

    const hasMore = repos.length === perPage;

    return NextResponse.json({ 
      success: true, 
      processedRepos,
      nextStep: hasMore ? step + 1 : null
    });
  } catch (error) {
    console.error('Portfolio generation error:', error);
    return NextResponse.json({ error: 'Failed to generate portfolio' }, { status: 500 });
  }
}
