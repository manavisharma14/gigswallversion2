// app/api/work/submit/route.ts
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { applicationId } = await req.json()

    if (!applicationId)
      return NextResponse.json({ error: 'Missing applicationId' }, { status: 400 })

    await prisma.application.update({
      where: { id: applicationId },
      data: { workSubmitted: true },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}