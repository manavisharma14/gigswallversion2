import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST() {
  const session = await getServerSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const email = session?.user?.email;
  if (!email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: email }
  });

  if (!user) return Response.json({ error: "User not found" }, { status: 404 });


  if (user.walletBalance <= 0)
    return Response.json({ error: "No balance to withdraw" }, { status: 400 });

  await prisma.withdrawRequest.create({
    data: {
      userId: user.id,
      amount: user.walletBalance,
      status: "pending"
    }
  });

  // Zero wallet balance after request
  await prisma.user.update({
    where: { id: user.id },
    data: { walletBalance: 0 }
  });

  return Response.json({ success: true });
}