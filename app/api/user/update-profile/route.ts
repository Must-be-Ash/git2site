import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { fetchUserProfile } from "@/lib/github";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profileData = await fetchUserProfile(user.username, user.githubAccessToken);

    user.name = profileData.name;
    user.bio = profileData.bio;
    user.avatar = profileData.avatar;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}
