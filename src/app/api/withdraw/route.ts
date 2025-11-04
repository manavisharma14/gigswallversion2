// app/api/withdraw/route.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { amount } = await req.json()
  const userId = session.user.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { walletBalance: true, upiId: true },
  })

  if (!user?.upiId)
    return NextResponse.json({ error: 'Set UPI ID first' }, { status: 400 })

  if (!user.walletBalance || user.walletBalance < 100)
    return NextResponse.json({ error: 'Min ₹100 required' }, { status: 400 })

  if (amount > user.walletBalance)
    return NextResponse.json({ error: 'Amount exceeds balance' }, { status: 400 })

  await prisma.$transaction([
    prisma.withdrawRequest.create({
      data: { userId, amount, status: 'pending' },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { walletBalance: { decrement: amount } },
    }),
  ])

  revalidatePath('/dashboard')
  revalidatePath('/earnings')
  return NextResponse.json({ success: true })
}