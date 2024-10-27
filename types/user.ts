import { Theme } from './theme';

export interface User {
  _id: string;
  // Add other user properties as needed
  username: string;
  email: string;
  // ... other properties
}

export interface SerializedUser {
  id: string;
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  theme?: Theme;
  socialLinks?: {
    linkedinUrl?: string;
    twitterUrl?: string;
    emailAddress?: string;
  };
  personalDomain?: string;
}
