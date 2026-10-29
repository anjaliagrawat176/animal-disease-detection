import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

// =====================================================
// POST - ADD ANIMAL
// =====================================================

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const loggedInUserId =
      cookieStore.get("userId")?.value;

    if (!loggedInUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    // =====================================================
    // GET FORM DATA
    // =====================================================

    const formData = await request.formData();

    const name =
      formData.get("name")?.toString().trim();

    const type =
      formData.get("type")?.toString().trim();

    const breed =
      formData.get("breed")?.toString().trim();

    const age =
      formData.get("age")?.toString().trim();

    const gender =
      formData.get("gender")?.toString().trim();

    const pregnancyStatus =
      formData
        .get("pregnancyStatus")
        ?.toString()
        .trim();

    const healthStatus =
      formData
        .get("healthStatus")
        ?.toString()
        .trim() || "Healthy";

    const image =
      formData.get("image") as File | null;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!name || !type) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and type are required",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // PREGNANCY STATUS
    // =====================================================

    let finalPregnancyStatus: string | null = null;

    // Pregnancy status is only applicable
    // when animal is Female.

    if (gender === "Female") {
      finalPregnancyStatus =
        pregnancyStatus || "Unknown";
    }

    // =====================================================
    // CHECK USER
    // =====================================================

    const user =
      await prisma.user.findUnique({
        where: {
          id: loggedInUserId,
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Logged-in user not found",
        },
        { status: 404 }
      );
    }

    // =====================================================
    // IMAGE UPLOAD
    // =====================================================

    let imageUrl: string | null = null;

    if (image && image.size > 0) {
      // ---------------------------------------------------
      // IMAGE TYPE
      // ---------------------------------------------------

      if (!image.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Please select a valid image file.",
          },
          { status: 400 }
        );
      }

      // ---------------------------------------------------
      // IMAGE SIZE
      // ---------------------------------------------------

      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Image size must be less than 5 MB.",
          },
          { status: 400 }
        );
      }

      // ---------------------------------------------------
      // CONVERT IMAGE
      // ---------------------------------------------------

      const bytes =
        await image.arrayBuffer();

      const buffer =
        Buffer.from(bytes);

      // ---------------------------------------------------
      // UPLOAD DIRECTORY
      // ---------------------------------------------------

      const uploadDir =
        path.join(
          process.cwd(),
          "public",
          "uploads",
          "animals"
        );

      await mkdir(
        uploadDir,
        {
          recursive: true,
        }
      );

      // ---------------------------------------------------
      // FILE EXTENSION
      // ---------------------------------------------------

      const extension =
        image.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      // ---------------------------------------------------
      // SAFE FILE NAME
      // ---------------------------------------------------

      const safeName =
        name
          .toLowerCase()
          .replace(
            /[^a-z0-9]/g,
            "-"
          )
          .replace(
            /-+/g,
            "-"
          ) || "animal";

      const fileName =
        `${safeName}-${Date.now()}.${extension}`;

      // ---------------------------------------------------
      // SAVE IMAGE
      // ---------------------------------------------------

      await writeFile(
        path.join(
          uploadDir,
          fileName
        ),
        buffer
      );

      imageUrl =
        `/uploads/animals/${fileName}`;
    }

    // =====================================================
    // CREATE ANIMAL
    // =====================================================

    const animal =
      await prisma.animal.create({
        data: {
          name,

          type,

          breed:
            breed || null,

          age:
            age
              ? Number(age)
              : null,

          gender:
            gender || null,

          pregnancyStatus:
            finalPregnancyStatus,

          healthStatus,

          imageUrl,

          // IMPORTANT
          // Always use logged-in user
          userId:
            loggedInUserId,
        },
      });

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        message:
          "Animal added successfully",
        data: animal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Animal Add Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while adding animal.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// GET - FETCH USER ANIMALS
// =====================================================

export async function GET() {
  try {
    const cookieStore =
      await cookies();

    const userId =
      cookieStore.get(
        "userId"
      )?.value;

    // =====================================================
    // CHECK LOGIN
    // =====================================================

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please login first",
        },
        { status: 401 }
      );
    }

    // =====================================================
    // GET ANIMALS
    // =====================================================

    const animals =
      await prisma.animal.findMany({
        where: {
          userId: userId,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        data: animals,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Get Animals Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to fetch animals",
      },
      { status: 500 }
    );
  }
}