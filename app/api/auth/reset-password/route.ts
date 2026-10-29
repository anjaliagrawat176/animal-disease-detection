import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { token, password, confirmpassword } = body;

    // Check required fields
    if (!token || !password || !confirmpassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Token, password and confirm password are required",
        },
        { status: 400 }
      );
    }

    // Check password match
    if (password !== confirmpassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    // Find reset request
    const resetRequest = await prisma.passwordReset.findUnique({
      where: {
        token,
      },
    });

    if (!resetRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        },
        { status: 400 }
      );
    }

    // Check token expiry
    if (resetRequest.expiresAt < new Date()) {
      await prisma.passwordReset.delete({
        where: {
          id: resetRequest.id,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Reset token has expired",
        },
        { status: 400 }
      );
    }

    // Update password
    const user = await prisma.user.update({
      where: {
        id: resetRequest.userId,
      },
      data: {
        password,
      },
    });

    // Delete used reset token
    await prisma.passwordReset.delete({
      where: {
        id: resetRequest.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}