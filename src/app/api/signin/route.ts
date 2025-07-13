import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      password,
      phone,
      college,
      department,
      gradYear,
      aim,
      skills,
      bio,
      role,
    } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        college,
        department,
        gradYear,
        aim,
        skills,
        bio,
        role,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      {
        message: "Signup successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          college: user.college,
          phone: user.phone,
          department: user.department,
          gradYear: user.gradYear,
          aim: user.aim,
          skills: user.skills,
          bio: user.bio,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error during signup." }, { status: 500 });
  }
}
