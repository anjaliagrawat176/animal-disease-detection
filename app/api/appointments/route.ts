import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

// =====================================================
// GET - User ke appointments
// =====================================================

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User not logged in",
        },
        { status: 401 }
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: userId,
      },
      include: {
        animal: {
          select: {
            id: true,
            name: true,
            type: true,
            breed: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("GET appointments error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch appointments",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// POST - New Appointment
// =====================================================

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User not logged in",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      animalId,
      doctorName,
      date,
      time,
      reason,
    } = body;

    if (!animalId || !doctorName || !date || !time) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Animal, doctor name, date and time are required",
        },
        { status: 400 }
      );
    }

    // Check animal belongs to logged-in user
    const animal = await prisma.animal.findFirst({
      where: {
        id: animalId,
        userId: userId,
      },
    });

    if (!animal) {
      return NextResponse.json(
        {
          success: false,
          message: "Animal not found",
        },
        { status: 404 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: userId,
        animalId: animalId,
        doctorName: doctorName,
        date: new Date(date),
        time: time,
        reason: reason || null,
        status: "Pending",
      },
      include: {
        animal: {
          select: {
            id: true,
            name: true,
            type: true,
            breed: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment booked successfully",
        data: appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST appointment error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create appointment",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE - Delete Appointment
// =====================================================

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User not logged in",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("id");

    if (!appointmentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Appointment ID is required",
        },
        { status: 400 }
      );
    }

    const appointment =
      await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          userId: userId,
        },
      });

    if (!appointment) {
      return NextResponse.json(
        {
          success: false,
          message: "Appointment not found",
        },
        { status: 404 }
      );
    }

    await prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE appointment error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete appointment",
      },
      { status: 500 }
    );
  }
}