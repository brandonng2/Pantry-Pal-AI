import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      "Analyze this receipt and list all items. For each item, provide the name (expanded with no abbreviations and no brand names) and quantity. Format the output as tab-separated values (TSV) with 'name' and 'quantity' as headers. Each item should be on a new line.";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: image.split(",")[1],
        },
      },
    ]);

    const response = await result.response;
    const generatedContent = response.text();

    return NextResponse.json({ result: generatedContent });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: error.message || "Error processing image" },
      { status: 500 }
    );
  }
}
