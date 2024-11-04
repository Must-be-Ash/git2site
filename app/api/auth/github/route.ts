import { NextResponse } from "next/server";

// Add this export to mark the route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  
  if (!GITHUB_CLIENT_ID) {
    console.error("Missing GITHUB_CLIENT_ID");
    return NextResponse.redirect(new URL("/login?error=configuration", request.url));
  }

  // Determine if we're in production based on the request URL
  const isProduction = request.url.includes('git2site.pro');
  const baseUrl = isProduction ? 'https://git2site.pro' : 'http://localhost:3000';
  
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: `${baseUrl}/api/auth/github/callback`,
    scope: 'read:user user:email repo',
    state: Math.random().toString(36).substring(7),
  });

  console.log("Redirecting to GitHub with params:", params.toString());
  return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}
