import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { getUserFromSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getUserFromSession(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userData = await User.findById(user._id).lean();
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await req.json();
    await connectDB();
    await User.findByIdAndUpdate(user._id, preferences);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving user preferences:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
