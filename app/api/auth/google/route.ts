import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";

type GoogleTokenInfo = {
  aud?: string;
  email?: string;
  email_verified?: string;
  name?: string;
  sub?: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const credential = body.credential;

    if (!credential) {
      return NextResponse.json(
        {
          success: false,
          message: "Google credential is required",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // VERIFY GOOGLE ID TOKEN
    // ==========================================

    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
        credential
      )}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!googleResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Google credential",
        },
        { status: 401 }
      );
    }

    const googleUser =
      (await googleResponse.json()) as GoogleTokenInfo;

    // ==========================================
    // CHECK AUDIENCE
    // ==========================================

    if (
      googleUser.aud !==
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Google client ID mismatch",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // BASIC GOOGLE DATA VALIDATION
    // ==========================================

    if (
      !googleUser.email ||
      !googleUser.name ||
      !googleUser.sub
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to get required Google account information",
        },
        { status: 400 }
      );
    }

    if (googleUser.email_verified !== "true") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google email is not verified",
        },
        { status: 401 }
      );
    }

    const email =
      googleUser.email.trim().toLowerCase();

    // ==========================================
    // FIND EXISTING USER
    // ==========================================

    let user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    // ==========================================
    // CREATE USER IF NOT EXISTS
    // ==========================================

    if (!user) {
      const randomPassword =
        crypto.randomBytes(32).toString("hex");

      user = await prisma.user.create({
        data: {
          name: googleUser.name,
          email,
          password: randomPassword,
          phoneno: null,
        },
      });
    }

    // ==========================================
    // SET LOGIN COOKIE
    // ==========================================

    const cookieStore = await cookies();

    cookieStore.set("userId", user.id, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json(
      {
        success: true,
        message: "Google login successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Google login error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong during Google login",
      },
      { status: 500 }
    );
  }
}