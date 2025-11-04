import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    let user = await prisma.user.findUnique({ where: { email } });

    // For fresh signup, create a temp user row if needed
    if (!user) {
      user = await prisma.user.create({ data: { email, name: "", isVerified: false } });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.update({
      where: { email },
      data: {
        otpCode: otp,
        otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for GigsWall",
      html: `<h2>Your OTP Code</h2><h1>${otp}</h1><p>Valid for 10 minutes.</p>`
    });

    return NextResponse.json({ message: "OTP Sent ✅" });
  } catch (err) {
    console.log("OTP Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}