// app/api/gigs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
// import { sendNewGigEmail } from "@/lib/email/sendNewGigEmail";
import { createEmbedding } from "@/lib/ai/embed"



const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { title, description, budget, category, college } = await req.json();

    const token = await getToken({ req });
    const userId = token?.id as string;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

        const gigText = `

Title: ${title}

Description: ${description}

Category: ${category}

Budget: ${budget}

College: ${college}

`;

// generate embedding 

    const aiGigEmbedding = await createEmbedding(gigText)

    // 1. Create the gig
    const newGig = await prisma.gig.create({
      data: {
        title,
        description,
        budget,
        category,
        college,
        postedById: userId,
        status: "open",

        aiGigEmbedding,

        aiGigUpdatedAt: new Date(),

        aiEmbeddingVersion:

          "text-embedding-3-small",
      },
    });

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