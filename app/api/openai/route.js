import { OpenAI } from "openai";
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

    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    const response = await openai.chat.completions.create({
      model: "gpt", // This is now the correct model name
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Create a JSON structure for all the items in this receipt. Each item should have a 'name' and 'quantity' field. Return only the JSON structure.",
            },
            {
              type: "image_url",
              image_url: { url: image },
            },
          ],
        },
      ],
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: error.message || "Error processing image" },
      { status: 500 }
    );
  }
}
