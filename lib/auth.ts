import { NextRequest } from 'next/server';
import { User, UserDocument } from './models/user';
import { jwtVerify, SignJWT } from 'jose';
import { connectDB } from './db';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getAuthenticatedUser(req: NextRequest): Promise<UserDocument | null> {
  try {
    const db = await connectDB();

    const token = req.cookies.get('token')?.value;

    if (!token) {
      console.log('No token found in cookies');
      return null;
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

      if (!payload.userId || typeof payload.userId !== 'string') {
        console.log('Invalid payload in JWT');
        return null;
      }

      const user = await User.findById(payload.userId);
      if (!user) {
        console.log('User not found for ID:', payload.userId);
      }
      return user;
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return null;
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const user = await getAuthenticatedUser(req);
  return !!user;
}

export async function createJWT(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(new TextEncoder().encode(JWT_SECRET));
}
