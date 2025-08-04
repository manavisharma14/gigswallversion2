// utils/getUserServerSide.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { AuthUser } from "@/types/types";

export async function getUserServerSide(): Promise<AuthUser | null> {
  const cookieStore = await cookies(); // ✅ Await is correct in Edge
  const token = cookieStore.get("token")?.value;

  if (!token || !process.env.NEXTAUTH_SECRET) return null;
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET) as {
      id: string;
      type?: "student" | "other";
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        college: true,
        department: true,
        gradYear: true,
        phone: true,
        createdAt: true,
      },
    });

    if (user) {
      return {
        ...user,
        createdAt: user.createdAt.toISOString(),
      } as AuthUser;
    }
    return null;
  } catch  {
    return null;
  }
}