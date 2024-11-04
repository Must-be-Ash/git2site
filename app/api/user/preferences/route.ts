import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User, UserDocument } from '@/lib/models/user';
import { getAuthenticatedUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  console.log("=== Getting User Preferences ===");
  const user = await getAuthenticatedUser(req);
  if (!user) {
    console.log("No authenticated user found");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const userData = await User.findById(user._id).lean() as UserDocument;
  
  if (!userData) {
    console.log("User data not found");
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  console.log("Retrieved user preferences:", {
    userId: userData._id.toString(),
    selectedRepos: userData.selectedRepositories?.length || 0
  });

  return NextResponse.json(userData);
}

export async function POST(req: NextRequest) {
  console.log("=== Saving User Preferences ===");
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      console.log("No authenticated user found");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await req.json();
    console.log("Received preferences data:", {
      theme: preferences.theme?.name,
      selectedRepos: preferences.selectedRepositories?.map((r: any) => r.name)
    });

    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          theme: preferences.theme,
          socialLinks: preferences.socialLinks,
          personalDomain: preferences.personalDomain,
          name: preferences.profile.name,
          bio: preferences.profile.bio,
          avatar: preferences.profile.avatarUrl,
          selectedRepositories: preferences.selectedRepositories
        }
      },
      { new: true }
    ) as UserDocument;

    if (!updatedUser) {
      console.log("Failed to update user preferences");
      return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
    }

    console.log("Successfully updated user preferences:", {
      userId: updatedUser._id.toString(),
      selectedRepos: updatedUser.selectedRepositories?.length || 0
    });

    return NextResponse.json({ 
      success: true, 
      message: "Preferences saved successfully",
      selectedRepos: updatedUser.selectedRepositories?.length || 0
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
  }
}
