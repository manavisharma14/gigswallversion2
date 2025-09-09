import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;
if (!JWT_SECRET) throw new Error('NEXTAUTH_SECRET is not set');

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });

    const token = jwt.sign({ id: user.id, email: user.email, type: user.type }, JWT_SECRET, {
      expiresIn: '7d',
      algorithm: 'HS256',
    });

    const userPublic = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      phone: user.phone,
      department: user.department,
      gradYear: user.gradYear,
      college: user.college,
      createdAt: user.createdAt,
    };

    const res = NextResponse.json({ message: 'Login successful', user: userPublic, token }, { status: 200 });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7d
    });
    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}