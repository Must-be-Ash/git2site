import { User } from "@/lib/models/user";
import { Repository } from "@/lib/models/repository";
import { Octokit } from "@octokit/rest";

export async function startPortfolioGeneration(user: User) {
  const jobId = `job_${Date.now()}_${user._id}`;
  // Start the generation process in the background
  generatePortfolio(user, jobId);
  return jobId;
}

async function generatePortfolio(user: User, jobId: string) {
  const octokit = new Octokit({ auth: user.githubAccessToken });
  let page = 1;
  const perPage = 100;
  let hasMore = true;

  while (hasMore) {
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: perPage,
      page,
    });

    for (const repo of repos) {
      await Repository.findOneAndUpdate(
        { userId: user._id, name: repo.name },
        {
          description: repo.description,
          url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          isPublic: !repo.private,
        },
        { upsert: true, new: true }
      );
    }

    hasMore = repos.length === perPage;
    page++;

    // Update progress
    await updateGenerationProgress(jobId, (page - 1) * perPage);
  }

  // Mark job as completed
  await updateGenerationProgress(jobId, 100, 'completed');
}

async function updateGenerationProgress(jobId: string, progress: number, status: 'in_progress' | 'completed' = 'in_progress') {
  // Implement this function to update the progress in your database or cache
  console.log(`Job ${jobId}: ${progress}% complete, status: ${status}`);
}

export async function getPortfolioGenerationStatus(jobId: string) {
  // Implement this function to retrieve the status from your database or cache
  // For now, we'll return a mock status
  return {
    jobId,
    progress: 50,
    status: 'in_progress'
  };
}
