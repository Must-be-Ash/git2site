import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { SignJWT, jwtVerify } from "jose";

export async function POST(request: Request) {
  try {
    const tempToken = cookies().get("temp_session")?.value;
    if (!tempToken) {
      return NextResponse.json({ error: "No temporary session found" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(tempToken, secret);

    await connectDB();

    const user = await User.findOneAndUpdate(
      { githubId: payload.githubId },
      {
        $set: {
          username: payload.username,
          githubAccessToken: payload.accessToken,
        },
      },
      { upsert: true, new: true }
    );

    const newToken = await new SignJWT({ userId: user._id.toString(), username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    cookies().set("session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    cookies().delete("temp_session");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing signup:", error);
    return NextResponse.json({ error: "Failed to complete signup" }, { status: 500 });
  }
}
