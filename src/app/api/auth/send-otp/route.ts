// src/app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendOTPEmail } from '@/lib/mailer';



export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // Delete existing pending user if any
  await prisma.pendingUser.deleteMany({ where: { email } });

  // Create new pending user
  await prisma.pendingUser.create({
    data: {
      email,
      otpCode: hashedOtp,
      otpExpires,
    },
  });

  // Send OTP email
  await sendOTPEmail(email, otp); // implement this in mailer.ts

  return NextResponse.json({ message: 'OTP sent successfully!' });
}