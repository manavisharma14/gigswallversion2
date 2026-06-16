import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"
import { createEmbedding } from "@/lib/ai/embed"

import {
    cosineSimilarity,
    similarityToPercent
} from "@/lib/ai/cosine"

export async function POST(req: NextRequest) {
    try {
        const { applicationId } = await req.json();

        const application = await prisma.application.findUnique({
            where: { id: applicationId },
        })

        if (!application) {
            return NextResponse.json(
                { error: "application not found" },
                { status: 404 }
            )
        }

        if (
            application.applicationEmbedding &&
            application.applicationEmbedding.length > 0
        ) {
            return NextResponse.json({
                success: true,
                message: "already processed",
            });
        }

        const gig = await prisma.gig.findUnique({
            where: { id: application.gigId },
        })

        if (!gig) {
            return NextResponse.json(
                { error: "gig not found" },
                { status: 404 }
            )
        }

        const combinedText = `
        Reason ${application.reason ?? ""}
        Experience ${application.experience ?? ""}
        Portfolio: ${application.portfolio ?? ""}
        Extra: ${application.extra ?? ""}
        `;

        const embedding = await createEmbedding(combinedText);

        let semanticMatchScore = 0;

        if (
            gig.aiGigEmbedding?.length &&
            embedding.length
        ) {
            const similarity = cosineSimilarity(
                embedding,
                gig.aiGigEmbedding
            );

            semanticMatchScore =
                similarityToPercent(similarity);
        }

        await prisma.application.update({
            where: { id: applicationId },
            data: {
                applicationEmbedding: embedding,
                semanticMatchScore,
                aiScoredAt: new Date(),
                aiModelVersion: "text-embedding-3-small"
            }
        });

        console.log(
            `Application ${applicationId} scored successfully: ${semanticMatchScore}`
        );

        return NextResponse.json({
            success: true,
        })

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "worker failed" },
            { status: 500 }
        );
    }
}