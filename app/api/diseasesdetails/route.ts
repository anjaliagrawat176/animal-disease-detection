import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      description,
      symptoms,
      prevention,
      medicine,
    } = body;

    if (!name || !description || !symptoms || !prevention || !medicine) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const disease = await prisma.disease.create({
      data: {
        name,
        description,
        symptoms,
        prevention,
        medicine,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Disease added successfully",
        data: disease,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Disease error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const diseases = await prisma.disease.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: diseases,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get diseases error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}