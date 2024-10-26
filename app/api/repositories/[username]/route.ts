import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Repository } from "@/lib/models/repository";
import { User } from "@/lib/models/user";
import { fetchUserRepositories } from "@/lib/github";

function serializeDocument(doc: any) {
  const serialized = JSON.parse(JSON.stringify(doc));
  if (serialized._id) {
    serialized.id = serialized._id.toString();
    delete serialized._id;
  }
  return serialized;
}

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    await connectDB();

    // Find the user to get their GitHub access token
    const user = await User.findOne({ username: params.username });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch repositories from the database
    let repositories = await Repository.find({ userId: user._id }).sort({ isFeatured: -1, stars: -1 });

    if (repositories.length === 0) {
      // Fetch repositories from GitHub if none exist
      const githubRepos = await fetchUserRepositories(params.username, user.githubAccessToken);
      
      const repoDocuments = await Repository.insertMany(
        githubRepos.map((repo: any) => ({
          userId: user._id,
          name: repo.name,
          description: repo.description,
          url: repo.url,
          homepage: repo.homepage,
          stars: repo.stars,
          language: repo.language,
          topics: repo.topics,
          isPublic: repo.isPublic,
          isFeatured: repo.isFeatured,
        }))
      );

      repositories = repoDocuments;
    }

    // Serialize the repositories
    const serializedRepositories = repositories.map(serializeDocument);

    return NextResponse.json(serializedRepositories);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
