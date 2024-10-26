import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { jwtVerify } from "jose";

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log("User data request received");
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session");
    
    if (!sessionCookie) {
      console.error("No session cookie found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(sessionCookie.value, secret);

    console.log("Connecting to database");
    await connectDB();

    console.log("Fetching user data");
    const user = await User.findById(payload.userId).lean();

    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("User data fetched successfully");
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
