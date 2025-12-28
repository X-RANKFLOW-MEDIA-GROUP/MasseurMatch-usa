const apiUser = process.env.SIGHTENGINE_API_USER;
const apiSecret = process.env.SIGHTENGINE_API_SECRET;

if (!apiUser || !apiSecret) {
  console.warn(
    "Sightengine credentials are missing (SIGHTENGINE_API_USER / SIGHTENGINE_API_SECRET). Moderation will fallback to manual review."
  );
}

const SIGHTENGINE_ENDPOINT = "https://api.sightengine.com/1.0/check.json";

/**
 * Call Sightengine API directly using native fetch (no vulnerable dependencies)
 */
async function checkImage(models: string[], imageUrl: string) {
  if (!apiUser || !apiSecret) {
    throw new Error("Sightengine API credentials not configured");
  }

  const params = new URLSearchParams({
    models: models.join(","),
    url: imageUrl,
    api_user: apiUser,
    api_secret: apiSecret,
  });

  const response = await fetch(`${SIGHTENGINE_ENDPOINT}?${params.toString()}`, {
    headers: {
      "User-Agent": "MasseurMatch-NextJS/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Sightengine API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export interface PhotoModerationResult {
  status: "auto_passed" | "auto_flagged" | "auto_blocked";
  score: number;
  flags: {
    nudity?: number;
    weapon?: number;
    drug?: number;
    gore?: number;
    offensive?: number;
  };
  reason?: string;
}

const FLAG_THRESHOLDS = {
  pass: 0.8,
  flag: 0.6,
};

const extractScore = (value: number | undefined): number =>
  Number.isFinite(value) && value !== undefined ? Math.min(1, Math.max(0, value)) : 0;

export async function moderatePhoto(imageUrl: string): Promise<PhotoModerationResult> {
  if (!apiUser || !apiSecret) {
    return {
      status: "auto_flagged",
      score: 0.5,
      flags: {},
      reason: "Moderation client not configured (missing API credentials)",
    };
  }

  try {
    const result = await checkImage(["nudity", "wad", "offensive", "gore"], imageUrl);

    const nudityScore = extractScore(result?.nudity?.raw);
    const weaponScore = extractScore(result?.weapon);
    const drugScore = extractScore(result?.alcohol);
    const goreScore = extractScore(result?.gore?.prob);
    const offensiveScore = extractScore(result?.offensive?.prob);

    const riskScore = Math.max(nudityScore, weaponScore, drugScore, goreScore, offensiveScore);
    const cleanScore = Number((1 - riskScore).toFixed(3));

    let status: PhotoModerationResult["status"];
    if (cleanScore > FLAG_THRESHOLDS.pass) {
      status = "auto_passed";
    } else if (cleanScore >= FLAG_THRESHOLDS.flag) {
      status = "auto_flagged";
    } else {
      status = "auto_blocked";
    }

    const reason =
      status === "auto_blocked"
        ? "Image scored below the acceptable threshold"
        : status === "auto_flagged"
        ? "Image needs manual review"
        : undefined;

    return {
      status,
      score: cleanScore,
      flags: {
        nudity: nudityScore,
        weapon: weaponScore,
        drug: drugScore,
        gore: goreScore,
        offensive: offensiveScore,
      },
      reason,
    };
  } catch (error) {
    console.error("Sightengine moderation failure:", error);
    return {
      status: "auto_flagged",
      score: 0.5,
      flags: {},
      reason: "Moderation service error - requires manual review",
    };
  }
}
