import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  email: String,
  avatar: String,
  bio: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  theme: {
    name: String,
    buttonStyle: String,
    cardStyle: String,
    fontFamily: String,
    colors: {
      background: String,
      foreground: String,
      card: String,
      'card-foreground': String,
      primary: String,
      secondary: String,
      button: String,
      'button-foreground': String,
    },
  },
  socialLinks: {
    linkedinUrl: String,
    twitterUrl: String,
    emailAddress: String,
  },
  personalDomain: String,
  githubAccessToken: String,
  selectedRepositories: [{
    name: String,
    description: String,
    isPrivate: Boolean,
    url: String,
    homepage: String,
    stars: Number,
    forks: Number,
    languages: [String]
  }],
}, { timestamps: true });

// Add this interface if not already present
interface UserPreferences {
  theme?: {
    name: String,
    buttonStyle: String,
    cardStyle: String,
    fontFamily: String,
    colors: {
      background: String,
      foreground: String,
      card: String,
      'card-foreground': String,
      primary: String,
      secondary: String,
      button: String,
      'button-foreground': String,
    },
  };
  socialLinks?: {
    linkedinUrl?: string;
    twitterUrl?: string;
    emailAddress?: string;
  };
  personalDomain?: string;
}

// Update the User interface/schema to include preferences
export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  githubId: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  githubAccessToken: string;
  preferences?: UserPreferences;
  selectedRepositories?: Array<{
    name: string;
    description: string;
    isPrivate: boolean;
    url: string;
    homepage?: string;
    stars: number;
    forks: number;
    languages: string[];
  }>;
  // Add other properties as needed
}

export const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export type UserModel = mongoose.Model<UserDocument>;
