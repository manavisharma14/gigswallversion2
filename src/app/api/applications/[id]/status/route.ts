import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: applicationId } = await params;

  if (!applicationId || !/^[0-9a-fA-F]{24}$/.test(applicationId)) {
    return NextResponse.json({ message: 'Invalid application ID' }, { status: 400 });
  }

  const { status } = await req.json();

  const validStatuses = ['pending', 'accepted', 'rejected'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
  }

  try {
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    // ✅ No gig closing here — only update application
    return NextResponse.json({
      message: 'Application status updated successfully',
      application: updatedApplication,
    });
  } catch (error) {
    console.error('[APPLICATION_STATUS_PATCH_ERROR]', error);
    return NextResponse.json({ message: 'Failed to update status' }, { status: 500 });
  }
}