export interface Project {
  id: string;
  name: string;
  description: string;
  languages: string[];  // Change this to match the API response
  githubUrl: string;
  websiteUrl?: string;
  thumbnailUrl: string;
}
