import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Repository } from "@/lib/models/repository";
import { User } from "@/lib/models/user";
import { fetchUserRepositories } from "@/lib/github";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await connectDB();

    const user = await User.findOne({ username: params.username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const repositories = await Repository.find({ userId: user._id })
      .sort({ order: 1, updatedAt: -1 });

    if (repositories.length === 0) {
      // Fetch repositories from GitHub if none exist
      const githubRepos = await fetchUserRepositories(params.username);
      
      const repoDocuments = await Repository.insertMany(
        githubRepos.map((repo: any) => ({
          userId: user._id,
          ...repo,
        }))
      );

      return NextResponse.json(repoDocuments);
    }

    return NextResponse.json(repositories);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}