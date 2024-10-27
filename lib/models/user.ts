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
}, { timestamps: true });

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  githubId: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  githubAccessToken: string;
  // Add other properties as needed
}

export const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export type UserModel = mongoose.Model<UserDocument>;
