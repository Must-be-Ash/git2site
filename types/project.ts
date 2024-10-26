export interface Project {
  id: string;
  name: string;
  description: string;
  languages: string[];
  githubUrl: string;
  websiteUrl?: string;
  thumbnailUrl: string;
}
