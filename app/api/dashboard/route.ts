import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // =========================================
    // GET LOGGED-IN USER ID
    // =========================================

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

    // =========================================
    // TOTAL ANIMALS
    // =========================================

    const totalAnimals = await prisma.animal.count({
      where: {
        userId: userId,
      },
    });

    // =========================================
    // GET USER'S ANIMALS
    // We use this for reliable health status
    // calculation.
    // =========================================

    const userAnimals = await prisma.animal.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        healthStatus: true,
      },
    });

    // =========================================
    // HEALTH STATUS COUNTS
    // =========================================

    let healthyAnimals = 0;
    let healthAlerts = 0;

    userAnimals.forEach((animal) => {
      const status = (
        animal.healthStatus || ""
      )
        .trim()
        .toLowerCase();

      if (status === "healthy") {
        healthyAnimals++;
      } else if (
        status === "attention" ||
        status === "need attention" ||
        status === "needs attention" ||
        status === "need-attention" ||
        status === "needs-attention"
      ) {
        healthAlerts++;
      }
    });

    // =========================================
    // TOTAL DISEASES
    // Disease library is common for all users
    // =========================================

    const totalDiseases =
      await prisma.disease.count();

    // =========================================
    // TOTAL PREDICTIONS
    // DIRECT USER ID
    // =========================================

    const totalPredictions =
      await prisma.prediction.count({
        where: {
          userId: userId,
        },
      });

    // =========================================
    // AVERAGE AI CONFIDENCE
    // DIRECT USER ID
    // =========================================

    const confidenceResult =
      await prisma.prediction.aggregate({
        _avg: {
          confidence: true,
        },
        where: {
          userId: userId,
        },
      });

    const averageConfidence =
      confidenceResult._avg.confidence !== null
        ? Number(
            confidenceResult._avg.confidence.toFixed(1)
          )
        : 0;

    // =========================================
    // RECENT ANIMALS
    // =========================================

    const recentAnimals =
      await prisma.animal.findMany({
        where: {
          userId: userId,
        },

        take: 5,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          name: true,
          type: true,
          breed: true,
          age: true,
          gender: true,
          healthStatus: true,
          createdAt: true,
        },
      });

    // =========================================
    // RECENT PREDICTIONS
    // DIRECT USER ID
    // =========================================

    const recentPredictions =
      await prisma.prediction.findMany({
        where: {
          userId: userId,
        },

        take: 5,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          animal: {
            select: {
              name: true,
              type: true,
            },
          },

          disease: {
            select: {
              name: true,
            },
          },
        },
      });

    // =========================================
    // RESPONSE
    // =========================================

    return NextResponse.json({
      success: true,

      data: {
        totalAnimals,
        totalPredictions,
        totalDiseases,
        healthyAnimals,
        healthAlerts,
        averageConfidence,
        recentAnimals,
        recentPredictions,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load dashboard data",
      },
      { status: 500 }
    );
  }
}