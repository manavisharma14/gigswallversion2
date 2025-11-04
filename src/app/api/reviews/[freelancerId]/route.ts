import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params } : { params : Promise<{freelancerId : string}>}
) {
    const { freelancerId } = await params;

    const [user, reviews] = await Promise.all([
        prisma.user.findUnique({
            where: {id : freelancerId},
            select: { averageRating: true, totalRatings: true, completedGigs: true, name: true, id: true}
        }),
        prisma.review.findMany({
            where: {freelancerId},
            orderBy: {createdAt: "desc"},
            include: {
                gig: {
                    select: {
                        title: true,
                        id: true
                    }
                }
            }
        })
    ])

    if(!user){
        return NextResponse.json({ error : "User not found"}, {status: 404})
    }

    return NextResponse.json({
        stats: {
            averageRating: user.averageRating,
            totalRatings: user.totalRatings,
            completedGigs: user.completedGigs
        },
        reviews: reviews.map(r => ({
            id: r.id,
            rating: r.rating,
            reviewText: r.reviewText,
            createdAt: r.createdAt,
            gig: r.gig
        }))
    })

}