import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { octokit } from "@/lib/github";
import { fetchUserProfile, fetchUserRepositories } from "@/lib/github";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/login?error=missing_code");
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

    // Generate or update portfolio
    await connectDB();
    let user = await User.findOne({ username: userData.login });
    
    const [profileData, repositories] = await Promise.all([
      fetchUserProfile(userData.login),
      fetchUserRepositories(userData.login),
    ]);

    if (!user) {
      user = new User({
        username: userData.login,
        name: profileData.name,
        bio: profileData.bio,
        avatar: profileData.avatar,
        isVerified: true,
      });
    } else {
      user.name = profileData.name;
      user.bio = profileData.bio;
      user.avatar = profileData.avatar;
      user.isVerified = true;
    }
    await user.save();

    // Update repositories
    // (You'll need to create a Repository model and implement this part)

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

    return NextResponse.redirect(`/${userData.login}`);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect("/login?error=server_error");
  }
}
