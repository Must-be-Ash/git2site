import { User } from '@/lib/models/user';
import { Portfolio } from '@/types/portfolio';
import { PortfolioService } from '@/lib/models/portfolio';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { Octokit } from '@octokit/rest';

// Add this constant at the top of the file
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://www.git2site.pro' 
  : 'http://localhost:3000';

// Update the repository interface at the top of the file
interface Repository {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  languages: string[];
  homepage?: string;  // Add this
}

export async function getPortfolioGenerationStatus(userId: string): Promise<string> {
  await connectDB();
  const portfolio = await PortfolioService.findOne({ userId });
  return portfolio ? portfolio.status : 'not_found';
}

export async function startPortfolioGeneration(userId: string): Promise<void> {
  console.log('Starting portfolio generation for user:', userId);
  await connectDB();
  await initializePortfolioGeneration(userId);
  console.log('Portfolio initialized, starting section generation');
  await generatePortfolioSections(userId);  // Add await here
  console.log('Portfolio generation completed');
}

async function initializePortfolioGeneration(userId: string): Promise<void> {
  await PortfolioService.create({
    _id: new mongoose.Types.ObjectId().toString(),
    userId,
    status: 'initializing',
    sections: {
      profile: { status: 'pending' },
      repositories: { status: 'pending' },
      skills: { status: 'pending' },
      projects: { status: 'pending' },
    },
  });
}

async function generatePortfolioSections(userId: string): Promise<void> {
  const sections = ['profile', 'repositories', 'skills', 'projects'];
  
  for (const section of sections) {
    console.log(`Generating ${section} section`);
    await updateSectionStatus(userId, section, 'in_progress');
    try {
      await generateSection(userId, section);
      await updateSectionStatus(userId, section, 'completed');
      console.log(`${section} section completed`);
    } catch (error) {
      console.error(`Error generating ${section} section:`, error);
      await updateSectionStatus(userId, section, 'failed');
    }
  }
  
  await updatePortfolioStatus(userId, 'completed');
}

async function generateSection(userId: string, section: string): Promise<void> {
  const user = await User.findById(userId);  // Use User instead of UserModel
  if (!user) throw new Error('User not found');

  switch (section) {
    case 'profile':
      await PortfolioService.updateOne(
        { userId },
        { $set: { 'sections.profile.data': {
          name: user.name || user.username,
          bio: user.bio || '',
          avatar: user.avatar || '',
        } } }
      );
      break;
    case 'repositories':
      const repos = await fetchUserRepositories(user.githubAccessToken);
      await PortfolioService.updateOne(
        { userId },
        { $set: { 'sections.repositories.data': repos } }
      );
      break;
    case 'skills':
      const skills = await generateUserSkills(user.githubAccessToken);
      await PortfolioService.updateOne(
        { userId },
        { $set: { 'sections.skills.data': skills } }
      );
      break;
    case 'projects':
      const projects = await generateUserProjects(user.githubAccessToken);
      await PortfolioService.updateOne(
        { userId },
        { $set: { 'sections.projects.data': projects } }
      );
      break;
  }
}

async function updateSectionStatus(userId: string, section: string, status: string): Promise<void> {
  await PortfolioService.updateOne(
    { userId },
    { $set: { [`sections.${section}.status`]: status } }
  );
}

async function updatePortfolioStatus(userId: string, status: string): Promise<void> {
  await PortfolioService.updateOne({ userId }, { $set: { status } });
}

// Update the fetchUserRepositories function signature
async function fetchUserRepositories(accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });
  const { data: repos } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 10,
    visibility: 'public'
  });

  // Fetch languages for each repository
  const reposWithLanguages = await Promise.all(repos.map(async (repo) => {
    const { data: languages } = await octokit.repos.listLanguages({
      owner: repo.owner.login,
      repo: repo.name,
    });

    return {
      name: repo.name,
      description: repo.description || '',
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      languages: Object.keys(languages),
      homepage: repo.homepage || `https://${repo.name}.vercel.app`
    };
  }));

  return reposWithLanguages;
}

async function generateUserSkills(accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });
  const { data: repos } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 100,
    visibility: 'public'
  });

  // Extract languages from repositories
  const languageMap = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) {
      languageMap.set(repo.language, (languageMap.get(repo.language) || 0) + 1);
    }
  }

  // Convert to array and sort by frequency
  const sortedSkills = Array.from(languageMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([language]) => language);

  return sortedSkills;
}

async function generateUserProjects(accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });
  const { data: repos } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 6,
    visibility: 'public'
  });

  const projects = await Promise.all(repos.map(async (repo) => {
    let image = '/placeholder-project.png'; // Default placeholder image
    
    if (process.env.NODE_ENV === 'production') {
      try {
        const previewUrl = `${BASE_URL}/api/preview?url=${encodeURIComponent(repo.html_url)}`;
        const response = await fetch(previewUrl);
        
        if (response.ok) {
          const data = await response.json();
          if (data.preview) {
            image = data.preview;
          }
        } else {
          console.error('Preview generation failed:', await response.text());
        }
      } catch (error) {
        console.error('Error generating preview for project:', error);
      }
    }

    return {
      name: repo.name,
      description: repo.description || '',
      url: repo.html_url,
      image: image
    };
  }));

  return projects;
}

// Update the processRepositories function to use one parameter
async function processRepositories(accessToken: string) {
  const repos = await fetchUserRepositories(accessToken);
  
  console.log('Fetched repositories with languages:', 
    repos.map(r => ({ name: r.name, languages: r.languages }))
  );

  return {
    status: 'completed',
    data: repos.map(repo => ({
      name: repo.name,
      description: repo.description,
      url: repo.url,
      languages: repo.languages,
      stars: repo.stars,
      forks: repo.forks || 0,
      homepage: repo.homepage
    }))
  };
}
