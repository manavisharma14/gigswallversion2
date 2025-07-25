import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: 'If user exists, password reset email sent' });
  }

  const secret = process.env.NEXTAUTH_SECRET + user.password;
  const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '15m' });

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}&id=${user.id}`;

  // Email Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"GigsWall Support" <gigswall.work@gmail.com>',
    to: user.email,
    subject: 'Reset your GigsWall password',
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetLink}">Reset Password</a>
           <p>This link will expire in 15 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);

  return NextResponse.json({ message: 'Reset email sent' });
}