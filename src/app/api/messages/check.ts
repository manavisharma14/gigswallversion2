import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { gigId, posterId, applicantId } = req.query;

  if (!gigId || !posterId || !applicantId) {
    return res.status(400).json({ message: "Missing query parameters" });
  }

  console.log("🔍 Checking message for:", { gigId, posterId, applicantId });

  try {
    const messageExists = await prisma.message.findFirst({
      where: {
        gigId: gigId as string,
        sender: posterId as string,
        recipient: applicantId as string,
      },
    });

    console.log("✅ Result:", messageExists ? "Exists" : "Does NOT exist");

    return res.status(200).json({ exists: !!messageExists });
  } catch (err) {
    console.error("❌ DB Error in check:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}