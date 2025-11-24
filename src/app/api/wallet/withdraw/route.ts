// POST /api/wallet/withdraw → Request withdrawal
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauth' }, { status: 401 });

  const { amount } = await req.json();
  if (!amount || amount < 100) {
    return NextResponse.json({ error: 'Min ₹1' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { walletBalance: true },
  });

  if (!user || user.walletBalance < amount) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.user.id },
      data: { walletBalance: { decrement: amount } },
    });

    await tx.withdrawRequest.create({
      data: {
        userId: session.user.id,
        amount,
        status: 'pending',
      },
    });

    await tx.walletTransaction.create({
      data: {
        userId: session.user.id,
        amount,
        type: 'debit',
        source: 'withdrawal_request',
        description: 'Withdrawal requested',
      },
    });
  });

  return NextResponse.json({ success: true });
}