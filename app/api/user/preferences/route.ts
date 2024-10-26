import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
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

    console.log('GET: User preferences retrieved:', JSON.stringify(user, null, 2));

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

    console.log('POST: Received data:', { theme, socialLinks, personalDomain, name, bio, avatar });

    await connectDB();
    const user = await User.findOneAndUpdate(
      { username: session.username },
      { 
        theme: {
          name: theme.name,
          buttonStyle: theme.buttonStyle,
          cardStyle: theme.cardStyle,
          fontFamily: theme.fontFamily,
          colors: theme.colors,
        },
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

    console.log('POST: Updated user:', JSON.stringify(user, null, 2));

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
