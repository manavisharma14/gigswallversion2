// app/api/payment/verify/route.ts
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    gigId,
    studentId,
    applicationId, 
  } = body

  // --- 1. Validate input ---
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !applicationId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // --- 2. Verify Razorpay signature ---

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // --- 3. Find application by ID (reliable) ---
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { gig: true },
  })

  if (!application || application.gigId !== gigId || application.userId !== studentId) {
    return NextResponse.json({ error: 'Application not found or mismatch' }, { status: 404 })
  }

  // --- 4. Update: Accept + Paid + Escrow ---
  await prisma.application.update({
    where: { id: application.id },
    data: {
      status: 'accepted',           // ← Applicant sees "Accepted"
      paymentStatus: 'paid',        // ← Funds secured
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      escrow: true,
    },
  })

  // --- 5. Revalidate dashboards ---
  revalidatePath('/dashboard/posted')
  revalidatePath('/dashboard/applied')

  return NextResponse.json({ success: true })
}