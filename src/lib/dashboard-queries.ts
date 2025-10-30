// lib/dashboard-queries.ts
import { prisma } from '@/lib/prisma';
import { Gig, Application } from '@/components/dashboard/types';

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
        createdAt: true,
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
      createdAt: user.createdAt.toISOString(),
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

export async function getPostedGigs(userId: string): Promise<Gig[]> {
  const gigs = await prisma.gig.findMany({
    where: { postedById: userId },
    include: {
      applications: {
        include: {
          user: {
            select: { id: true, name: true, email: true, college: true, department: true, gradYear: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return gigs.map((gig) => ({
    id: gig.id,
    title: gig.title,
    description: gig.description,
    budget: gig.budget,
    category: gig.category,
    college: gig.college,
    isOpen: gig.isOpen,
    status: gig.status,
    createdAt: gig.createdAt.toISOString(),
    postedById: gig.postedById,
    applications: gig.applications.map((app) => ({
      id: app.id,
      reason: app.reason,
      experience: app.experience,
      extraInfo: app.extra ?? null,
      status: app.status.toLowerCase() as 'pending' | 'accepted' | 'rejected',
      portfolio: app.portfolio,
      gigId: app.gigId,
      userId: app.userId,
      createdAt: app.createdAt.toISOString(),
      user: app.user
        ? {
            id: app.user.id,
            name: app.user.name,
            email: app.user.email,
            college: app.user.college,
            department: app.user.department,
            gradYear: app.user.gradYear,
            phone: null,
            type: 'student' as const,
            createdAt: '',
          }
        : undefined,
    })),
  }));
}

export async function getAppliedGigs(userId: string): Promise<Application[]> {
  const apps = await prisma.application.findMany({
    where: { userId },
    include: { gig: true },
    orderBy: { createdAt: 'desc' },
  });

  return apps.map((app) => ({
    id: app.id,
    reason: app.reason,
    experience: app.experience,
    extraInfo: app.extra ?? null,
    status: app.status.toLowerCase() as 'pending' | 'accepted' | 'rejected',
    portfolio: app.portfolio,
    gigId: app.gigId,
    userId: app.userId,
    createdAt: app.createdAt.toISOString(),
    gig: {
      id: app.gig.id,
      title: app.gig.title,
      description: app.gig.description,
      budget: app.gig.budget,
      category: app.gig.category,
      college: app.gig.college,
      isOpen: app.gig.isOpen,
      status: app.gig.status,
      createdAt: app.gig.createdAt.toISOString(),
      postedById: app.gig.postedById,
    },
  }));
}