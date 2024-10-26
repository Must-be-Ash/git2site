import { NextResponse } from 'next/server';
import { fetchUserProfile, fetchUserRepositories } from '@/lib/github';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Repository } from '@/lib/models/repository';

export async function POST(req: Request) {
  console.log('Portfolio generation started');
  try {
    const { username } = await req.json();
    console.log(`Generating portfolio for username: ${username}`);
    
    if (!username) {
      console.log('Error: Username is required');
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    console.log('Connecting to database');
    await connectDB();
    console.log('Database connection established');

    // Check if user already exists
    let user = await User.findOne({ username });
    console.log(`User exists: ${!!user}`);

    if (user) {
      console.log('Checking if refresh is needed');
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (user.updatedAt > oneWeekAgo) {
        console.log('Using cached data');
        const repositories = await Repository.find({ userId: user._id });
        return NextResponse.json({
          success: true,
          username,
          profile: user,
          repositories,
        });
      }
    }

    console.log('Fetching user data from GitHub');
    // Fetch user data from GitHub
    try {
      const [userData, repositories] = await Promise.all([
        fetchUserProfile(username),
        fetchUserRepositories(username),
      ]);
      console.log('GitHub data fetched successfully');

      // Create or update user in the database
      if (!user) {
        console.log('Creating new user');
        user = new User({
          username,
          name: userData.name,
          bio: userData.bio,
          avatar: userData.avatar,
          theme: { id: 'light' }, // Default theme
        });
      } else {
        console.log('Updating existing user');
        user.name = userData.name;
        user.bio = userData.bio;
        user.avatar = userData.avatar;
      }
      await user.save();
      console.log('User saved');

      // Create or update repositories in the database
      console.log('Updating repositories');
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
      console.log('Repositories updated');

      console.log('Portfolio generation completed successfully');
      return NextResponse.json({
        success: true,
        username,
        profile: userData,
        repositories,
      });
    } catch (githubError) {
      console.error('Error fetching data from GitHub:', githubError);
      throw new Error(`Failed to fetch data from GitHub: ${githubError instanceof Error ? githubError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Portfolio generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate portfolio' },
      { status: 500 }
    );
  }
}
