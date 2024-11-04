import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForAccessToken, getGithubUser } from "@/lib/github";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";

// Add this export to mark the route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Get the actual host from the request
  const host = request.headers.get('host') || 'git2site.pro';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  try {
    console.log("=== GitHub Callback Process Started ===");
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      console.error("No code provided in callback");
      return NextResponse.redirect(`${baseUrl}/login?error=no_code`);
    }

    // Exchange code for access token
    let accessToken;
    try {
      accessToken = await exchangeCodeForAccessToken(code);
      console.log("Successfully obtained new access token");
    } catch (error) {
      console.error("Token exchange error:", error);
      return NextResponse.redirect(`${baseUrl}/login?error=token_exchange`);
    }

    // Get GitHub user data
    let githubUser;
    try {
      githubUser = await getGithubUser(accessToken);
      console.log("Successfully fetched GitHub user:", githubUser.login);
    } catch (error) {
      console.error("GitHub user fetch error:", error);
      return NextResponse.redirect(`${baseUrl}/login?error=github_user`);
    }

    // Connect to MongoDB
    try {
      await connectDB();
      console.log("Successfully connected to database");
    } catch (error) {
      console.error("Database connection error:", error);
      return NextResponse.redirect(`${baseUrl}/login?error=database`);
    }

    // Find or create user
    try {
      const user = await User.findOneAndUpdate(
        { githubId: githubUser.id },
        {
          githubId: githubUser.id,
          username: githubUser.login,
          name: githubUser.name || githubUser.login,
          email: githubUser.email,
          avatarUrl: githubUser.avatar_url,
          githubAccessToken: accessToken, // Store the new token
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      console.log("User updated with new token:", {
        userId: user._id,
        username: user.username,
        tokenUpdated: true
      });

      // Set cookies
      const cookieStore = cookies();
      cookieStore.set("userId", user._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      console.log("=== GitHub Callback Process Completed ===");
      return NextResponse.redirect(`${baseUrl}/dashboard`);
    } catch (error) {
      console.error("User update error:", error);
      return NextResponse.redirect(`${baseUrl}/login?error=user_creation`);
    }
  } catch (error) {
    console.error("=== GitHub Callback Process Failed ===", error);
    return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
  }
}
