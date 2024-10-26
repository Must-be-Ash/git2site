import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`;
  const scope = "read:user repo";

  if (!clientId) {
    console.error("GITHUB_CLIENT_ID is not set");
    return NextResponse.json({ error: "OAuth configuration error" }, { status: 500 });
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;

  return NextResponse.redirect(githubAuthUrl);
}
