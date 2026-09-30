import { NextResponse } from "next/server";
import { getAvailableModels } from "../../lib/groq";

export const runtime = "nodejs";

export async function GET() {
  try {
    const models = await getAvailableModels();
    return NextResponse.json({ models, defaultModel: models[0] });
  } catch (error) {
    console.error("Groq model discovery error:", error);
    return NextResponse.json(
      { error: "Unable to load available AI models." },
      { status: 503 }
    );
  }
}