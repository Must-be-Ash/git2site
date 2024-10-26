import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { connectDB } from "@/lib/db";
import { User, IUser } from "@/lib/models/user";

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
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok) {
      console.error("GitHub API error:", await userResponse.text());
      return NextResponse.redirect(new URL(`/login?error=github_api_error`, request.url));
    }

    const userData = await userResponse.json();
    console.log("User data fetched from GitHub");

    console.log("Connecting to database");
    await connectDB();

    console.log("Upserting user in database");
    const user = await User.findOneAndUpdate(
      { githubId: userData.id },
      {
        username: userData.login,
        name: userData.name,
        avatar: userData.avatar_url,
        githubAccessToken: accessToken,
      },
      { upsert: true, new: true, lean: true }
    ) as (IUser & { _id: string }) | null;

    if (!user) {
      console.error("Failed to create or update user");
      return NextResponse.redirect(new URL(`/login?error=user_creation_failed`, request.url));
    }

    console.log("User upserted in database");

    console.log("Generating JWT");
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: user._id.toString() })
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

    console.log("Redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(new URL(`/login?error=server_error`, request.url));
  }
}
