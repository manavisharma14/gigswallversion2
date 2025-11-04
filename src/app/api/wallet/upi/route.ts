import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const { upiId } = await req.json();
  const session = await getServerSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.user.update({
    where: { email: session.user.email ?? "" },
    data: { upiId }
  });

  return Response.json({ success: true });
}