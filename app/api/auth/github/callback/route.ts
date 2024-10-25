import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { octokit } from "@/lib/github";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // This will be the username

  if (!code || !state) {
    return NextResponse.redirect("/login?error=missing_code_or_state");
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
      return NextResponse.redirect("/login?error=invalid_code");
    }

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Verify and update user
    await connectDB();
    const user = await User.findOne({ username: state });
    if (user && user.username === userData.login) {
      user.isVerified = true;
      await user.save();
    } else {
      return NextResponse.redirect(`/${state}?error=verification_failed`);
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify({
      accessToken: tokenData.access_token,
      user: {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        avatar: userData.avatar_url,
      },
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.redirect(`/${state}?verified=true`);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect("/login?error=server_error");
  }
}
