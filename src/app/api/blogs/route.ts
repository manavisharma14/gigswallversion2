// app/api/blogs/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

import { getAllBlogs } from "@/lib/blogs";

export async function GET() {
  const blogs = await getAllBlogs();
  return NextResponse.json(blogs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, coverImg, content, dateOverride } = await req.json();
  const authorEmail = session.user.email;

  let authorName = "";
  let authorImage = "";

  if (authorEmail === "manavisharma14@gmail.com") {
    // ✅ Manavi
    authorName = "Manavi Sharma";
    authorImage = "/assets/manavi1.png";
  } else if (authorEmail === "manavsharma1280@gmail.com") {
    // ✅ Manav → Shrishti author
    authorName = "Shrishti";
    authorImage = "/assets/shrishti.png";
  } else {
    // Optional fallback
    authorName = "Guest Author";
    authorImage = "/assets/default.png";
  }

  const blog = await prisma.blog.create({
    data: {
      title,
      coverImg,
      content,
      authorName,
      authorImage,
      createdAt: dateOverride ? new Date(dateOverride) : new Date(),
    },
  });

  return NextResponse.json(blog);
}