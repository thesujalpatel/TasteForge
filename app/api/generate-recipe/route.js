export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { ingredients, diet } = await req.json();

    const prompt = `Hey Chef AI! Your name is **Taste Forge**. I have the following ingredients: ${ingredients.join(
      ", "
    )}.

Can you craft a delicious and creative ${
      diet || "balanced"
    } Indian recipe using flavorful spices?

Important Dietary Instructions:  
The selected dietary preference is **${
      diet || "balanced"
    }**. You must follow these rules strictly:

  - Exclude or substitute any ingredients that **conflict with this diet** (e.g., remove meat for **vegetarian**, or dairy for **vegan**).
  - If (and **only if**) there is a direct conflict between any of the provided ingredients and the selected diet:
      - Insert a **"Notice"** section immediately **after the dish title**.
      - In this section:
        - Clearly explain the conflict.
        - Bold the **diet** and any **conflicting ingredients** inside notice block.
        - State which ingredients were substituted or removed.
  - If there are **no dietary conflicts**, then:
      - **Do not include the "Notice" section at all.**
      - **Do not generate any placeholder, generic, or empty notice.**
  - If needed, suggest creative, flavorful alternatives that respect the dietary rules.
  - Ensure the final recipe completely aligns with the **selected dietary preference**, without exceptions.

Please include:
  - A catchy dish name  
  - A list of ingredients with accurate amounts  
  - Clear, step-by-step cooking instructions  
  - Optional: Tips or variations for more spice or creativity  
  - Make it fun and easy to read using emojis in each section — but do not overuse them; keep it professional.
  - End the recipe with a warm, engaging message that encourages enjoyment, clearly highlighting the dish name in bold for emphasis.

Formatting Instructions:
  - Dish name in **heading 1**
  - Each main section (Ingredients, Instructions, Tips) in **heading 3**
  - Do not include any extra commentary, explanations, or headings beyond what's requested.

Let’s get cooking!`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-r1-distill-llama-70b",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "AI response was empty." },
        { status: 500 }
      );
    }
    return NextResponse.json({ recipe: content });
  } catch (err) {
    console.error("❌ Groq API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
