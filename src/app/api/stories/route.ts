import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const skip = (page - 1) * limit;

    const stories = await prisma.story.findMany({
      skip,
      take: limit,
    });

    const totalStories = await prisma.story.count();

    return NextResponse.json({
      stories,
      page,
      limit,
      totalStories,
      totalPages: Math.ceil(totalStories / limit),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
