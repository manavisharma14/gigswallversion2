// app/api/uploads/chat-delivery/route.ts
import { NextRequest, NextResponse } from "next/server";

// Example placeholder: you should swap in real storage (S3/Firebase Admin SDK)
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const roomId = form.get("roomId") as string | null;
  if (!file || !roomId) {
    return NextResponse.json({ error: "Missing file or roomId" }, { status: 400 });
  }

  // TODO: Implement server upload to your storage of choice.
  // For demo, pretend we uploaded successfully:
  const fileUrl = `/uploads/${encodeURIComponent(file.name)}`;
  return NextResponse.json({ fileUrl, name: file.name, size: file.size });
}