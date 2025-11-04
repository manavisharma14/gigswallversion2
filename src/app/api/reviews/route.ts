import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        return NextResponse.json({ error : 'Unauthorised'},  {status: 401})
    }

    const { applicationId, rating, reviewText } = await req.json();

    if(!applicationId || !rating || rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Invalid payload"}, {status: 400})
    }

    const app = await prisma.application.findUnique({
        where: { id : applicationId},
        include: {
            gig: true,
            user: true
        }
    })

    if(!app) return NextResponse.json({ error: "Application not found"}, {status: 401});
    if(!app.completed){
        return NextResponse.json({ error: "Gig not completed yet"}, {status: 400})
    }

    // the client is the gig poster
    const gig = app.gig;
    const clientId = gig.postedById
    const freelancerId = app.userId;

    // prevent duplicate review
    const existing = await prisma.review.findFirst({
        where: {gigId: gig.id, clientId, freelancerId}
    })

    if(existing){
        return NextResponse.json({ error : "Review already submitted for this gig"}, {status: 400});
    }

    // update stats automatically
    const result = await prisma.$transaction(async (tx) => {
        const review = await tx.review.create({
            data: {
                gigId: gig.id,
                clientId,
                freelancerId,
                rating,
                reviewText: reviewText?.trim() || null,
            }
        })
        const freelancer = await tx.user.findUnique({
            where: {id: freelancerId},
            select: {
                averageRating: true,
                totalRatings: true,
                completedGigs: true
            }
        })

        const currentAvg = freelancer?.averageRating ?? 0;
        const currentCount = freelancer?.totalRatings ?? 0;

        // now rolling average
        const newCount = currentCount + 1;
        const newAvg = Number((currentAvg * currentCount + rating) / newCount).toFixed(2);

        await tx.user.update({
            where: {id: freelancerId},
            data: {
                averageRating: parseFloat(newAvg),
                totalRatings: newCount,
                completedGigs: (freelancer?.completedGigs ?? 0) + 1
            }
        })
        return review;
    })
    return NextResponse.json({success: true , review: result})
}