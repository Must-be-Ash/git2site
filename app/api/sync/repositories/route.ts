import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Repository } from '@/lib/models/repository';
import { fetchRepositoryDetails } from '@/lib/github';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, repositories } = await req.json();
    
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch detailed info for each repository including languages
    const repoDetails = await Promise.all(
      repositories.map(async (repo: any) => {
        const details = await fetchRepositoryDetails(
          repo.owner.login,
          repo.name,
          user.githubAccessToken
        );
        return {
          userId: user._id,
          name: details.name,
          description: details.description,
          url: details.url,
          homepage: details.homepage,
          languages: details.languages,  // Store the languages array
          stars: details.stars,
          forks: details.forks,
        };
      })
    );

    // Update or create repositories
    await Promise.all(
      repoDetails.map(async (repo) => {
        await Repository.findOneAndUpdate(
          { userId: user._id, name: repo.name },
          repo,
          { upsert: true, new: true }
        );
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing repositories:', error);
    return NextResponse.json(
      { error: 'Failed to sync repositories' },
      { status: 500 }
    );
  }
}
