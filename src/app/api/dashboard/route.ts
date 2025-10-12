// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [user, postedGigs, appliedGigs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        department: true,
        gradYear: true,
        phone: true,
        type: true,
        createdAt: true,
      },
    }),
    prisma.gig.findMany({
      where: { postedById: userId },
      include: { applications: true },
    }),
    prisma.application.findMany({
      where: { userId },
      include: { gig: true },
    }),
  ]);

  const totalPostedGigs = postedGigs.length;
  const totalAppliedGigs = appliedGigs.length;

  return NextResponse.json({
    user,
    postedGigs,
    appliedGigs,
    totalPostedGigs,
    totalAppliedGigs,
  });
}