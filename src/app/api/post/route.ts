// app/api/gigs/route.ts
import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
// import { sendNewGigEmail } from "@/lib/email/sendNewGigEmail";
import { qstash } from "@/lib/qstash"

// const prisma = new PrismaClient();
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis"

export async function POST(req: NextRequest) {
  try {
    const { title, description, budget, category, college } = await req.json();

    const token = await getToken({ req });
    const userId = token?.id as string;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const newGig = await prisma.gig.create({
      data: {
        title,
        description,
        budget,
        category,
        college,
        postedById: userId,
        status: "open",
      },
    });

    await redis.del('gigs:feed')

    try{
      await qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/process-gig`,
      body: { gigId: newGig.id}
    })
    } catch(err: unknown){
      console.error("Queue failed", err);
    }

    console.log("✅ New gig created:", newGig.title);

    // // 2. Get only student users (exclude the poster)
    // const studentUsers = await prisma.user.findMany({
    //   where: { 
    //     id: { not: userId },
    //     type: "student"  // ✅ Only students
    //   },
    //   select: { email: true },
    // });

    // console.log(`📨 Sending email to ${studentUsers.length} students...`);

    // // 3. Send emails
    // await Promise.all(
    //   studentUsers.map((user) =>
    //     sendNewGigEmail({
    //       to: user.email,
    //       gigTitle: title,
    //       gigDescription: description,
    //     })
    //   )
    // );

    // console.log("📬 All student emails sent successfully.");
    return NextResponse.json(newGig, { status: 201 });

  } catch (error) {
    console.error("❌ Error in posting gig:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}