import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { startPortfolioGeneration } from '@/lib/portfolioGenerator';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await startPortfolioGeneration(user._id);
    return NextResponse.json({ message: 'Portfolio generation started' });
  } catch (error) {
    console.error('Error starting portfolio generation:', error);
    return NextResponse.json({ error: 'Failed to start portfolio generation' }, { status: 500 });
  }
}
