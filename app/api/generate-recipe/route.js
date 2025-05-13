// api/recipe/route.ts (or .js if using JS)
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
    }**. You must follow these rules **strictly**:

  - Exclude or substitute any ingredients that **conflict with this diet** (e.g., remove meat for **vegetarian**, or dairy for **vegan**).
  
  - If (and **only if**) there is a **clear, direct conflict** between any of the provided ingredients and the selected diet:
      - Insert a **"Notice"** section immediately **after the dish title**.
      - In this section:
        - Clearly explain the conflict.
        - Bold the **diet** and any **conflicting ingredients** inside the notice.
        - Specify which ingredients were substituted or removed.

  - If there are **no actual dietary conflicts**, then:
      - **Do not include the "Notice" section at all.**
      - **Do not include any placeholder or generic notice.**
      - **Do not mention diet compatibility in the recipe unless there is a real conflict.**

⚠️ This rule must be followed exactly. Include a "Notice" only when a real ingredient-diet conflict exists. If no conflict exists, the recipe must **not** mention any notice, warning, placeholder, or diet note.


Please include:
  - A catchy dish name  
  - A list of ingredients with accurate amounts  
  - Clear, step-by-step cooking instructions  
  - Optional: Tips or variations for more spice or creativity  
  - Make it fun and easy to read using emojis in each section — but do not overuse them; keep it professional.
  - End the recipe with a warm, engaging message that encourages enjoyment, clearly highlighting the dish name in bold for emphasis.

Formatting Instructions:
  - Dish name in **heading 1**
  - Each main section (Ingredients, Instructions, Tips) in **heading 2**
  - Subsections (sub ingredients, steps for instructions and sections in main sections) in **heading 3**
  - Do not include any extra commentary, explanations, or headings beyond what's requested.

Let’s get cooking!`;

    const chatCompletion = await groq.chat.completions.create({
      model: "deepseek-r1-distill-llama-70b",
      messages: [
        {
          role: "system",
          content:
            "Your name is Taste Forge, You are a helpful assistant that generates recipes based on user-provided ingredients and dietary preferences.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = chatCompletion.choices?.[0]?.message?.content;

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
