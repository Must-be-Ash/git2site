import { NextRequest, NextResponse } from "next/server";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NODE_ENV === "production" 
    ? "https://www.git2site.pro" 
    : "http://localhost:3000";

  const callbackUrl = `${baseUrl}/api/auth/github/callback`;

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}`;

  return NextResponse.redirect(githubAuthUrl);
}
