import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"
import { storage } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File;
  const roomId = form.get("roomId") as string;

  const bytes = Buffer.from(await file.arrayBuffer());
  const filePath = `chatFiles/${roomId}/${Date.now()}_${file.name}`;
  const bucketFile = storage.file(filePath);

  await bucketFile.save(bytes, {
    metadata: { contentType: file.type },
  });

  const [url] = await bucketFile.getSignedUrl({
    action: "read",
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return NextResponse.json({
    url,
    name: file.name,
    size: file.size,
    contentType: file.type,
  });
}