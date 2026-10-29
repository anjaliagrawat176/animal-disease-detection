import groq from "@/lib/groq";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type AIResult = {
  diseaseId?: string;
  disease?: string;
  confidence?: number;
  observation?: string;
};

export async function POST(request: Request) {
  try {
    // =====================================================
    // CHECK LOGIN
    // =====================================================

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

    // =====================================================
    // REQUEST BODY
    // =====================================================

    const body = await request.json();

    const {
      imageUrl,
      animalId,
      symptoms,
    } = body;

    if (!imageUrl || !animalId) {
      return NextResponse.json(
        {
          success: false,
          message: "Image and animal are required",
        },
        { status: 400 }
      );
    }

    // Symptoms optional hai
    const animalSymptoms =
      typeof symptoms === "string"
        ? symptoms.trim()
        : "";

    // =====================================================
    // CHECK ANIMAL
    // =====================================================

    const animal = await prisma.animal.findFirst({
      where: {
        id: animalId,
        userId: userId,
      },
      select: {
        id: true,
        name: true,
        type: true,
        breed: true,
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

    // =====================================================
    // GET SAVED DISEASES
    // =====================================================

    const diseases = await prisma.disease.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        symptoms: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (diseases.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No diseases are available for detection",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // IMAGE URL
    // =====================================================

    let finalImageUrl = imageUrl;

    if (
      typeof imageUrl === "string" &&
      imageUrl.startsWith("/")
    ) {
      const requestUrl = new URL(request.url);

      finalImageUrl =
        `${requestUrl.origin}${imageUrl}`;
    }

    // =====================================================
    // FETCH IMAGE
    // =====================================================

    const imageResponse = await fetch(
      finalImageUrl,
      {
        cache: "no-store",
      }
    );

    if (!imageResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to access animal image",
        },
        { status: 400 }
      );
    }

    const imageBuffer =
      await imageResponse.arrayBuffer();

    if (
      imageBuffer.byteLength >
      4 * 1024 * 1024
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Animal image is too large. Please use an image below 4 MB.",
        },
        { status: 400 }
      );
    }

    const contentType =
      imageResponse.headers.get(
        "content-type"
      ) || "image/jpeg";

    const base64Image =
      Buffer.from(imageBuffer).toString(
        "base64"
      );

    const imageDataUrl =
      `data:${contentType};base64,${base64Image}`;

    // =====================================================
    // DATABASE DISEASE LIST
    // =====================================================

    const diseaseList = diseases
      .map(
        (disease) => `
ID: ${disease.id}
Name: ${disease.name}
Description: ${disease.description}
Symptoms: ${disease.symptoms}
`
      )
      .join("\n");

    // =====================================================
    // USER SYMPTOMS
    // =====================================================

    const symptomInformation =
      animalSymptoms ||
      "No additional symptoms were provided by the user.";

    // =====================================================
    // PROMPT
    // =====================================================

    const prompt = `
You are an animal disease screening assistant.

Analyze the uploaded animal image AND the symptoms
provided by the user.

Compare the available information ONLY with the diseases
saved in the database below.

ANIMAL INFORMATION

Name: ${animal.name}
Type: ${animal.type}
Breed: ${animal.breed || "Not specified"}

USER-PROVIDED SYMPTOMS / DESCRIPTION

${symptomInformation}

SAVED DISEASES

${diseaseList}

RULES

1. Return a disease ONLY from the saved disease list.
2. Consider BOTH the uploaded image and the user-provided
   symptoms.
3. Compare the visible condition in the image with the
   description and symptoms of the saved diseases.
4. Compare the user's reported symptoms with the symptoms
   of the saved diseases.
5. The user's symptom description is additional information
   and should be considered carefully.
6. You do not need every symptom to be present.
7. Choose the disease with the strongest reasonable match
   using the image and symptoms together.
8. Do not invent diseases.
9. Do not return a disease that is not in the database.
10. If the image alone is unclear but the user-provided
    symptoms provide a reasonable match, you may select
    the best matching saved disease.
11. Return Unknown only when there is no reasonable match
    with the saved diseases.
12. Confidence must be a number from 0 to 100.
13. Return ONLY a JSON object.
14. Do not use markdown.
15. Do not write anything before or after the JSON.

Return exactly this structure:

{
  "diseaseId": "database disease id",
  "disease": "database disease name",
  "confidence": 0,
  "observation": "brief observation based on image and symptoms"
}

For Unknown:

{
  "diseaseId": "",
  "disease": "Unknown",
  "confidence": 0,
  "observation": "reason"
}
`;

    console.log(
      "Symptoms sent to AI:",
      animalSymptoms || "None"
    );

    // =====================================================
    // GROQ VISION
    // =====================================================

    const chatCompletion =
      await groq.chat.completions.create({
        model: "qwen/qwen3.6-27b",

        // Disable reasoning so final content
        // is returned directly.
        reasoning_effort: "none",

        temperature: 0.3,

        max_completion_tokens: 1200,

        stream: false,

        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageDataUrl,
                },
              },
            ],
          },
        ],
      });

    // =====================================================
    // GET AI MESSAGE
    // =====================================================

    const message =
      chatCompletion.choices[0]?.message;

    console.log(
      "AI message:",
      message
    );

    let content =
      message?.content;

    // =====================================================
    // SAFETY CHECK
    // =====================================================

    if (!content) {
      console.error(
        "AI returned empty content."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "AI returned an empty result. Please try again.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // CLEAN AI RESPONSE
    // =====================================================

    const cleanedContent = String(content)
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    console.log(
      "AI content:",
      cleanedContent
    );

    // =====================================================
    // PARSE JSON
    // =====================================================

    let result: AIResult;

    try {
      result = JSON.parse(
        cleanedContent
      );
    } catch (error) {
      console.error(
        "AI JSON Parse Error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "AI returned an invalid result.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // MATCH DATABASE DISEASE
    // =====================================================

    const matchedDisease =
      diseases.find(
        (disease) =>
          disease.id === result.diseaseId
      );

    // =====================================================
    // UNKNOWN / INVALID
    // =====================================================

    if (!matchedDisease) {
      return NextResponse.json(
        {
          success: true,
          data: {
            diseaseId: "",
            disease: "Unknown",
            confidence: 0,
            observation:
              result.observation ||
              "No matching saved disease was identified from the image and provided symptoms.",
          },
        },
        { status: 200 }
      );
    }

    // =====================================================
    // CONFIDENCE
    // =====================================================

    let confidence =
      Number(result.confidence) || 0;

    confidence = Math.max(
      0,
      Math.min(100, confidence)
    );

    // =====================================================
    // FINAL RESULT
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        data: {
          diseaseId:
            matchedDisease.id,

          disease:
            matchedDisease.name,

          confidence,

          observation:
            result.observation ||
            `The image and provided symptoms were compared with the saved information for ${matchedDisease.name}.`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "AI Detection Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong during AI disease detection",
      },
      { status: 500 }
    );
  }
}