// app/dashboard/page.tsx
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return (
        <div className="mt-40 text-center text-gray-500">
          Please log in to view your dashboard.
        </div>
      );
    }

    const userId = session.user.id;

    // ✅ 1. Fetch user info
    const user = await prisma.user.findUnique({
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
    });

    if (!user) {
      return (
        <div className="mt-40 text-center text-gray-500">
          User not found.
        </div>
      );
    }

    const normalizedUser = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      phone: user.phone ?? null,
      college: user.college ?? null,
      department: user.department ?? null,
      gradYear: user.gradYear ?? null,
    };

    // ✅ 2. Fetch posted gigs with applications
    const postedGigsRaw = await prisma.gig.findMany({
      where: { postedById: userId },
      include: {
        applications: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                college: true,
                department: true,
                gradYear: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const postedGigs = postedGigsRaw.map((gig) => ({
      ...gig,
      createdAt: gig.createdAt.toISOString(),
      applications: gig.applications.map((app) => ({
        ...app,
        createdAt: app.createdAt.toISOString(),
        extraInfo: app.extra ?? null,
      })),
    }));

    // ✅ 3. Fetch applied gigs
    const appliedRaw = await prisma.application.findMany({
      where: { userId },
      include: { gig: true },
      orderBy: { createdAt: "desc" },
    });

    const appliedGigs = appliedRaw.map((app) => ({
      ...app,
      createdAt: app.createdAt.toISOString(),
      extraInfo: app.extra ?? null,
      gig: {
        ...app.gig,
        createdAt: app.gig.createdAt.toISOString(),
      },
    }));

    return (
      <DashboardClient
        user={normalizedUser}
        postedGigs={postedGigs}
        appliedGigs={appliedGigs}
      />
    );
  } catch (error) {
    console.error("🚨 Dashboard error:", error);
    return (
      <div className="p-8 mt-40 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Dashboard Error
        </h1>
        <pre className="bg-gray-100 p-4 rounded text-left whitespace-pre-wrap max-w-3xl mx-auto overflow-auto">
          {error instanceof Error ? error.message : JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }
}