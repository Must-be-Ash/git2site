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
  location: String,
  blog: String,
  twitter: String,
  theme: {
    id: {
      type: String,
      default: 'light',
    },
    colors: {
      primary: String,
      secondary: String,
      background: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);