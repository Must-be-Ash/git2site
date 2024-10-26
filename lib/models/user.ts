import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  githubId: string;
  githubAccessToken: string;
  name?: string;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  theme?: {
    name: string;
    buttonStyle: string;
    cardStyle: string;
    fontFamily: string;
    colors: {
      background: string;
      foreground: string;
      card: string;
      'card-foreground': string;
      primary: string;
      secondary: string;
      button: string;
      'button-foreground': string;
    };
  };
  socialLinks?: {
    linkedinUrl?: string;
    twitterUrl?: string;
    emailAddress?: string;
  };
  personalDomain?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  githubId: { type: String, required: true, unique: true },
  githubAccessToken: { type: String, required: true },
  name: String,
  bio: String,
  avatar: String,
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
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
