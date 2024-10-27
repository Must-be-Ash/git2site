import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { Portfolio } from '@/types/portfolio';
import { PortfolioService } from '@/lib/models/portfolio';
import { connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const portfolio = await PortfolioService.findOne({ userId: user._id.toString() });
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // Calculate progress
    const totalSections = Object.keys(portfolio.sections).length;
    const completedSections = Object.values(portfolio.sections).filter(section => section.status === 'completed').length;
    const progress = Math.round((completedSections / totalSections) * 100);

    return NextResponse.json({
      status: portfolio.status,
      sections: portfolio.sections,
      progress,
      data: portfolio // Include the full portfolio data
    });
  } catch (error) {
    console.error('Error fetching portfolio status:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio status' }, { status: 500 });
  }
}
