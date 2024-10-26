import { NextResponse } from 'next/server';
import { fetchUserProfile, fetchUserRepositories } from '@/lib/github';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/user';
import { Repository } from '@/lib/models/repository';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

// Initialize Redis connection
const redisClient = new Redis(process.env.REDIS_URL!);

// Initialize BullMQ queue
const portfolioQueue = new Queue('portfolio-generation', {
  connection: redisClient,
});

export async function POST(req: Request) {
  console.log('Portfolio generation request received');
  try {
    const { username } = await req.json();
    console.log(`Queueing portfolio generation for username: ${username}`);
    
    if (!username) {
      console.log('Error: Username is required');
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Add job to the queue
    await portfolioQueue.add('generate-portfolio', { username });

    return NextResponse.json({
      success: true,
      message: 'Portfolio generation has been queued',
    });
  } catch (error) {
    console.error('Error queueing portfolio generation:', error);
    return NextResponse.json(
      { error: 'Failed to queue portfolio generation' },
      { status: 500 }
    );
  }
}
