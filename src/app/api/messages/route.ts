import { prisma } from '../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { gigId, message, sender, recipient } = await req.json();

  if (!gigId || !message || !sender || !recipient) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newMessage = await prisma.message.create({
      data: { gigId, message, sender, recipient },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const gigId = searchParams.get('gigId'); // Correct way to get query parameters

  if (!gigId) {
    return NextResponse.json({ error: 'Missing gigId parameter' }, { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { gigId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
