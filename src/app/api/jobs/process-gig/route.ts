import { NextRequest, NextResponse} from 'next/server'
import { prisma } from "@/lib/prisma"
import { createEmbedding } from "@/lib/ai/embed"

export async function POST(req: NextRequest){
    try{
        const body = await req.json();
    const { gigId } = body;

    if(!gigId){
        return NextResponse.json({ error: "gig id is required"}, { status: 400})
    }

    const gig = await prisma.gig.findUnique({
        where : {id: gigId}
    })

    if(!gig){
        return NextResponse.json({ error: "gig not found"}, { status: 404})
    }

    //idempotency check
    if(
        gig.aiGigEmbedding &&
        Array.isArray(gig.aiGigEmbedding) &&
        gig.aiGigEmbedding?.length > 0
    ) {
        return NextResponse.json({success: true, message: "Already processed"})
    }

    const gigText = `
    Title: ${gig.title ?? ""}
    Description: ${gig.description ?? ""}
    Category: ${gig.category ?? ""}
    Budget: ${gig.budget ?? ""}
    College: ${gig.college ?? ""}`


    const embedding = await createEmbedding(gigText)

    await prisma.gig.update({
        where: {id: gigId},
        data: {
            aiGigEmbedding: embedding,
            aiGigUpdatedAt: new Date(),
            aiEmbeddingVersion: "text-embedding-3-small"
        }
    })

    console.log(`Gig ${gigId} processed`);

    return NextResponse.json({success: true, gigId})
    }
    catch(error){
        console.error("error", error)
        return NextResponse.json({ error: "worker failed"}, { status: 500})
    }


}

