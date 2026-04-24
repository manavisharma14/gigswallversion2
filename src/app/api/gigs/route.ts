export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/getUserFromServer';
import { createEmbedding } from '@/lib/ai/embed';
// import { sendNewGigEmail } from '@/lib/email/sendNewGigEmail';
import { redis } from "@/lib/redis"

const prisma = new PrismaClient();

export async function GET() {
  try {

    const cacheKey = 'gigs:feed'

    const cachedGigs = await redis.get(cacheKey);

    if(cachedGigs){
      console.log("returning gigs from redis cache")

      return NextResponse.json({gigs: cachedGigs, source: 'cache'}, { status: 200})
    }

    // if not cached
    const gigs = await prisma.gig.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        postedBy: {
          select: { id: true, name: true, email: true, college: true },
        },
      },
    });

    await redis.set(cacheKey, gigs, {
      ex: 60
    });

    console.log('returned gigs from mongodb and + cached')

    return NextResponse.json({ gigs, source: 'db' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching gigs:', error);
    return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  // ✅ Authentication
  const userOrResponse = await getUserFromToken();
  if (!('userId' in userOrResponse)) {
    return userOrResponse;
  }
  const { userId } = userOrResponse;

  

  try {
    const body = await req.json();
    const { title, description, budget, category, college } = body;

    const gigText = `
  Title: ${title}
  Description: ${description}
  Category: ${category}
  Budget: ${budget}
  College: ${college}
  `;

const aiGigEmbedding = await createEmbedding(gigText);

console.log("Gig Embedding Length:", aiGigEmbedding.length);

    //  Basic validation
    if (!title || !description || !budget || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, budget, category' },
        { status: 400 }
      );
    }

    //  If college isn't passed, fetch from user's profile
    let gigCollege = college;
    if (!gigCollege) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { college: true },
      });
      gigCollege = user?.college ?? 'Unknown';
    }

    //  Create gig
    const newGig = await prisma.gig.create({
  data: {
    title,
    description,
    budget: parseInt(budget),
    category,
    college: gigCollege,
    postedById: userId,
    status: 'open',

    aiGigEmbedding,
    aiGigUpdatedAt: new Date(),
    aiEmbeddingVersion: "text-embedding-3-small",
  },
});

    console.log(` Gig created: ${newGig.title} | postedById: ${userId}`);

    //   Return response immediately
     const response = NextResponse.json(newGig, { status: 201 });

    //  Send emails in background (non-blocking)
    // setTimeout(async () => {
    //   try {
    //     const users = await prisma.user.findMany({
    //       where: {
    //         id: { not: userId },
    //         type: 'student',
    //         email: { not: '' },
    //       },
    //       select: { email: true },
    //     });

    //     await Promise.all(
    //       users
    //         .filter((u) => u.email)
    //         .map((user) =>
    //           sendNewGigEmail({
    //             to: user.email!,
    //             gigTitle: title,
    //             gigDescription: description,
    //           })
    //         )
    //     );

    //     console.log(` Notification emails sent to ${users.length} users.`);
    //   } catch (e) {
    //     console.error(' Error sending notification emails:', e);
    //   }
    // }, 0);

     return response;
  } catch (error) {
    console.error(' Error posting gig:', error);
    return NextResponse.json({ error: 'Failed to create gig' }, { status: 500 });
  }
}