import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { octokit } from '@/lib/github';

export async function POST(req: Request) {
  try {
    const { username, verificationToken } = await req.json();

    if (!username || !verificationToken) {
      return NextResponse.json({ error: 'Username and verification token are required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the user has already been verified
    if (user.isVerified) {
      return NextResponse.json({ error: 'User is already verified' }, { status: 400 });
    }

    // Verify the token by checking a gist or repository
    try {
      const { data: gists } = await octokit.gists.list({ username });
      const verificationGist = gists.find(gist => 
        gist.description === 'Git2Site Verification'
      );

      if (verificationGist) {
        const { data: gistContent } = await octokit.gists.get({ gist_id: verificationGist.id });
        const files = gistContent.files;
        if (files) {
          const fileContent = Object.values(files)[0]?.content;
          if (fileContent === verificationToken) {
            user.isVerified = true;
            await user.save();
            return NextResponse.json({ success: true, message: 'User verified successfully' });
          }
        }
      }

      return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    } catch (error) {
      console.error('Error verifying user:', error);
      return NextResponse.json({ error: 'Verification process failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
