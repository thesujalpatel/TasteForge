import Groq from "groq-sdk";

let groqClient;
const modelCache = {
  expiresAt: 0,
  models: [],
};
const nonChatModelPattern =
  /(whisper|audio|speech|tts|guard|embed|compound|vision|image|safeguard|deprecated|distil)/i;
const chatModelPattern =
  /(llama|gpt-oss|qwen|kimi|deepseek|mistral|gemma|allam)/i;

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  return groqClient;
}

function rankModel(model) {
  const id = model.id.toLowerCase();
  let score = 0;

  if (id.includes("gpt-oss-120b")) score += 100;
  if (id.includes("120b")) score += 50;
  if (id.includes("70b")) score += 40;
  if (id.includes("32b")) score += 30;
  if (id.includes("versatile")) score += 20;
  if (id.includes("production")) score += 10;
  if (id.includes("preview")) score -= 10;

  return score;
}

export async function getAvailableModels() {
  if (modelCache.expiresAt > Date.now() && modelCache.models.length) {
    return modelCache.models;
  }

  const response = await getGroqClient().models.list();
  const models = (response.data || [])
    .filter(
      (model) =>
        model.id &&
        model.active === true &&
        !nonChatModelPattern.test(model.id) &&
        chatModelPattern.test(model.id),
    )
    .map((model) => model.id)
    .sort(
      (first, second) => rankModel({ id: second }) - rankModel({ id: first }),
    );

  if (!models.length) {
    throw new Error("Groq did not return any active models.");
  }

  modelCache.models = models;
  modelCache.expiresAt = Date.now() + 5 * 60 * 1000;
  return models;
}

export async function resolveModel(requestedModel) {
  const models = await getAvailableModels();
  const configuredModel = process.env.GROQ_MODEL?.trim();
  const preferredModel = requestedModel || configuredModel;

  if (preferredModel && models.includes(preferredModel)) {
    return preferredModel;
  }

  return models[0];
}

export default getGroqClient;
