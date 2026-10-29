import groq from "@/lib/groq";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
          Answer the following question in json format only.

          Question: ${question}

          Format:
          {
          "disease":"",
          "Symptoms":[],
          "Causes":[],
          "Prevention":[],
          "treatement":[]
          }
          Do not return any explation outside the JSON.
          `,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    const data=JSON.parse(

      chatCompletion.choices[0]?.message?.content || "{}"
    );

    return NextResponse.json(
      {
        success: true,
        data,
      
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}