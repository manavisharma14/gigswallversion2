import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { applicationId } = await req.json();

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  // Mark work as approved + payment released
  await prisma.application.update({
    where: { id: applicationId },
    data: {
      paymentStatus: "released",
      completed: true,
    },
  });

  const studentId = application.userId;
  const amount = application.amount || 0;

  // ✅ Add money into student's wallet
  await prisma.user.update({
    where: { id: studentId },
    data: {
      walletBalance: {
        increment: amount
      }
    }
  });

  // ✅ Create wallet transaction
  await prisma.walletTransaction.create({
    data: {
      userId: studentId,
      amount: amount,
      type: "credit",
      source: "gig_payment",
      description: `Payment released for gig ${application.gigId}`,
    },
  });

  return NextResponse.json({ success: true, message: "Payment released & wallet updated" });
}