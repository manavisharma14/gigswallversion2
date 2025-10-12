

// types/dashboard.ts
import { Gig, Application, User as PrismaUser } from "@prisma/client";

export type SerializedUser = Omit<PrismaUser, "createdAt" | "updatedAt" | "otpExpires" | "password"> & {
  createdAt: string;
  updatedAt: string;
  otpExpires: string | null;
};

export type SerializedApplication = Omit<Application, "createdAt" | "reason" | "experience" | "portfolio" | "extra"> & {
  createdAt: string;
  reason: string | null;
  experience: string | null;
  portfolio: string | null;
  extra: string | null;
  gig?: SerializedGig; // for applied gigs
  user?: SerializedUser; // for posted gigs
};

export type SerializedGig = Omit<Gig, "createdAt"> & {
  createdAt: string;
  postedBy?: SerializedUser; 
  applications?: SerializedApplication[];
};