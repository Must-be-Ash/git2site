interface ProjectData {
  name: string;
  description: string;
  url: string;
  image: string;
  languages: string[];
}

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
        languages: string[];
        stars: number;
        forks: number;
        homepage?: string;
        isPrivate: boolean;
      }>;
    };
    skills: {
      status: string;
      data?: string[];
    };
    projects: {
      status: string;
      data?: ProjectData[];
    };
  };
}
