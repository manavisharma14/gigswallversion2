import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      name,
      type,        // "student" or "other"
      phone,
      department,
      gradYear,
      college,
    } = body;

    if (!email || !password || !name || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        type,
        phone: type === "student" ? phone : null,
        department: type === "student" ? department : null,
        gradYear: type === "student" ? gradYear : null,
        college: type === "student" ? college : null,
      },
    });

    return NextResponse.json({ message: "User created", user }, { status: 201 });
  } catch (err) {
    console.error("Signup error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}