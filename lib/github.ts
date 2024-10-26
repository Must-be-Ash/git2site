import { Octokit } from '@octokit/rest';
import { throttling } from '@octokit/plugin-throttling';
import { restEndpointMethods } from '@octokit/plugin-rest-endpoint-methods';

const ThrottledOctokit = Octokit.plugin(throttling, restEndpointMethods);

type ThrottledOctokitType = InstanceType<typeof ThrottledOctokit>;

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
  language: string | null;
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

    return repos
      .filter(repo => !repo.fork && !repo.private)
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage ?? null,
        stars: repo.stargazers_count ?? 0,
        language: repo.language ?? null,
        topics: repo.topics || [],
        isPublic: !repo.private,
        isFeatured: false,
        order: 0,
      }));
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
