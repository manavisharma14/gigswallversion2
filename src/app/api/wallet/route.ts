// app/api/wallet/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      walletTransactions: { orderBy: { createdAt: "desc" } },
      withdrawRequests: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  return Response.json({
    walletBalance: user.walletBalance,
    upiId: user.upiId,
    transactions: user.walletTransactions,
    withdrawals: user.withdrawRequests
  });
}