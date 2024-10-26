import { Worker, Job } from 'bullmq';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Repository } from '@/lib/models/repository';
import { fetchUserProfile, fetchUserRepositories } from '@/lib/github';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL!);

const portfolioWorker = new Worker('portfolio-generation', async (job: Job) => {
  const { username } = job.data;
  console.log(`Starting portfolio generation for ${username}`);

  try {
    await connectDB();

    let user = await User.findOne({ username });
    const [userData, repositories] = await Promise.all([
      fetchUserProfile(username),
      fetchUserRepositories(username),
    ]);

    if (!user) {
      user = new User({
        username,
        name: userData.name,
        bio: userData.bio,
        avatar: userData.avatar,
        theme: { id: 'light' },
      });
    } else {
      user.name = userData.name;
      user.bio = userData.bio;
      user.avatar = userData.avatar;
    }
    await user.save();

    const repoPromises = repositories.map(async (repo) => {
      const existingRepo = await Repository.findOne({ userId: user._id, name: repo.name });
      if (existingRepo) {
        Object.assign(existingRepo, repo);
        return existingRepo.save();
      } else {
        return Repository.create({ ...repo, userId: user._id });
      }
    });
    await Promise.all(repoPromises);

    console.log(`Portfolio generation completed for ${username}`);
  } catch (error) {
    console.error(`Error generating portfolio for ${username}:`, error);
    throw error;
  }
}, { connection: redisClient });

export default portfolioWorker;
