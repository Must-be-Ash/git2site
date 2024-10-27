import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  url: String,
  homepage: String,
  thumbnailUrl: String,
  languages: [String],
  stars: Number,
  forks: Number,
}, { timestamps: true });

export const Repository = mongoose.models.Repository || mongoose.model('Repository', repositorySchema);
