import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForAccessToken, getGithubUser } from "@/lib/github";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";

// Add this export to mark the route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.git2site.pro'
    : 'http://localhost:3000'

  try {
    console.log("=== GitHub Callback Process Started ===");
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      console.error("No code provided in callback");
      return NextResponse.redirect(new URL("/login?error=no_code", request.url));
    }

    // Exchange code for access token
    let accessToken;
    try {
      accessToken = await exchangeCodeForAccessToken(code);
      console.log("Successfully obtained new access token");
    } catch (error) {
      console.error("Token exchange error:", error);
      return NextResponse.redirect(new URL("/login?error=token_exchange", request.url));
    }

    // Get GitHub user data
    let githubUser;
    try {
      githubUser = await getGithubUser(accessToken);
      console.log("Successfully fetched GitHub user:", githubUser.login);
    } catch (error) {
      console.error("GitHub user fetch error:", error);
      return NextResponse.redirect(new URL("/login?error=github_user", request.url));
    }

    // Connect to MongoDB
    try {
      await connectDB();
      console.log("Successfully connected to database");
    } catch (error) {
      console.error("Database connection error:", error);
      return NextResponse.redirect(new URL("/login?error=database", request.url));
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
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      console.error("User update error:", error);
      return NextResponse.redirect(new URL("/login?error=user_creation", request.url));
    }
  } catch (error) {
    console.error("=== GitHub Callback Process Failed ===", error);
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
  }
}
