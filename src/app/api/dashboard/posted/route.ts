import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface DecodedToken {
  id: string;
  email?: string; // optional, add more fields if your token contains them
  iat?: number;
  exp?: number;
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as DecodedToken;

    const userId = decoded?.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized - Invalid token payload' }, { status: 401 });
    }

    const gigs = await prisma.gig.findMany({
      where: { postedById: userId },
      include: {
        applications: {
          include: { user: true },
        },
      },
    });

    return NextResponse.json({ gigs });
  } catch (error) {
    console.error('Error in /api/dashboard/posted:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


