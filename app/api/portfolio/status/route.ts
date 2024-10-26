import { NextResponse } from 'next/server';
import { getUserFromSession } from "@/lib/auth";
import { getPortfolioGenerationStatus } from '@/lib/portfolioGenerator';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getUserFromSession(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const status = await getPortfolioGenerationStatus(jobId);
    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching portfolio generation status:', error);
    return NextResponse.json({ error: 'Failed to fetch generation status' }, { status: 500 });
  }
}
