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
    id: String,
    colors: Object,
  },
  githubAccessToken: String,
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
