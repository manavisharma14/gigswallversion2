import { prisma } from '../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// POST a new message
export async function POST(req: NextRequest) {
  const { gigId, roomId, message, sender, recipient } = await req.json();

  if (!gigId || !roomId || !message || !sender || !recipient) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Prevent duplicate message in same room by same sender
    const existingMessage = await prisma.message.findFirst({
      where: {
        roomId,
        gigId,
        message,
        sender,
        recipient,
        createdAt: {
          gte: new Date(Date.now() - 5000), // prevent duplicates within 5s
        },
      },
    });

    if (existingMessage) {
      return NextResponse.json({ error: 'Duplicate message' }, { status: 400 });
    }

    // Create message
    const newMessage = await prisma.message.create({
      data: { gigId, roomId, message, sender, recipient },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}

// GET messages by roomId
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const roomId = searchParams.get('roomId');

  if (!roomId) {
    return NextResponse.json({ error: 'Missing roomId parameter' }, { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}