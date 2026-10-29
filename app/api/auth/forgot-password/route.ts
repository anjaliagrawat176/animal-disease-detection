import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email } = body;

    // Email required
    if (!email || !email.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    /*
      Security:
      User exist kare ya na kare,
      same success response denge.
    */
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message:
            "If this email is registered, a password reset request has been created.",
        },
        { status: 200 }
      );
    }

    // Delete old reset tokens
    await prisma.passwordReset.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Generate secure reset token
    const token = crypto.randomBytes(32).toString("hex");

    // Token valid for 15 minutes
    const expiresAt = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // Save reset request
    await prisma.passwordReset.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    /*
      Development/demo purpose:
      Abhi email service nahi lagi hai,
      isliye reset URL response me bhej rahe hain.

      Production me isi URL ko email ke through
      user ko bhejna hoga.
    */
    const resetUrl = `/reset-password?token=${encodeURIComponent(
      token
    )}`;

    return NextResponse.json(
      {
        success: true,
        message: "Password reset link generated successfully.",
        resetUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}