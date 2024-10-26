import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Repository } from '@/lib/models/repository';
import { Octokit } from '@octokit/rest';

export async function POST(req: Request) {
  console.log("Portfolio generation step initiated");
  try {
    const { userId, step = 0, perPage = 10 } = await req.json();
    console.log(`Processing step ${step} for user ${userId}`);

    console.log("Connecting to database");
    await connectDB();

    console.log("Fetching user");
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log("Initializing GitHub API client");
    const octokit = new Octokit({ auth: user.githubAccessToken });

    console.log(`Fetching repositories (page ${step + 1}, per_page ${perPage})`);
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: perPage,
      page: step + 1,
    });

    console.log(`Fetched ${repos.length} repositories`);

    const processedRepos = [];

    for (const repo of repos) {
      console.log(`Processing repository: ${repo.name}`);
      let existingRepo = await Repository.findOne({ userId, name: repo.name });
      let repoId;
      
      if (existingRepo) {
        console.log(`Updating existing repository: ${repo.name}`);
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
        console.log(`Creating new repository: ${repo.name}`);
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

      console.log(`Generating thumbnail for ${repo.name}`);
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
      } else {
        console.log(`Thumbnail generated for ${repo.name}`);
      }

      processedRepos.push(repoId);
    }

    const hasMore = repos.length === perPage;
    console.log(`Step ${step} completed. Processed ${processedRepos.length} repositories. Has more: ${hasMore}`);

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
