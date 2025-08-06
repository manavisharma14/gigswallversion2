import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
// import { sendNewGigEmail } from "@/lib/email/sendNewGigEmail";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { title, description, budget, category, college } = await req.json();

    const token = await getToken({ req });
    const userId = token?.id as string;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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
      },
    });

    console.log("✅ New gig created:", newGig.title);

    // // 2. Get all user emails except the poster
    // const users = await prisma.user.findMany({
    //   where: { id: { not: userId } },
    //   select: { email: true },
    // });

    // console.log(`📨 Preparing to send email to ${users.length} users...`);

    // // 3. Send email to each user
    // await Promise.all(
    //   users.map((user) =>
    //     sendNewGigEmail({
    //       to: user.email,
    //       gigTitle: title,
    //       gigDescription: description,
    //     })
    //   )
    // );

    // console.log("📬 All emails sent successfully.");
    // return NextResponse.json(newGig, { status: 201 });

  } catch (error) {
    console.error(" Error in posting gig:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
