import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User, UserDocument } from "@/lib/models/user";
import { getGithubUser, exchangeCodeForAccessToken } from "@/lib/github";
import { createJWT } from "@/lib/auth";

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
    const db = await connectDB();

    const accessToken = await exchangeCodeForAccessToken(code);
    const githubUser = await getGithubUser(accessToken);
    console.log("GitHub user data received", { id: githubUser.id, login: githubUser.login });

    let user: UserDocument | null = await User.findOne({ githubId: githubUser.id });
    let isNewUser = false;

    if (user) {
      // Update existing user
      user.username = githubUser.login;
      user.name = githubUser.name || githubUser.login;
      user.email = githubUser.email || '';
      user.avatar = githubUser.avatar_url || '';
      user.githubAccessToken = accessToken;
      await user.save();
    } else {
      // Create new user
      isNewUser = true;
      let username = githubUser.login;
      let counter = 1;
      
      // Check if username exists and append a number if it does
      while (await User.findOne({ username })) {
        username = `${githubUser.login}${counter}`;
        counter++;
      }

      const newUser = new User({
        githubId: githubUser.id,
        username: username,
        name: githubUser.name || githubUser.login,
        email: githubUser.email || '',
        avatar: githubUser.avatar_url || '',
        githubAccessToken: accessToken,
      });
      user = await newUser.save();
    }

    if (!user) {
      throw new Error("Failed to create or update user");
    }

    const token = await createJWT(user._id.toString());

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 1 day
      path: "/",
    });

    console.log(`GitHub OAuth callback completed in ${Date.now() - startTime}ms`);

    const baseUrl = process.env.NODE_ENV === "production" 
      ? "https://www.git2site.pro" 
      : "http://localhost:3000";
    const redirectUrl = `${baseUrl}/dashboard`;
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in GitHub callback:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
