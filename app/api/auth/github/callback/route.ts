import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { SignJWT } from "jose";
import { getGithubUser } from "@/lib/github";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  console.log("GitHub OAuth callback initiated");
  const startTime = Date.now();

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    console.log("Exchanging code for GitHub user data");
    const githubUser = await getGithubUser(code);
    console.log("GitHub user data received", { id: githubUser.id, login: githubUser.login });

    console.log("Connecting to database");
    await connectDB();
    console.log("Database connection established");

    console.log("Finding or creating user");
    let user = await User.findOne({ githubId: githubUser.id });
    if (!user) {
      console.log("Creating new user");
      user = await User.create({
        githubId: githubUser.id,
        username: githubUser.login,
        name: githubUser.name || githubUser.login,
        email: githubUser.email,
        avatar: githubUser.avatar_url,
      });
      console.log("New user created", { id: user._id });
    } else {
      console.log("Existing user found", { id: user._id });
    }

    console.log("Generating JWT");
    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(JWT_SECRET));

    console.log("Setting JWT cookie");
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 1 day
      path: "/",
    });

    const endTime = Date.now();
    console.log(`GitHub OAuth callback completed in ${endTime - startTime}ms`);

    console.log("Redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error in GitHub callback:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
