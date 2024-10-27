import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log("User data request received");
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      console.log("No authenticated user found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Return user data without sensitive information
    return NextResponse.json({
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
