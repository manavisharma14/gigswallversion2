import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export interface DecodedToken {
  id: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export async function getUserFromToken(req: Request): Promise<{ userId: string } | Response> {
  const authHeader = req.headers.get('authorization');
  const cookieHeader = req.headers.get('cookie');

  // ✅ Try getting token from Authorization header first, then fallback to cookies
  const token =
    authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] :
    cookieHeader?.split('; ').find((c) => c.trim().startsWith('token='))?.split('=')[1];

  if (!token) {
    console.error('❌ No token found in Authorization header or cookies');
    return NextResponse.json({ message: 'Unauthorized - No token provided' }, { status: 401 });
  }

  if (!process.env.NEXTAUTH_SECRET) {
    console.error('❌ NEXTAUTH_SECRET is not defined');
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET, {
      algorithms: ['HS256'],
    }) as DecodedToken;

    const userId = decoded?.id;

    if (!userId) {
      console.error('❌ Invalid token: missing user ID');
      return NextResponse.json({ message: 'Unauthorized - Invalid token payload' }, { status: 401 });
    }

    return { userId };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error('⏰ Token expired:', error.message);
      return NextResponse.json({ message: 'Token expired' }, { status: 401 });
    }

    if (error instanceof JsonWebTokenError) {
      console.error('❌ JWT error:', error.message);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    console.error('❌ Unknown token error:', error);
    return NextResponse.json({ message: 'Token error' }, { status: 500 });
  }
}