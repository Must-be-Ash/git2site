import { NextResponse } from 'next/server';
import { fetchUserProfile, fetchUserRepositories } from '@/lib/github';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Repository } from '@/lib/models/repository';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch user data from GitHub
    const [userData, repositories] = await Promise.all([
      fetchUserProfile(username),
      fetchUserRepositories(username),
    ]);

    // Create or update user in the database
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({
        username,
        name: userData.name,
        bio: userData.bio,
        avatar: userData.avatar,
        theme: { id: 'light' }, // Default theme
      });
    } else {
      user.name = userData.name;
      user.bio = userData.bio;
      user.avatar = userData.avatar;
    }
    await user.save();

    // Create or update repositories in the database
    const repoPromises = repositories.map(async (repo) => {
      const existingRepo = await Repository.findOne({ userId: user._id, name: repo.name });
      if (existingRepo) {
        Object.assign(existingRepo, repo);
        return existingRepo.save();
      } else {
        return Repository.create({ ...repo, userId: user._id });
      }
    });
    await Promise.all(repoPromises);

    return NextResponse.json({
      success: true,
      username,
      profile: userData,
      repositories,
    });
  } catch (error) {
    console.error('Portfolio generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate portfolio' },
      { status: 500 }
    );
  }
}
