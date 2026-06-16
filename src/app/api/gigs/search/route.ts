// search route
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { createEmbedding } from '@/lib/ai/embed'
import { cosineSimilarity } from '@/lib/ai/cosine'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q")?.trim();

        if (!query) {
            return NextResponse.json({ error: "missing search param" }, { status: 400 })
        }

        const normalizedQuery = query.toLowerCase().trim();

        const cacheKey = `search:v2:${normalizedQuery}`;

        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log(`search cache hit: ${normalizedQuery}`);

            return NextResponse.json(
                {
                    gigs: cached,
                    source: "cache"
                },
                { status: 200 }
            );
        }

        // generate query embedding

        const embeddingCacheKey = `embedding:${normalizedQuery}`
        const cachedEmbedding = await redis.get<number[]>(embeddingCacheKey)

        let queryEmbedding: number[];

        if (cachedEmbedding) {
            queryEmbedding = cachedEmbedding;

            console.log(`embedding cache hit : ${normalizedQuery}`)
        } else {
            queryEmbedding = await createEmbedding(normalizedQuery)

            await redis.set(
                embeddingCacheKey,
                queryEmbedding,
                {
                    ex: 60 * 60 * 24 * 7 // 7 days 
                }
            );

            console.log(`embedding cache miss ${normalizedQuery}`)
        }


        // fetch gigs
        const gigs = await prisma.gig.findMany({
            where: {
                status: "open"
            },
            select: {
                id: true,
                title: true,
                description: true,
                category: true,
                budget: true,
                createdAt: true,
                status: true,
                isOpen: true,
                aiGigEmbedding: true
            },
            orderBy: { createdAt: "desc" },
            take: 50
        })

        const ranked = gigs
            .map((gig) => {
                const score = cosineSimilarity(
                    queryEmbedding,
                    gig.aiGigEmbedding as number[]
                );

                const safeGig = {
                    id: gig.id,
                    title: gig.title,
                    description: gig.description,
                    category: gig.category,
                    budget: gig.budget,
                    createdAt: gig.createdAt,
                    status: gig.status,
                    isOpen: gig.isOpen,
                };

                return {
                    ...safeGig,
                    score,
                };
            })
            .filter((gig) => gig.score > 0.20)
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);
        await redis.set(cacheKey, ranked, { ex: 120 });

        return NextResponse.json({ gigs: ranked, source: "db" }, { status: 200 })
    } catch (error) {

        console.error("Search route error:", error);

        return NextResponse.json(

            { error: "Failed to search gigs" },

            { status: 500 }

        );

    }

}