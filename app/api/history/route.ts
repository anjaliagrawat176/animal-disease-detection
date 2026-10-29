import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

    const predictions = await prisma.prediction.findMany({
      where: {
        userId: userId,
      },
      include: {
        animal: true,
        disease: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: predictions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("History error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch prediction history",
      },
      { status: 500 }
    );
  }
}