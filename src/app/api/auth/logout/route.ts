import { NextResponse } from 'next/server';

export async function POST() {
  // Clear cookies or tokens if using them
  // Example with cookies (if you use them)
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set('token', '', { httpOnly: true, expires: new Date(0) });

  return response;
}