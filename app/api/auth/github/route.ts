import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Get the actual host from the request
  const host = request.headers.get('host') || 'git2site.pro';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/auth/github/callback`;

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: redirectUri,
    scope: 'read:user user:email repo',
    state: Math.random().toString(36).substring(7),
  })

  return redirect(`https://github.com/login/oauth/authorize?${params.toString()}`)
}
