import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all blogs
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// POST new blog
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        coverImg: body.coverImg || null,
        tags: body.tags || [],
        authorName: body.authorName || "Unknown Author",
        authorImage: body.authorImage || null,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}