import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

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
        postedById: userId, // ✅ now guaranteed to be a string
      },
    });

    return NextResponse.json(newGig, { status: 201 });
  } catch (error) {
    console.error("Error posting gig:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
