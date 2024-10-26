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
      console.error(`User not found for ID: ${userId}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log(`Fetching detailed profile for user: ${user.username}`);
    const profileData = await fetchUserProfile(user.username, user.githubAccessToken);

    console.log(`Updating user profile for: ${user.username}`);
    await User.findByIdAndUpdate(userId, {
      name: profileData.name,
      bio: profileData.bio,
      avatar: profileData.avatar,
      // Add any other fields you want to update
    });

    console.log(`Profile updated successfully for user: ${user.username}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}
