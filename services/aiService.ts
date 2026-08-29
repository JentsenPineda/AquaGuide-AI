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

/**
 * Maximum number of additional attempts after the first request.
 *
 * Total possible requests:
 * 1 initial request + 2 retries = 3 attempts
 */
const MAX_RETRIES = 2;

/**
 * Timeout for each individual request.
 */
const REQUEST_TIMEOUT = 60000;

/**
 * Delay before retrying.
 *
 * Attempt 1 -> wait 2 seconds
 * Attempt 2 -> wait 4 seconds
 */
const getRetryDelay = (retryNumber: number) => {
  return retryNumber === 1 ? 2000 : 4000;
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Determines whether an HTTP status is likely temporary.
 *
 * These errors can happen when the upstream AI provider,
 * gateway, or router is temporarily unavailable/exhausted.
 */
const isRetryableStatus = (status: number) => {
  return status === 502 || status === 503 || status === 504;
};

async function sendRequest(body: object): Promise<AIResponse> {
  if (!API_KEY || !BASE_URL || !MODEL) {
    console.error("AI configuration is incomplete.");

    return {
      success: false,
      message: "",
      error: "AI service configuration is incomplete.",
    };
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT);

    try {
      console.log("AI request started:", {
        attempt: attempt + 1,
        maxAttempts: MAX_RETRIES + 1,
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

      console.log("AI response received:", {
        status: response.status,
        attempt: attempt + 1,
      });

      let json: any = null;

      try {
        json = await response.json();
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);

        if (isRetryableStatus(response.status) && attempt < MAX_RETRIES) {
          const delay = getRetryDelay(attempt + 1);

          console.warn(
            `AI response could not be parsed. Retrying in ${delay}ms...`,
          );

          await sleep(delay);
          continue;
        }

        return {
          success: false,
          message: "",
          error: "The AI service returned an invalid response.",
        };
      }

      /**
       * Handle HTTP errors.
       */
      if (!response.ok) {
        const errorMessage =
          json?.error?.message ??
          json?.error?.error?.message ??
          json?.message ??
          `AI service error (${response.status}).`;

        console.error("AI service HTTP error:", {
          status: response.status,
          error: errorMessage,
          attempt: attempt + 1,
        });

        /**
         * Retry temporary gateway/provider errors.
         *
         * 502 = Bad Gateway
         * 503 = Service Unavailable
         * 504 = Gateway Timeout
         */
        if (isRetryableStatus(response.status) && attempt < MAX_RETRIES) {
          const delay = getRetryDelay(attempt + 1);

          console.warn(
            `Temporary AI service error (${response.status}). ` +
              `Retrying in ${delay}ms...`,
          );

          await sleep(delay);
          continue;
        }

        /**
         * Authentication errors should not be retried.
         */
        if (response.status === 401) {
          return {
            success: false,
            message: "",
            error:
              "The AI service authentication failed. Please check the API configuration.",
          };
        }

        if (response.status === 403) {
          return {
            success: false,
            message: "",
            error:
              "The AI service rejected the request. Please check the API access configuration.",
          };
        }

        /**
         * Rate limit / quota response.
         */
        if (response.status === 429) {
          return {
            success: false,
            message: "",
            error:
              "The AI service is temporarily rate-limited. Please try again later.",
          };
        }

        return {
          success: false,
          message: "",
          error: errorMessage,
        };
      }

      /**
       * Extract the assistant response.
       */
      const message = json?.choices?.[0]?.message?.content;

      if (typeof message !== "string" || !message.trim()) {
        console.error("AI service returned an empty response:", json);

        if (attempt < MAX_RETRIES) {
          const delay = getRetryDelay(attempt + 1);

          console.warn(
            `AI returned an empty response. Retrying in ${delay}ms...`,
          );

          await sleep(delay);
          continue;
        }

        return {
          success: false,
          message: "",
          error: "The AI service returned an empty response.",
        };
      }

      console.log("AI request completed successfully.", {
        attempt: attempt + 1,
      });

      return {
        success: true,
        message,
      };
    } catch (error) {
      /**
       * Timeout.
       */
      if (error instanceof Error && error.name === "AbortError") {
        console.error(
          `AI request timed out after ${REQUEST_TIMEOUT / 1000} seconds.`,
        );

        if (attempt < MAX_RETRIES) {
          const delay = getRetryDelay(attempt + 1);

          console.warn(`Request timed out. Retrying in ${delay}ms...`);

          await sleep(delay);
          continue;
        }

        return {
          success: false,
          message: "",
          error:
            "The AI request timed out. Please check your internet connection and try again.",
        };
      }

      /**
       * Network / connection error.
       */
      console.error("AI request failed:", error);

      if (attempt < MAX_RETRIES) {
        const delay = getRetryDelay(attempt + 1);

        console.warn(`Network error. Retrying in ${delay}ms...`);

        await sleep(delay);
        continue;
      }

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

  /**
   * Fallback return.
   */
  return {
    success: false,
    message: "",
    error: "The AI service could not complete the request.",
  };
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
  /**
   * Temporary debugging information.
   *
   * This lets us determine how large the image being
   * sent to NaraRouter actually is.
   *
   * Do NOT log the Base64 image itself.
   */
  console.log("VISION IMAGE DEBUG:", {
    base64Length: base64Image.length,
    approximateMB: ((base64Image.length * 3) / 4 / 1024 / 1024).toFixed(2),
  });

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
