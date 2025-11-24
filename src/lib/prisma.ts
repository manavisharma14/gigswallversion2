// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// ──────────────────────────────────────────────────────────────────────
// 1. Prisma client (singleton)
// ──────────────────────────────────────────────────────────────────────
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// ──────────────────────────────────────────────────────────────────────
// 2. Re-export ALL Prisma types
// ──────────────────────────────────────────────────────────────────────
export type {
  Gig,
  Application,
  User,
  ApplicationStatus,
  EscrowStatus,
} from '@prisma/client';