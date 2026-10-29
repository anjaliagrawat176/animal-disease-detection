import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // =====================================================
    // DISEASE DATA
    // =====================================================

    const diseases = [
      {
        name: "Mastitis",
        description:
          "Inflammation and infection of one or more mammary glands, especially common in dairy animals.",
        symptoms:
          "Udder swelling, redness, heat, pain, abnormal milk, reduced milk production",
        prevention:
          "Maintain good milking hygiene, keep the udder and housing areas clean, and monitor animals regularly.",
        medicine:
          "Veterinary examination is recommended to determine the appropriate treatment.",
      },

      {
        name: "Lumpy Skin Disease",
        description:
          "A viral disease of cattle and buffalo characterized mainly by raised skin nodules and systemic signs.",
        symptoms:
          "Firm raised skin nodules, skin swelling, fever, enlarged lymph nodes, watery eyes or nasal discharge",
        prevention:
          "Use appropriate vaccination programs, reduce insect exposure, maintain hygiene, and isolate suspected animals.",
        medicine:
          "Veterinary evaluation is required; treatment is supportive and depends on the animal's condition.",
      },

      {
        name: "Foot and Mouth Disease",
        description:
          "A highly contagious viral disease affecting cattle, buffalo, sheep and goats.",
        symptoms:
          "Blisters or erosions around the mouth and feet, excessive salivation, difficulty eating, reluctance to walk",
        prevention:
          "Follow vaccination and biosecurity programs and isolate suspected animals.",
        medicine:
          "Immediate veterinary and animal-health assessment is recommended.",
      },

      {
        name: "Pneumonia",
        description:
          "Inflammation and infection of the lungs and respiratory tract in animals.",
        symptoms:
          "Coughing, nasal discharge, rapid or difficult breathing, depression, fever",
        prevention:
          "Maintain good ventilation, reduce overcrowding, keep housing clean, and minimize environmental stress.",
        medicine:
          "A veterinarian should determine the cause and appropriate treatment.",
      },

      {
        name: "Ringworm",
        description:
          "A superficial fungal skin infection that can affect cattle and other animals.",
        symptoms:
          "Circular areas of hair loss, crusting, scaling, dry skin lesions",
        prevention:
          "Maintain clean housing, avoid sharing contaminated grooming equipment, and isolate affected animals.",
        medicine:
          "Veterinary examination is recommended for confirmation and appropriate treatment.",
      },

      {
        name: "Blackleg",
        description:
          "An acute bacterial disease mainly affecting cattle and sheep and characterized by muscle inflammation and swelling.",
        symptoms:
          "Sudden lameness, painful swelling of large muscles, depression, fever, weakness",
        prevention:
          "Use appropriate vaccination programs and maintain good herd health practices.",
        medicine:
          "This can be rapidly serious; prompt veterinary attention is required.",
      },

      {
        name: "Hemorrhagic Septicemia",
        description:
          "A serious bacterial disease affecting cattle and buffalo that can cause rapid systemic illness.",
        symptoms:
          "Fever, nasal discharge, excessive salivation, difficult breathing, swelling under the jaw and neck",
        prevention:
          "Vaccination, hygiene, biosecurity, and early isolation of suspected animals are important.",
        medicine:
          "Urgent veterinary attention is recommended because the disease can progress rapidly.",
      },

      {
        name: "Respiratory Infection",
        description:
          "A general respiratory illness that may affect the upper or lower respiratory tract.",
        symptoms:
          "Coughing, nasal discharge, sneezing, rapid breathing, reduced activity",
        prevention:
          "Provide clean ventilation, reduce overcrowding, and maintain good hygiene.",
        medicine:
          "Veterinary assessment is recommended to identify the underlying cause.",
      },

      {
        name: "Skin Infection",
        description:
          "A broad category of inflammatory or infectious skin conditions in animals.",
        symptoms:
          "Redness, swelling, crusting, hair loss, skin lesions, irritation",
        prevention:
          "Maintain skin and housing hygiene and check animals regularly for new lesions.",
        medicine:
          "The underlying cause should be confirmed by a veterinarian before treatment.",
      },

      {
        name: "Dermatitis",
        description:
          "Inflammation of the skin caused by infectious, allergic, parasitic or environmental factors.",
        symptoms:
          "Redness, itching, swelling, crusts, skin irritation, hair loss",
        prevention:
          "Maintain good skin hygiene, clean housing, and regular animal health checks.",
        medicine:
          "Veterinary examination is recommended to identify the underlying cause.",
      },
    ];

    // =====================================================
    // INSERT ONLY MISSING DISEASES
    // =====================================================

    let inserted = 0;
    let skipped = 0;

    for (const disease of diseases) {
      const existing =
        await prisma.disease.findFirst({
          where: {
            name: disease.name,
          },
        });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.disease.create({
        data: disease,
      });

      inserted++;
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json(
      {
        success: true,
        message: "Disease data seeded successfully",
        inserted,
        skipped,
        totalProvided: diseases.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Disease seed error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to seed disease data",
      },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message:
        "Disease seed API is working. Use POST to insert diseases.",
    });
  } catch (error) {
    console.error("Disease seed GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}