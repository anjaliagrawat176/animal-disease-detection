import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

// ==========================================
// GET - Logged-in User Profile
// ==========================================

export async function GET() {
  try {
    const cookieStore = await cookies();

    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneno: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Profile API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load profile",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// PUT - Update User Profile
// ==========================================

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();

    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phoneno =
      typeof body.phoneno === "string"
        ? body.phoneno.trim()
        : "";

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        phoneno: phoneno || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneno: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Profile updated successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Update Profile API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update profile",
      },
      { status: 500 }
    );
  }
}