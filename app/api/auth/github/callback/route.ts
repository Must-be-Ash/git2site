import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { SignJWT } from "jose";
import { getGithubUser } from "@/lib/github";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    // Get GitHub user data
    const githubUser = await getGithubUser(code);

    // Connect to the database
    await connectDB();

    // Find or create user
    let user = await User.findOne({ githubId: githubUser.id });
    if (!user) {
      user = await User.create({
        githubId: githubUser.id,
        username: githubUser.login,
        name: githubUser.name,
        email: githubUser.email,
        avatar: githubUser.avatar_url,
      });
    }

    // Create JWT token
    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(JWT_SECRET));

    // Set cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day
      path: "/",
    });

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error in GitHub callback:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
