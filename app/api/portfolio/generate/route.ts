import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { getUserFromSession } from "@/lib/auth";
import { startPortfolioGeneration } from '@/lib/portfolioGenerator';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userData = await User.findById(user._id);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const jobId = await startPortfolioGeneration(userData);
    return NextResponse.json({ jobId, status: 'started' });
  } catch (error) {
    console.error('Portfolio generation error:', error);
    return NextResponse.json({ error: 'Failed to start portfolio generation' }, { status: 500 });
  }
}
