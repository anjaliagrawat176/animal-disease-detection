import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phoneno,
      password,
      confirmpassword,
    } = body;

    if (
      !name ||
      !email ||
      !password ||
      !confirmpassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are required",
        },
        { status: 400 }
      );
    }

    if (password !== confirmpassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phoneno,
        password,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneno: user.phoneno,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}