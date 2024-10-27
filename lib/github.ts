import { Octokit } from '@octokit/rest';
import { throttling } from '@octokit/plugin-throttling';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';
import axios from 'axios';

const ThrottledOctokit = Octokit.plugin(throttling, restEndpointMethods);

type ThrottledOctokitType = InstanceType<typeof ThrottledOctokit>;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

export const createOctokit = (accessToken: string) => new ThrottledOctokit({
  auth: accessToken,
  throttle: {
    onRateLimit: (retryAfter, options, octokit) => {
      octokit.log.warn(`Rate limit exceeded, retrying after ${retryAfter} seconds`);
      return true;
    },
    onSecondaryRateLimit: (retryAfter, options, octokit) => {
      octokit.log.warn(`Secondary rate limit exceeded, retrying after ${retryAfter} seconds`);
      return true;
    },
  },
});

export interface GitHubProfile {
  name: string;
  bio: string | null;
  avatar: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter: string | null | undefined;
}

export interface GitHubRepository {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null | undefined;
  stars: number;
  languages: string[];  // Changed from 'language: string | null'
  topics: string[];
  isPublic: boolean;
  isFeatured: boolean;
  order: number;
}

export async function fetchUserRepositories(username: string, accessToken: string): Promise<GitHubRepository[]> {
  const octokit = createOctokit(accessToken);
  try {
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      sort: 'updated',
      per_page: 100,
      type: 'owner',
    });

    const reposWithDetails = await Promise.all(
      repos
        .filter(repo => !repo.fork && !repo.private)
        .map(async repo => {
          // Fetch languages
          const { data: languagesData } = await octokit.rest.repos.listLanguages({
            owner: username,
            repo: repo.name,
          });

          // Get detailed repository information
          const { data: repoDetails } = await octokit.rest.repos.get({
            owner: username,
            repo: repo.name,
          });

          // Determine the website URL with proper fallback logic
          let websiteUrl = null;
          
          // Check website URL in this order:
          // 1. Homepage from repository details
          // 2. GitHub Pages URL
          // 3. Vercel deployment
          if (repoDetails.homepage && repoDetails.homepage.trim() !== '') {
            websiteUrl = repoDetails.homepage;
            console.log(`Found homepage URL for ${repo.name}:`, websiteUrl);
          } else {
            try {
              const { data: pages } = await octokit.rest.repos.getPages({
                owner: username,
                repo: repo.name,
              });
              if (pages.html_url) {
                websiteUrl = pages.html_url;
                console.log(`Found GitHub Pages URL for ${repo.name}:`, websiteUrl);
              }
            } catch (error) {
              // If no GitHub Pages, check if it might be a Vercel deployment
              if (repo.topics?.includes('vercel') || repo.name.toLowerCase().includes('app')) {
                websiteUrl = `https://${repo.name}.vercel.app`;
                console.log(`Using Vercel fallback URL for ${repo.name}:`, websiteUrl);
              }
            }
          }

          return {
            name: repo.name,
            description: repoDetails.description || '',
            url: repoDetails.html_url,
            homepage: websiteUrl,
            stars: repoDetails.stargazers_count ?? 0,
            languages: Object.keys(languagesData),
            topics: repoDetails.topics || [],
            isPublic: !repoDetails.private,
            isFeatured: false,
            order: 0,
          };
        })
    );

    // Log all repositories and their website URLs
    console.log('Repositories with website URLs:', 
      reposWithDetails.map(r => ({
        name: r.name,
        website: r.homepage
      }))
    );

    return reposWithDetails;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw new Error('Failed to fetch repositories from GitHub');
  }
}

export async function fetchUserProfile(username: string, accessToken: string): Promise<GitHubProfile> {
  const octokit = createOctokit(accessToken);
  try {
    const { data: profile } = await octokit.rest.users.getByUsername({
      username,
    });

    return {
      name: profile.name || profile.login,
      bio: profile.bio,
      avatar: profile.avatar_url,
      company: profile.company,
      location: profile.location,
      blog: profile.blog,
      twitter: profile.twitter_username,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile from GitHub');
  }
}

export async function exchangeCodeForAccessToken(code: string): Promise<string> {
  // Determine if we're in production based on the request headers or environment
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'http://git2site.pro' 
    : 'http://localhost:3000';

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: `${baseUrl}/api/auth/github/callback`
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('GitHub token exchange failed:', errorText);
    throw new Error('Failed to exchange code for token');
  }

  const data = await response.json();
  
  if (data.error) {
    console.error('GitHub OAuth error:', data);
    throw new Error(`GitHub OAuth error: ${data.error}`);
  }

  if (!data.access_token) {
    console.error('No access token received:', data);
    throw new Error('No access token received from GitHub');
  }

  return data.access_token;
}

export async function getGithubUser(accessToken: string) {
  const octokit = createOctokit(accessToken);
  const { data: user } = await octokit.users.getAuthenticated();
  return user;
}

export async function fetchRepositoryLanguages(owner: string, repo: string, token: string) {
  const octokit = new Octokit({ auth: token });
  
  try {
    const { data } = await octokit.repos.listLanguages({
      owner,
      repo,
    });
    
    // Convert languages object to array of language names
    return Object.keys(data);
  } catch (error) {
    console.error('Error fetching repository languages:', error);
    return [];
  }
}

export async function fetchRepositoryDetails(owner: string, repo: string, token: string) {
  const octokit = new Octokit({ auth: token });
  
  try {
    const [repoData, languages] = await Promise.all([
      octokit.repos.get({ owner, repo }),
      fetchRepositoryLanguages(owner, repo, token)
    ]);

    return {
      name: repoData.data.name,
      description: repoData.data.description,
      url: repoData.data.html_url,
      homepage: repoData.data.homepage,
      languages: languages,  // Add languages to the return object
      stars: repoData.data.stargazers_count,
      forks: repoData.data.forks_count,
    };
  } catch (error) {
    console.error('Error fetching repository details:', error);
    throw error;
  }
}
