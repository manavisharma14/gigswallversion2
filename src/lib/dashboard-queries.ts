// src/lib/dashboard-queries.ts
import { prisma } from '@/lib/prisma';
import { GigWithRelations, ApplicationWithRelations } from '@/types/prisma';

// -------------------------------------------------------------------
// getUserProfile
// -------------------------------------------------------------------
export async function getUserProfile(userId: string) {
  const [user, counts] = await Promise.all([
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
        walletBalance: true,
        createdAt: true,

        totalRatings: true,
        completedGigs: true,
      },
    }),
    Promise.all([
      prisma.gig.count({ where: { postedById: userId } }),
      prisma.application.count({ where: { userId } }),
      prisma.application.count({ where: { userId, status: 'accepted' } }),
    ]),
  ]);

  if (!user) throw new Error('User not found');

  return {
    user: {
      ...user,
      phone: user.phone ?? null,
      college: user.college ?? null,
      department: user.department ?? null,
      gradYear: user.gradYear ?? null,
    },
    counts: {
      posted: counts[0],
      applied: counts[1],
      accepted: counts[2],
    },
  };
}

// -------------------------------------------------------------------
// getPostedGigs – Poster view (with full applicant data)
// -------------------------------------------------------------------
// -------------------------------------------------------------------
// getPostedGigs – Poster view (with full applicant data)
// -------------------------------------------------------------------
export async function getPostedGigs(userId: string): Promise<GigWithRelations[]> {
  return await prisma.gig.findMany({
    where: { postedById: userId },
    include: {
      applications: {
        include: {
          // THIS LINE IS THE FIX
          gig: true,                     // <-- add this
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              college: true,
              department: true,
              gradYear: true,
              totalRatings: true,
              completedGigs: true,
              phone: true,
              walletBalance: true,
              type: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// -------------------------------------------------------------------
// getAppliedGigs – Freelancer view (MUST include gig.applications)
// -------------------------------------------------------------------
export async function getAppliedGigs(userId: string): Promise<ApplicationWithRelations[]> {
  return await prisma.application.findMany({
    where: { userId },
    include: {
      gig: {
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
                  completedGigs: true,
                  totalRatings: true,
                  gradYear: true,
                  phone: true,
                  walletBalance: true,
                  type: true,
                },
              },
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          college: true,
          department: true,
          gradYear: true,
          phone: true,
          walletBalance: true,
          type: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}