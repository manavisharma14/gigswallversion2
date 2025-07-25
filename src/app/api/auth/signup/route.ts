import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      role, // "student" or "external"
      name,
      phone,
      college,
      department,
      gradYear,
      aim,
      skills,
      bio,
    } = body;

    // ✅ Basic validation
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required.' },
        { status: 400 }
      );
    }

    // ✅ Extra validation for students
    if (role === 'student') {
      if (!name || !phone || !college || !department || !gradYear) {
        return NextResponse.json(
          { error: 'Missing required student fields.' },
          { status: 400 }
        );
      }
    }

    // ✅ Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        name: role === 'student' ? name : null,
        phone: role === 'student' ? phone : null,
        college: role === 'student' ? college : null,
        department: role === 'student' ? department : null,
        gradYear: role === 'student' ? gradYear : null,
        aim: role === 'student' ? aim ?? null : null,
        skills: role === 'student' ? skills ?? null : null,
        bio: role === 'student' ? bio ?? null : null,
      },
    });

    // ✅ Create JWT using the same secret used in protected routes
    if (!process.env.NEXTAUTH_SECRET) {
      console.error('NEXTAUTH_SECRET is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.NEXTAUTH_SECRET, // 🔐 must match verification
      { expiresIn: '7d' }
    );

    // ✅ Return success
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        college: user.college,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('❌ Signup Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}