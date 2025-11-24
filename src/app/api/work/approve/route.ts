// app/api/work/approve/route.ts
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const { gigId, applicationId } = await req.json()

  if (!gigId || !applicationId)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gig: true, user: true },
  })

  if (!application || application.gigId !== gigId)
    return NextResponse.json({ error: 'Invalid application' }, { status: 404 })

  if (application.paymentStatus !== 'paid')
    return NextResponse.json({ error: 'Payment not secured' }, { status: 400 })

  const amount = Number(application.amount ?? application.gig.budget)

  const currentBalance = application.user.walletBalance ?? 0
  const newBalance = currentBalance + amount

  await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: {
        completed: true,
        workSubmitted: false,

        paymentStatus: 'released',
      },
    }),
    prisma.user.update({
      where: { id: application.userId },
      data: { walletBalance: newBalance }, // ✅ direct update for MongoDB
    }),
    prisma.walletTransaction.create({
      data: {
        userId: application.userId,
        amount,
        type: "credit",
        source: "gig_payment",
        description: `Payment for gig: ${application.gig.title}`,
      },
    }),
  ])

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/earnings')

  return NextResponse.json({ success: true })
}