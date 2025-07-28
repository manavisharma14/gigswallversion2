// src/app/api/auth/verify-otp/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();

  const pending = await prisma.pendingUser.findFirst({ where: { email } });
  if (!pending) return NextResponse.json({ error: 'No OTP request found.' }, { status: 400 });

  const isMatch = await bcrypt.compare(otp, pending.otpCode);
  const isExpired = pending.otpExpires < new Date();

  if (!isMatch || isExpired) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
  }

  // Optionally: mark verified or create User here
  await prisma.pendingUser.delete({ where: { email } });

  return NextResponse.json({ success: true, message: 'OTP verified' });
}