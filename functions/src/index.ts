import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

setGlobalOptions({ maxInstances: 10 });

const NARA_API_KEY = process.env.NARA_API_KEY;
const NARA_BASE_URL =
  process.env.NARA_BASE_URL || "https://router.bynara.id/v1";
const NARA_MODEL = process.env.NARA_MODEL || "gpt-5.6-terra";

export const analyzeFish = onRequest(async (req, res) => {
  // Basic CORS support for the mobile application.
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({
      success: false,
      error: "Method not allowed.",
    });
    return;
  }

  if (!NARA_API_KEY) {
    logger.error("Missing NARA_API_KEY.");
    res.status(500).json({
      success: false,
      error: "AI service is not configured.",
    });
    return;
  }

  try {
    const { messages } = req.body ?? {};
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({
        success: false,
        error: "Invalid request. Messages are required.",
      });
      return;
    }

    const response = await fetch(`${NARA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NARA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: NARA_MODEL,
        messages,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      logger.error("NaraRouter request failed", {
        status: response.status,
        error: json?.error?.message ?? json?.message,
      });

      res.status(response.status).json({
        success: false,
        error:
          json?.error?.message ?? json?.message ?? "Unknown AI service error.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: json.choices?.[0]?.message?.content ?? "",
    });
  } catch (error) {
    logger.error("AI proxy error", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error.",
    });
  }
});
