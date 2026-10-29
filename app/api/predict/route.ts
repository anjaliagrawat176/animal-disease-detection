import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    // Logged-in user ID from cookie
    const loggedInUserId = cookieStore.get("userId")?.value;

    if (!loggedInUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      imageUrl,
      confidence,
      animalId,
      diseaseId,
    } = body;

    // =========================
    // VALIDATION
    // =========================

    if (
      !imageUrl ||
      confidence === undefined ||
      !animalId ||
      !diseaseId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // =========================
    // CHECK USER
    // =========================

    const user = await prisma.user.findUnique({
      where: {
        id: loggedInUserId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Logged-in user not found",
        },
        { status: 404 }
      );
    }

    // =========================
    // CHECK ANIMAL
    // =========================

    const animal = await prisma.animal.findFirst({
      where: {
        id: animalId,
        userId: loggedInUserId,
      },
    });

    if (!animal) {
      return NextResponse.json(
        {
          success: false,
          message: "Animal not found for this user",
        },
        { status: 404 }
      );
    }

    // =========================
    // CHECK DISEASE
    // =========================

    const disease = await prisma.disease.findUnique({
      where: {
        id: diseaseId,
      },
    });

    if (!disease) {
      return NextResponse.json(
        {
          success: false,
          message: "Disease not found",
        },
        { status: 404 }
      );
    }

    // =========================
    // CREATE PREDICTION
    // =========================

    const prediction = await prisma.prediction.create({
      data: {
        imageUrl,
        confidence: Number(confidence),

        user: {
          connect: {
            id: loggedInUserId,
          },
        },

        animal: {
          connect: {
            id: animalId,
          },
        },

        disease: {
          connect: {
            id: diseaseId,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Prediction saved successfully",
        data: prediction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Prediction error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}