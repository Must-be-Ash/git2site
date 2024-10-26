import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok) {
      console.error("GitHub API error:", await userResponse.text());
      return NextResponse.redirect(new URL(`/login?error=github_api_error`, request.url));
    }

    const userData = await userResponse.json();
    console.log("User data fetched from GitHub");

    // Create a temporary JWT with GitHub data
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const tempToken = await new SignJWT({
      githubId: userData.id,
      username: userData.login,
      accessToken: accessToken,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m') // Short expiration for security
      .sign(secret);

    // Set a temporary session cookie
    cookies().set("temp_session", tempToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minutes
    });

    // Redirect to a new route that will handle the database operations
    return NextResponse.redirect(new URL("/api/auth/complete-signup", request.url));
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(new URL(`/login?error=server_error`, request.url));
  }
}
