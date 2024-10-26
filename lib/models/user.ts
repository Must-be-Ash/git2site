import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
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
  githubAccessToken: String,
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
