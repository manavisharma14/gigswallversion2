import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { token, id, newPassword } = await req.json();

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: 'Invalid user' }, { status: 400 });

  const secret = process.env.NEXTAUTH_SECRET + user.password;

  try {
    jwt.verify(token, secret);
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id },
    data: { password: hashed },
  });

  return NextResponse.json({ message: 'Password reset successful' });
}