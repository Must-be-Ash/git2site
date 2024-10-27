import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://www.git2site.pro'
      : 'http://localhost:3000';

    const url = `${baseUrl}/${user.username}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating share URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate share URL' },
      { status: 500 }
    );
  }
}
