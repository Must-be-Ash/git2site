import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Repository } from '@/lib/models/repository';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    await connectDB();

    const user = await User.findOne({ username: session.username });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const repositories = await Repository.find({ userId: user._id });
    console.log('Fetched repositories:', repositories); // Debug log

    const projects = repositories.map(repo => {
      const project = {
        id: repo._id.toString(),
        name: repo.name,
        description: repo.description,
        languages: repo.languages || [], // Ensure languages are mapped
        githubUrl: repo.url,
        websiteUrl: repo.homepage,
        thumbnailUrl: repo.thumbnailUrl || `/api/thumbnail/generate?repo=${repo._id}`,
      };
      console.log('Mapped project:', project); // Debug log
      return project;
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
