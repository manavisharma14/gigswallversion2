import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

    if (!user.otpCode || !user.otpExpires)
      return NextResponse.json({ error: "OTP not generated" }, { status: 400 });

    if (user.otpExpires < new Date())
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });

    if (user.otpCode !== otp)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    await prisma.user.update({
      where: { email },
      data: {
        otpCode: null,
        otpExpires: null,
        isVerified: true,
        emailVerified: new Date(),
      }
    });

    return NextResponse.json({ message: "OTP verified ✅" });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}