/**
 * Sightengine Image and Text Moderation
 *
 * This module provides content moderation using the Sightengine API.
 * It checks images and text for inappropriate content before allowing them to be published.
 */

const sightengine = require('sightengine');

const client = new sightengine.SightengineClient(
  process.env.SIGHTENGINE_API_USER || '',
  process.env.SIGHTENGINE_API_SECRET || ''
);

export interface ImageModerationResult {
  status: 'auto_passed' | 'auto_flagged' | 'auto_blocked';
  nudity_score?: number;
  weapon_score?: number;
  drug_score?: number;
  gore_score?: number;
  offensive_score?: number;
  reason?: string;
}

export interface TextModerationResult {
  status: 'auto_passed' | 'auto_flagged' | 'auto_blocked';
  profanity_score?: number;
  personal_info_score?: number;
  link_score?: number;
  reason?: string;
}

/**
 * Moderate an image URL using Sightengine
 */
export async function moderateImage(imageUrl: string): Promise<ImageModerationResult> {
  try {
    const result = await client.check(['nudity', 'wad', 'offensive']).set_url(imageUrl);

    // Extract scores
    const nudityScore = result.nudity?.raw || 0;
    const weaponScore = result.weapon || 0;
    const drugScore = result.alcohol || 0;
    const goreScore = result.gore?.prob || 0;
    const offensiveScore = result.offensive?.prob || 0;

    // Thresholds
    const AUTO_BLOCK_THRESHOLD = 0.85;
    const AUTO_FLAG_THRESHOLD = 0.50;

    // Check for auto-block conditions
    if (
      nudityScore > AUTO_BLOCK_THRESHOLD ||
      weaponScore > AUTO_BLOCK_THRESHOLD ||
      drugScore > AUTO_BLOCK_THRESHOLD ||
      goreScore > AUTO_BLOCK_THRESHOLD ||
      offensiveScore > AUTO_BLOCK_THRESHOLD
    ) {
      return {
        status: 'auto_blocked',
        nudity_score: nudityScore,
        weapon_score: weaponScore,
        drug_score: drugScore,
        gore_score: goreScore,
        offensive_score: offensiveScore,
        reason: 'Image contains prohibited content (high confidence)',
      };
    }

    // Check for auto-flag conditions
    if (
      nudityScore > AUTO_FLAG_THRESHOLD ||
      weaponScore > AUTO_FLAG_THRESHOLD ||
      drugScore > AUTO_FLAG_THRESHOLD ||
      goreScore > AUTO_FLAG_THRESHOLD ||
      offensiveScore > AUTO_FLAG_THRESHOLD
    ) {
      return {
        status: 'auto_flagged',
        nudity_score: nudityScore,
        weapon_score: weaponScore,
        drug_score: drugScore,
        gore_score: goreScore,
        offensive_score: offensiveScore,
        reason: 'Image may contain inappropriate content (requires review)',
      };
    }

    // Auto-pass
    return {
      status: 'auto_passed',
      nudity_score: nudityScore,
      weapon_score: weaponScore,
      drug_score: drugScore,
      gore_score: goreScore,
      offensive_score: offensiveScore,
    };
  } catch (error) {
    console.error('Sightengine image moderation error:', error);
    // On error, flag for manual review
    return {
      status: 'auto_flagged',
      reason: 'Moderation service error - requires manual review',
    };
  }
}

/**
 * Moderate text content using Sightengine
 */
export async function moderateText(text: string): Promise<TextModerationResult> {
  try {
    const result = await client.check(['profanity', 'personal', 'link']).set_text(text);

    // Extract scores
    const profanityScore = result.profanity?.matches?.length > 0 ? 1.0 : 0.0;
    const personalInfoScore = result.personal?.matches?.length > 0 ? 1.0 : 0.0;
    const linkScore = result.link?.matches?.length > 0 ? 1.0 : 0.0;

    // Thresholds
    const AUTO_BLOCK_THRESHOLD = 0.85;
    const AUTO_FLAG_THRESHOLD = 0.50;

    // Check for auto-block conditions
    if (profanityScore > AUTO_BLOCK_THRESHOLD) {
      return {
        status: 'auto_blocked',
        profanity_score: profanityScore,
        personal_info_score: personalInfoScore,
        link_score: linkScore,
        reason: 'Text contains severe profanity',
      };
    }

    // Check for auto-flag conditions
    if (
      profanityScore > AUTO_FLAG_THRESHOLD ||
      personalInfoScore > AUTO_FLAG_THRESHOLD ||
      linkScore > AUTO_FLAG_THRESHOLD
    ) {
      return {
        status: 'auto_flagged',
        profanity_score: profanityScore,
        personal_info_score: personalInfoScore,
        link_score: linkScore,
        reason: 'Text may contain inappropriate content (requires review)',
      };
    }

    // Auto-pass
    return {
      status: 'auto_passed',
      profanity_score: profanityScore,
      personal_info_score: personalInfoScore,
      link_score: linkScore,
    };
  } catch (error) {
    console.error('Sightengine text moderation error:', error);
    // On error, flag for manual review
    return {
      status: 'auto_flagged',
      reason: 'Moderation service error - requires manual review',
    };
  }
}

/**
 * Moderate profile bio (text moderation)
 */
export async function moderateBio(bio: string): Promise<TextModerationResult> {
  return moderateText(bio);
}

/**
 * Moderate display name (text moderation)
 */
export async function moderateDisplayName(displayName: string): Promise<TextModerationResult> {
  return moderateText(displayName);
}
