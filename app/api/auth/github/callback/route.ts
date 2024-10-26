import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { SignJWT } from "jose";

export async function GET(request: Request) {
  console.log("GitHub OAuth callback initiated");
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    console.error("Missing code in GitHub callback");
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  try {
    console.log("Exchanging code for access token");
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
    console.log("Access token obtained");

    console.log("Fetching user data from GitHub");
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
    console.log("User data fetched successfully");

    console.log("Connecting to database");
    await connectDB();
    console.log("Database connection established");

    console.log("Upserting user");
    const user = await User.findOneAndUpdate(
      { username: userData.login },
      {
        $set: {
          name: userData.name,
          bio: userData.bio,
          avatar: userData.avatar_url,
          isVerified: true,
          githubAccessToken: accessToken,
        },
      },
      { upsert: true, new: true }
    );
    console.log("User upserted successfully");

    console.log("Generating JWT");
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: user._id.toString(), username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    console.log("Setting session cookie");
    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Trigger background task for fetching additional user data
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/update-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id.toString() }),
    }).catch(console.error);

    console.log("Redirecting to dashboard");
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
