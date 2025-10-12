import { prisma } from "@/lib/prisma";

export async function getAllBlogs() {
  return prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });
}