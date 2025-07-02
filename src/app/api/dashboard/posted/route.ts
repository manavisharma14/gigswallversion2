import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1]; // Extract token from Bearer <token>

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized - No token provided' }, { status: 401 });
    }

    // Verify the token using the same secret used to sign it
    const decoded: any = jwt.verify(token, process.env.NEXTAUTH_SECRET!);

    const userId = decoded?.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized - Invalid token payload' }, { status: 401 });
    }

    // Fetch gigs posted by this user
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
