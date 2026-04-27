import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis"

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const cacheKey = `profile:${userId}`

  const cached = await redis.get(cacheKey);
  if(cached){
    return NextResponse.json({ user: cached, source: "cache"})
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      college: true,
      gradYear: true,
      phone: true,
      department: true,
      type: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await redis.set(cacheKey, user, {ex: 300}) 

  return NextResponse.json({ user, source: "db" }, { status: 200 });
}