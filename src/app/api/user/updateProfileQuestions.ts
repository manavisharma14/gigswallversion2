import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // adjust import to your setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { userId, ...answers } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        profileQuestions: answers,
        profileCompleted: true,
      },
    });

    res.status(200).json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}