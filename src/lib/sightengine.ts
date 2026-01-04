import axios from "axios";
import FormData from "form-data";

const SIGHTENGINE_API_USER = process.env.SIGHTENGINE_API_USER;
const SIGHTENGINE_API_SECRET = process.env.SIGHTENGINE_API_SECRET;

export type ModerationResult = {
  status: "success" | "failure";
  approved: boolean;
  reasons: string[];
  scores: {
    nudity: number;
    weapon: number;
    alcohol: number;
    drugs: number;
    offensive: number;
    gore: number;
    qr: number;
  };
  raw?: unknown;
};

/**
 * Moderate an image using Sightengine API
 * @param imageUrl - URL of the image to moderate
 * @returns ModerationResult with approval status and scores
 */
export async function moderateImage(imageUrl: string): Promise<ModerationResult> {
  if (!SIGHTENGINE_API_USER || !SIGHTENGINE_API_SECRET) {
    console.warn("Sightengine not configured, auto-approving");
    return {
      status: "success",
      approved: true,
      reasons: [],
      scores: { nudity: 0, weapon: 0, alcohol: 0, drugs: 0, offensive: 0, gore: 0, qr: 0 },
    };
  }

  try {
    const response = await axios.get("https://api.sightengine.com/1.0/check.json", {
      params: {
        url: imageUrl,
        models: "nudity-2.1,weapon,alcohol,recreational_drug,offensive,gore-2.0,qr-content",
        api_user: SIGHTENGINE_API_USER,
        api_secret: SIGHTENGINE_API_SECRET,
      },
    });

    const data = response.data;

    // Extract scores
    const scores = {
      nudity: data.nudity?.sexual_activity || data.nudity?.sexual_display || 0,
      weapon: data.weapon || 0,
      alcohol: data.alcohol || 0,
      drugs: data.recreational_drug?.prob || 0,
      offensive: data.offensive?.prob || 0,
      gore: data.gore?.prob || 0,
      qr: data.qr?.prob || 0,
    };

    // Determine if approved (thresholds)
    const reasons: string[] = [];

    if (scores.nudity > 0.5) reasons.push("Nudity detected");
    if (scores.weapon > 0.5) reasons.push("Weapon detected");
    if (scores.alcohol > 0.7) reasons.push("Alcohol detected");
    if (scores.drugs > 0.5) reasons.push("Drugs detected");
    if (scores.offensive > 0.5) reasons.push("Offensive content");
    if (scores.gore > 0.5) reasons.push("Gore detected");
    if (scores.qr > 0.5) reasons.push("QR code detected");

    return {
      status: "success",
      approved: reasons.length === 0,
      reasons,
      scores,
      raw: data,
    };
  } catch (error) {
    console.error("Sightengine error:", error);
    return {
      status: "failure",
      approved: false,
      reasons: ["Moderation service error"],
      scores: { nudity: 0, weapon: 0, alcohol: 0, drugs: 0, offensive: 0, gore: 0, qr: 0 },
    };
  }
}

/**
 * Moderate an uploaded file using Sightengine API
 * @param file - File buffer to moderate
 * @param filename - Original filename
 * @returns ModerationResult with approval status and scores
 */
export async function moderateImageFile(
  file: Buffer,
  filename: string
): Promise<ModerationResult> {
  if (!SIGHTENGINE_API_USER || !SIGHTENGINE_API_SECRET) {
    console.warn("Sightengine not configured, auto-approving");
    return {
      status: "success",
      approved: true,
      reasons: [],
      scores: { nudity: 0, weapon: 0, alcohol: 0, drugs: 0, offensive: 0, gore: 0, qr: 0 },
    };
  }

  try {
    const form = new FormData();
    form.append("media", file, { filename });
    form.append("models", "nudity-2.1,weapon,alcohol,recreational_drug,offensive,gore-2.0,qr-content");
    form.append("api_user", SIGHTENGINE_API_USER);
    form.append("api_secret", SIGHTENGINE_API_SECRET);

    const response = await axios.post(
      "https://api.sightengine.com/1.0/check.json",
      form,
      { headers: form.getHeaders() }
    );

    const data = response.data;

    const scores = {
      nudity: data.nudity?.sexual_activity || data.nudity?.sexual_display || 0,
      weapon: data.weapon || 0,
      alcohol: data.alcohol || 0,
      drugs: data.recreational_drug?.prob || 0,
      offensive: data.offensive?.prob || 0,
      gore: data.gore?.prob || 0,
      qr: data.qr?.prob || 0,
    };

    const reasons: string[] = [];

    if (scores.nudity > 0.5) reasons.push("Nudity detected");
    if (scores.weapon > 0.5) reasons.push("Weapon detected");
    if (scores.alcohol > 0.7) reasons.push("Alcohol detected");
    if (scores.drugs > 0.5) reasons.push("Drugs detected");
    if (scores.offensive > 0.5) reasons.push("Offensive content");
    if (scores.gore > 0.5) reasons.push("Gore detected");
    if (scores.qr > 0.5) reasons.push("QR code detected");

    return {
      status: "success",
      approved: reasons.length === 0,
      reasons,
      scores,
      raw: data,
    };
  } catch (error) {
    console.error("Sightengine error:", error);
    return {
      status: "failure",
      approved: false,
      reasons: ["Moderation service error"],
      scores: { nudity: 0, weapon: 0, alcohol: 0, drugs: 0, offensive: 0, gore: 0, qr: 0 },
    };
  }
}

/**
 * Moderate text content for profanity and inappropriate language
 * @param text - Text to moderate
 * @returns ModerationResult with approval status
 */
export async function moderateText(text: string): Promise<ModerationResult> {
  if (!SIGHTENGINE_API_USER || !SIGHTENGINE_API_SECRET) {
    console.warn("Sightengine not configured, auto-approving");
    return {
      status: "success",
      approved: true,
      reasons: [],
      scores: { nudity: 0, weapon: 0, alcohol: 0, drugs: 0, offensive: 0, gore: 0, qr: 0 },
    };
  }

  try {
    const response = await axios.get("https://api.sightengine.com/1.0/text/check.json", {
      params: {
        text,
        lang: "en",
        mode: "standard",
        models: "general",
        api_user: SIGHTENGINE_API_USER,
        api_secret: SIGHTENGINE_API_SECRET,
      },
    });

    const data = response.data;
    const reasons: string[] = [];

    // Check for profanity
    if (data.profanity?.matches?.length > 0) {
      reasons.push("Profanity detected");
    }

    // Check for personal info (phone, email in text)
    if (data.personal?.matches?.length > 0) {
      reasons.push("Personal information detected");
    }

    // Check for links
    if (data.link?.matches?.length > 0) {
      reasons.push("External links detected");
    }

    return {
      status: "success",
      approved: reasons.length === 0,
      reasons,
      scores: { nudity: 0, weapon: 0, alcohol: 0, drugs: 0, offensive: 0, gore: 0, qr: 0 },
      raw: data,
    };
  } catch (error) {
    console.error("Sightengine text error:", error);
    return {
      status: "failure",
      approved: true, // Default to approved on error for text
      reasons: [],
      scores: { nudity: 0, weapon: 0, alcohol: 0, drugs: 0, offensive: 0, gore: 0, qr: 0 },
    };
  }
}
