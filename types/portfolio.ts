export interface Portfolio {
  _id: string;
  userId: string;
  status: string;
  sections: {
    profile: {
      status: string;
      data?: {
        name: string;
        bio: string;
        avatar: string;
      };
    };
    repositories: {
      status: string;
      data?: Array<{
        name: string;
        description: string;
        url: string;
        stars: number;
        forks: number;
        language: string;
      }>;
    };
    skills: {
      status: string;
      data?: string[];
    };
    projects: {
      status: string;
      data?: Array<{
        name: string;
        description: string;
        url: string;
        image: string;
      }>;
    };
  };
  // Add other portfolio properties as needed
}
