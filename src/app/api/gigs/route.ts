export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendNewGigEmail } from "../../../lib/email/sendNewGigEmail" // Make sure path is correct

const prisma = new PrismaClient();

export async function GET() {
  try {
    const gigs = await prisma.gig.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ gigs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching gigs:', error);
    return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, budget, category, college, postedById } = await req.json();

    // 1. Create gig
    const newGig = await prisma.gig.create({
      data: {
        title,
        description,
        budget: parseInt(budget),
        category,
        college,
        postedById,
        status: 'open',
      },
    });

    console.log('✅ Gig created:', newGig.title);

    // 2. Respond to user IMMEDIATELY
    const response = NextResponse.json(newGig, { status: 201 });

    // 3. Defer email sending to next event loop tick
    setTimeout(async () => {
      try {
        const users = await prisma.user.findMany({
          where: {
            id: { not: postedById },
            email: { not: "" },
          },
          select: { email: true },
        });

        await Promise.all(
          users
            .filter((u) => !!u.email)
            .map((user) =>
              sendNewGigEmail({
                to: user.email!,
                gigTitle: title,
                gigDescription: description,
              })
            )
        );

        console.log(`📬 Emails sent to ${users.length} users.`);
      } catch (e) {
        console.error('❌ Error sending emails in background:', e);
      }
    }, 0);

    return response;

  } catch (error) {
    console.error('❌ Error posting gig:', error);
    return NextResponse.json({ error: 'Failed to create gig' }, { status: 500 });
  }
}
