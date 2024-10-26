import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User, IUser } from "@/lib/models/user";
import { SignJWT, jwtVerify } from "jose";

export async function POST(request: Request) {
  console.log("Complete signup process started");
  try {
    const tempToken = cookies().get("temp_session")?.value;
    if (!tempToken) {
      console.error("No temporary session found");
      return NextResponse.json({ error: "No temporary session found" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(tempToken, secret);

    console.log("Connecting to database");
    await connectDB();

    console.log("Upserting user");
    const user = await User.findOneAndUpdate(
      { githubId: payload.githubId },
      {
        $set: {
          username: payload.username,
          githubAccessToken: payload.accessToken,
        },
      },
      { upsert: true, new: true, lean: true, maxTimeMS: 5000 }
    ) as (IUser & { _id: string }) | null;

    if (!user) {
      console.error("Failed to create or update user");
      return NextResponse.json({ error: "Failed to create or update user" }, { status: 500 });
    }

    console.log("Generating new JWT");
    const newToken = await new SignJWT({ userId: user._id, username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    console.log("Setting new session cookie");
    cookies().set("session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    cookies().delete("temp_session");

    console.log("Complete signup process finished successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing signup:", error);
    return NextResponse.json({ error: "Failed to complete signup" }, { status: 500 });
  }
}
