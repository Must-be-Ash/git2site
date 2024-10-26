import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { cookies } from 'next/headers';

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

    return NextResponse.json({ 
      theme: user.theme, 
      username: user.username,
      socialLinks: user.socialLinks,
      personalDomain: user.personalDomain,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const { theme, socialLinks, personalDomain, name, bio, avatar } = await req.json();

    await connectDB();
    const user = await User.findOneAndUpdate(
      { username: session.username },
      { 
        theme,
        socialLinks,
        personalDomain,
        name,
        bio,
        avatar,
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      theme: user.theme, 
      socialLinks: user.socialLinks, 
      personalDomain: user.personalDomain,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
