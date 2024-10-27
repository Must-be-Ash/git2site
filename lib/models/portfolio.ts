import mongoose from 'mongoose';
import { Portfolio } from '@/types/portfolio';

// Add or update the repository interface in the Portfolio model
interface RepositoryData {
  name: string;
  description: string | null;
  url: string;
  languages: string[];  // Make sure this exists
  stars: number;
  forks: number;
  homepage?: string;
}

const portfolioSchema = new mongoose.Schema<Portfolio>({
  _id: String,
  userId: String,
  status: String,
  sections: {
    profile: {
      status: String,
      data: {
        name: String,
        bio: String,
        avatar: String,
      },
    },
    repositories: {
      status: String,
      data: [{
        name: String,
        description: String,
        url: String,
        languages: [String],  // Make sure this is defined
        stars: Number,
        forks: Number,
        homepage: String,
      }],
    },
    skills: {
      status: String,
      data: [String],
    },
    projects: {
      status: String,
      data: [{
        name: String,
        description: String,
        url: String,
        image: String,
      }],
    },
  },
});

export const PortfolioModel = mongoose.models.Portfolio || mongoose.model<Portfolio>('Portfolio', portfolioSchema);

export class PortfolioService {
  static async findOne(query: { userId: string }): Promise<Portfolio | null> {
    const doc = await PortfolioModel.findOne(query).lean();
    return doc as Portfolio | null;
  }

  static async create(portfolio: Portfolio): Promise<void> {
    await PortfolioModel.create(portfolio);
  }

  static async updateOne(query: { userId: string }, update: { $set: any }): Promise<void> {
    await PortfolioModel.updateOne(query, update);
  }
}
