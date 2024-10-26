import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { fetchUserProfile, fetchUserRepositories } from "@/lib/github";
import { SignJWT } from "jose";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    console.error("Missing code in GitHub callback");
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
      return NextResponse.redirect(new URL(`/login?error=${tokenData.error}`, request.url));
    }

    const accessToken = tokenData.access_token;

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error("GitHub API error:", errorText);
      return NextResponse.redirect(new URL(`/login?error=github_api_error&details=${encodeURIComponent(errorText)}`, request.url));
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
        githubAccessToken: accessToken,  // Saving the access token
      });
    } else {
      user.name = profileData.name;
      user.bio = profileData.bio;
      user.avatar = profileData.avatar;
      user.isVerified = true;
      user.githubAccessToken = accessToken;  // Updating the access token
    }
    await user.save();

    // Update repositories
    // (Implement this part to save repositories to the database)

    // Update session cookie with signing
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: user._id.toString(), username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Redirect to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error: unknown) {
    console.error("GitHub OAuth error:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return NextResponse.redirect(new URL(`/login?error=server_error&details=${encodeURIComponent(errorMessage)}`, request.url));
  }
}
