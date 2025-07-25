import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '../../../../lib/prisma'; // Adjust the import path as necessary

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gigId = searchParams.get('gigId');
  const posterId = searchParams.get('posterId');
  const applicantId = searchParams.get('applicantId');

  if (!gigId || !posterId || !applicantId) {
    return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
  }

  try {
    const exists = await prisma.message.findFirst({
      where: {
        gigId,
        sender: posterId,
        


    },
    });

    return NextResponse.json({ exists: !!exists });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}