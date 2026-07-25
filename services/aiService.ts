const API_KEY = process.env.EXPO_PUBLIC_NARA_API_KEY;
const BASE_URL = process.env.EXPO_PUBLIC_NARA_BASE_URL;
const MODEL = process.env.EXPO_PUBLIC_NARA_MODEL;

if (!API_KEY) {
  console.warn("Missing EXPO_PUBLIC_NARA_API_KEY");
}

if (!BASE_URL) {
  console.warn("Missing EXPO_PUBLIC_NARA_BASE_URL");
}

if (!MODEL) {
  console.warn("Missing EXPO_PUBLIC_NARA_MODEL");
}

export interface AIResponse {
  success: boolean;
  message: string;
  error?: string;
}

async function sendRequest(body: object): Promise<AIResponse> {
  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: "",
        error:
          json?.error?.message ?? json?.message ?? "Unknown AI service error.",
      };
    }

    return {
      success: true,
      message: json.choices?.[0]?.message?.content ?? "",
    };
  } catch (error) {
    return {
      success: false,
      message: "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function askAI(prompt: string): Promise<AIResponse> {
  return sendRequest({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
}

export async function askVisionAI(
  base64Image: string,
  prompt: string,
): Promise<AIResponse> {
  return sendRequest({
    model: MODEL,
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
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
  });
}
