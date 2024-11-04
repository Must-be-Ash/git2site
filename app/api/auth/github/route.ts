import { redirect } from 'next/navigation'

// Add this export to mark the route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://www.git2site.pro'
    : 'http://localhost:3000'

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: `${baseUrl}/api/auth/github/callback`,
    scope: 'read:user user:email repo',
    state: Math.random().toString(36).substring(7),
  })

  return redirect(`https://github.com/login/oauth/authorize?${params.toString()}`)
}
