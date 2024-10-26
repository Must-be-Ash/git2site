import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { User } from "@/lib/models/user";

export async function getUserFromSession(req: Request) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(sessionCookie.value, secret);

    const user = await User.findById(payload.userId);
    return user;
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
}
