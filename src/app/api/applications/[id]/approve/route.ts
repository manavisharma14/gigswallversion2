// app/api/applications/[id]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust import

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.application.update({
    where: { id },
    data: { completed: true },
  });
  return NextResponse.json({ ok: true });
}