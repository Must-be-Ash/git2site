import { NextRequest } from 'next/server';
import { User, UserDocument } from './models/user';
import { jwtVerify } from 'jose';
import { connectDB } from './db';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getAuthenticatedUser(req: NextRequest): Promise<UserDocument | null> {
  try {
    console.log("=== Authentication Process Started ===");
    await connectDB();

    const userId = req.cookies.get('userId')?.value;
    const token = req.cookies.get('token')?.value;

    console.log("Cookies found:", {
      userId: userId ? 'present' : 'missing',
      token: token ? 'present' : 'missing'
    });

    if (!userId) {
      console.log("No userId cookie found");
      return null;
    }

    // Find user in database
    const user = await User.findById(userId);
    console.log("Database user lookup result:", user ? 'found' : 'not found');

    if (!user) {
      console.log("User not found in database");
      return null;
    }

    // Check if GitHub token exists and is valid
    if (!user.githubAccessToken) {
      console.log("No GitHub access token found for user");
      return null;
    }

    // Log user data (excluding sensitive information)
    console.log("User data retrieved:", {
      id: user._id,
      username: user.username,
      hasGithubToken: !!user.githubAccessToken
    });

    // Verify GitHub token is still valid
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${user.githubAccessToken}`,
        },
      });

      if (!response.ok) {
        console.log("GitHub token validation failed:", response.status);
        // Token is invalid, you might want to trigger a re-authentication
        return null;
      }

      console.log("GitHub token validated successfully");
    } catch (error) {
      console.error("Error validating GitHub token:", error);
      return null;
    }

    console.log("=== Authentication Process Completed ===");
    return user;
  } catch (error) {
    console.error("=== Authentication Process Failed ===", error);
    return null;
  }
}

export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const user = await getAuthenticatedUser(req);
  return !!user;
}
