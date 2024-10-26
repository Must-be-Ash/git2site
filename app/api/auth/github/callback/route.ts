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

    console.log("Fetching basic user data from GitHub");
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
    console.log("Basic user data fetched successfully");

    // Generate a temporary JWT token with GitHub data
    console.log("Generating temporary JWT");
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
      githubId: userData.id,
      username: userData.login,
      accessToken: accessToken
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m') // Short expiration for security
      .sign(secret);

    console.log("Setting temporary session cookie");
    cookies().set("temp_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minutes
    });

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
