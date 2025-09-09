import jwt, { JsonWebTokenError, TokenExpiredError, JwtPayload } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export interface DecodedToken {
  id: string;
  email?: string;
  type?: 'student' | 'other';
  iat?: number;
  exp?: number;
}

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (!k) continue;
    out[k] = decodeURIComponent(rest.join('=') || '');
  }
  return out;
}

// ✅ Ensure secret is a string (fixes TS error)
const JWT_SECRET: string = (() => {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error('NEXTAUTH_SECRET is not set');
  return s;
})();

export async function getUserFromToken(
  req: Request
): Promise<{ userId: string; type?: 'student' | 'other' } | NextResponse> {
  // 1) Authorization: Bearer <token>
  const authHeader = req.headers.get('authorization');
  let token: string | undefined;
  if (authHeader) {
    const [scheme, raw] = authHeader.split(/\s+/);
    if (scheme?.toLowerCase() === 'bearer' && raw) token = raw.trim();
  }

  // 2) Fallback: cookie 'token'
  if (!token) {
    const cookies = parseCookies(req.headers.get('cookie'));
    token = cookies.token;
  }

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized - No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload | string;
    if (typeof decoded === 'string') {
      return NextResponse.json({ message: 'Unauthorized - Invalid token payload' }, { status: 401 });
    }

    const id = (decoded as JwtPayload & { id?: string }).id;
    const type = (decoded as JwtPayload & { type?: 'student' | 'other' }).type;

    if (!id) {
      return NextResponse.json({ message: 'Unauthorized - Invalid token payload' }, { status: 401 });
    }

    return { userId: id, type };
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return NextResponse.json({ message: 'Token expired' }, { status: 401 });
    if (error instanceof JsonWebTokenError)
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    return NextResponse.json({ message: 'Token error' }, { status: 500 });
  }
}