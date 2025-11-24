// app/api/applications/[id]/request-changes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.application.update({
    where: { id },
    data: { workSubmitted: false }, // reopen for delivery
  });
  return NextResponse.json({ ok: true });
}