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

export interface FishScanAIResult {
  species: string;
  variant: string | null;
  scientificName: string | null;
  confidence: number;
  introduction: string;
}

async function sendRequest(body: object): Promise<AIResponse> {
  const controller = new AbortController();

  // Prevent the scan from waiting indefinitely.
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 45000);

  try {
    if (!API_KEY || !BASE_URL || !MODEL) {
      console.error("AI configuration is incomplete.");

      return {
        success: false,
        message: "",
        error: "AI service configuration is incomplete.",
      };
    }

    console.log("AI request started:", {
      baseUrl: BASE_URL,
      model: MODEL,
    });

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        model: MODEL,
      }),
      signal: controller.signal,
    });

    console.log("AI response received:", response.status);

    let json: any;

    try {
      json = await response.json();
    } catch (error) {
      console.error("Failed to parse AI response:", error);

      return {
        success: false,
        message: "",
        error: "The AI service returned an invalid response.",
      };
    }

    if (!response.ok) {
      const errorMessage =
        json?.error?.message ??
        json?.message ??
        `AI service error (${response.status}).`;

      console.error("AI service HTTP error:", {
        status: response.status,
        error: errorMessage,
      });

      return {
        success: false,
        message: "",
        error: errorMessage,
      };
    }

    const message = json?.choices?.[0]?.message?.content;

    if (typeof message !== "string" || !message.trim()) {
      console.error("AI service returned an empty response:", json);

      return {
        success: false,
        message: "",
        error: "The AI service returned an empty response.",
      };
    }

    console.log("AI request completed successfully.");

    return {
      success: true,
      message,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("AI request timed out after 45 seconds.");

      return {
        success: false,
        message: "",
        error:
          "The AI request timed out. Please check your internet connection and try again.",
      };
    }

    console.error("AI request failed:", error);

    return {
      success: false,
      message: "",
      error:
        error instanceof Error
          ? error.message
          : "Unable to connect to the AI service.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function askAI(prompt: string): Promise<AIResponse> {
  return sendRequest({
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
