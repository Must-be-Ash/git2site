import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { Octokit } from "@octokit/rest";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const octokit = new Octokit({ auth: user.githubAccessToken });

    // Fetch both public and private repositories
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
      visibility: 'all'
    });

    // Get the list of selected repository names from user preferences
    const selectedRepoNames = user.selectedRepositories?.map(repo => repo.name) || [];
    console.log("Currently selected repositories:", selectedRepoNames);

    // Map repositories and mark as selected based on user preferences
    const repositories = await Promise.all(repos.map(async (repo) => {
      // Fetch languages for each repository
      const { data: languages } = await octokit.repos.listLanguages({
        owner: repo.owner.login,
        repo: repo.name,
      });

      return {
        name: repo.name,
        description: repo.description,
        isPrivate: repo.private,
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        languages: Object.keys(languages),
        isSelected: selectedRepoNames.includes(repo.name)
      };
    }));

    console.log("Fetched repositories:", {
      total: repositories.length,
      selected: repositories.filter(r => r.isSelected).length
    });

    return NextResponse.json({ repositories });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
} 