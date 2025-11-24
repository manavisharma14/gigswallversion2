// src/types/prisma.ts
import { Prisma } from '@prisma/client';

export type User = {
  id: string;
  name: string | null;
  email: string;
  college: string | null;
  department: string | null;
  gradYear: string | null;  // changed to string based on your API response
  phone: string | null;
  walletBalance: number;
  type: string;
  totalRatings: number,
  completedGigs: number,
  createdAt: Date;
};

// ────── GIG WITH FULL APPLICANTS (for poster view) ──────
export type GigWithRelations = Prisma.GigGetPayload<{
  include: {
    applications: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            email: true;
            college: true;
            department: true;
            gradYear: true;
            phone: true;
            totalRatings: true;
            completedGigs: true;
            walletBalance: true;
            type: true;
          };
        };
      };
    };
  };
}>;

// ────── APPLICATION WITH FULL GIG + USER (used everywhere) ──────
export type ApplicationWithRelations = Prisma.ApplicationGetPayload<{
  include: {
    gig: {
      include: {
        applications: {
          include: {
            user: {
              select: {
                id: true;
                name: true;
                email: true;
                college: true;
                department: true;
                gradYear: true;
                phone: true;
                walletBalance: true;
                type: true;
              };
            };
          };
        };
      };
    };
    user: {
      select: {
        id: true;
        name: true;
        email: true;
        college: true;
        department: true;
        gradYear: true;
        phone: true;
        walletBalance: true;
        type: true;
      };
    };
  };
}>;