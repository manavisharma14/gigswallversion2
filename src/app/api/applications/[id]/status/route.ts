import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust path if needed

// Use dynamic routing feature of Next.js to extract `id` directly
export async function PATCH(req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }) {
  const { id: applicationId } = await params;  


  if (!applicationId || !/^[0-9a-fA-F]{24}$/.test(applicationId)) {
    return NextResponse.json({ message: 'Invalid application ID' }, { status: 400 });
  }

  const { status } = await req.json();

  // Match validStatuses to ApplicationStatus enum
  const validStatuses = ['pending', 'accepted', 'rejected'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
  }

  try {
    // Step 1: Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    // Step 2: If accepted, close the gig
    if (status === 'accepted') {
      await prisma.gig.update({
        where: { id: updatedApplication.gigId },
        data: {
          status: 'closed',
          isOpen: false,
        },
      });
    }

    return NextResponse.json({
      message: 'Status updated successfully',
      application: updatedApplication,
    });
  } catch (error) {
    console.error('[APPLICATION_STATUS_PATCH_ERROR]', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Failed to update status' }, { status: 500 });
  }
}
