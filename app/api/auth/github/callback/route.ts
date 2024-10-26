import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { fetchUserProfile, fetchUserRepositories } from "@/lib/github";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("GitHub OAuth error:", tokenData.error);
      return NextResponse.redirect(new URL("/login?error=invalid_code", request.url));
    }

    const accessToken = tokenData.access_token;

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      console.error("GitHub API error:", await userResponse.text());
      return NextResponse.redirect(new URL("/login?error=github_api_error", request.url));
    }

    const userData = await userResponse.json();

    // Generate or update portfolio
    await connectDB();
    let user = await User.findOne({ username: userData.login });
    
    const [profileData, repositories] = await Promise.all([
      fetchUserProfile(userData.login, accessToken),
      fetchUserRepositories(userData.login, accessToken),
    ]);

    if (!user) {
      user = new User({
        username: userData.login,
        name: profileData.name,
        bio: profileData.bio,
        avatar: profileData.avatar,
        isVerified: true,
        githubAccessToken: accessToken,
      });
    } else {
      user.name = profileData.name;
      user.bio = profileData.bio;
      user.avatar = profileData.avatar;
      user.isVerified = true;
      user.githubAccessToken = accessToken;
    }
    await user.save();

    // Update repositories
    // (Implement this part to save repositories to the database)

    // Set session cookie
    cookies().set("session", JSON.stringify({
      userId: user._id,
      username: user.username,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.redirect(new URL(`/${userData.login}`, request.url));
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(new URL("/login?error=server_error", request.url));
  }
}
