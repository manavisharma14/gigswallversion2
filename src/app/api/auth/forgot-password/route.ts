import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Always return same response for security (to avoid email enumeration)
      return NextResponse.json({ message: 'If user exists, password reset email sent' });
    }

    const secret = process.env.NEXTAUTH_SECRET! + user.password;
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '15m' });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}&id=${user.id}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"GigsWall Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your GigsWall password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password. This link will expire in 15 minutes:</p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 20px;
           background:#4CAF50;color:#fff;border-radius:5px;text-decoration:none;">
           Reset Password
        </a>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'If user exists, password reset email sent' });
  } catch (err) {
    console.error('Password reset error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 