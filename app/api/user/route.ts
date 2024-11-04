import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log("=== User Data Request Started ===");
  try {
    console.log("Attempting to get authenticated user...");
    const user = await getAuthenticatedUser(request);
    
    console.log("Cookies present:", {
      token: request.cookies.get('token')?.value ? 'present' : 'missing',
      userId: request.cookies.get('userId')?.value ? 'present' : 'missing'
    });

    if (!user) {
      console.log("Authentication failed: No user found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    console.log("User authenticated successfully:", {
      userId: user._id,
      username: user.username
    });

    // Return user data without sensitive information
    const userData = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };

    console.log("Returning user data:", userData);
    console.log("=== User Data Request Completed ===");
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error("=== User Data Request Failed ===");
    console.error("Error details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
