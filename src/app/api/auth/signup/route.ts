import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserType, GigPreference } from '@prisma/client';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, password,
      phone, department, gradYear,
      gigPreference, college, type,
    } = body;

    if (type === 'student') {
      if (!email.endsWith('.edu')) {
        return NextResponse.json({ error: 'Students must register with a .edu email address' }, { status: 400 });
      }
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        type: type as UserType,
        isVerified: false,
        gigPreference: type === 'student' ? gigPreference as GigPreference : null,
        phone:        type === 'student' ? phone       : null,
        department:   type === 'student' ? department  : null,
        gradYear:     type === 'student' ? gradYear    : null,
        college:      type === 'student' ? college     : null,
      },
    });

    // ✅ Include `name` in token for SSR use if needed
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: user.type,
        name: user.name, // ✅ Add this for instant nav rendering
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const res = NextResponse.json(
      {
        message: 'Signup successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
          phone: user.phone,
          department: user.department,
          gradYear: user.gradYear,
          college: user.college,
          createdAt: user.createdAt.toISOString(),
        },
        token,
      },
      { status: 201 }
    );

    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}