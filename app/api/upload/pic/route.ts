import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const image = formData.get("image") as File | null;

    // =========================
    // CHECK IMAGE
    // =========================

    if (!image || image.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select an image.",
        },
        { status: 400 }
      );
    }

    // =========================
    // CHECK IMAGE TYPE
    // =========================

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a valid image file.",
        },
        { status: 400 }
      );
    }

    // =========================
    // MAX 5 MB
    // =========================

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be less than 5 MB.",
        },
        { status: 400 }
      );
    }

    // =========================
    // CONVERT IMAGE
    // =========================

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // =========================
    // UPLOAD FOLDER
    // =========================

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "prediction"
    );

    await mkdir(uploadDir, {
      recursive: true,
    });

    // =========================
    // FILE EXTENSION
    // =========================

    const extension =
      image.name.split(".").pop()?.toLowerCase() || "jpg";

    // =========================
    // UNIQUE FILE NAME
    // =========================

    const fileName = `prediction-${Date.now()}.${extension}`;

    // =========================
    // SAVE IMAGE
    // =========================

    await writeFile(
      path.join(uploadDir, fileName),
      buffer
    );

    // =========================
    // IMAGE URL
    // =========================

    const imageUrl = `/uploads/prediction/${fileName}`;

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        data: {
          imageUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Image Upload Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Image upload failed",
      },
      { status: 500 }
    );
  }
}