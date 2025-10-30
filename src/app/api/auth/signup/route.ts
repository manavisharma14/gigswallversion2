import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, type, college, department, gradYear } = body;

    if (!name || !email || !password || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["student", "business", "other"].includes(type)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone,
        type,
        college: type === "student" ? college : null,
        department: type === "student" ? department : null,
        gradYear: type === "student" ? gradYear : null,
        isVerified: type === "business" ? true : false,
      },
    });

    return NextResponse.json({ message: "User created", user }, { status: 201 });
  } catch (err) {
    console.error("Signup error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}