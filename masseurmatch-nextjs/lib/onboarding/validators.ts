/**
 * Onboarding Validation Rules
 *
 * Contains all validation logic for profile fields, rates, photos, etc.
 */

import { RateContext, ProfileRate } from './stateMachine';

// ============================================================================
// Constants
// ============================================================================

export const RATE_33_PERCENT_MULTIPLIER = 1.33;

export const MIN_BIO_LENGTH = 50;
export const MAX_BIO_SHORT_LENGTH = 500;
export const MAX_BIO_LONG_LENGTH = 5000;

export const MIN_DISPLAY_NAME_LENGTH = 2;
export const MAX_DISPLAY_NAME_LENGTH = 50;

export const MIN_OUTCALL_RADIUS = 5;
export const MAX_OUTCALL_RADIUS = 100;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const ALLOWED_DURATIONS = [30, 60, 90, 120, 180, 240];

// ============================================================================
// Field Validators
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FieldValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate display name
 */
export function validateDisplayName(name: string | null | undefined): FieldValidationResult {
  const errors: ValidationError[] = [];

  if (!name || !name.trim()) {
    errors.push({
      field: 'display_name',
      message: 'Display name is required',
    });
    return { valid: false, errors };
  }

  const trimmed = name.trim();

  if (trimmed.length < MIN_DISPLAY_NAME_LENGTH) {
    errors.push({
      field: 'display_name',
      message: `Display name must be at least ${MIN_DISPLAY_NAME_LENGTH} characters`,
    });
  }

  if (trimmed.length > MAX_DISPLAY_NAME_LENGTH) {
    errors.push({
      field: 'display_name',
      message: `Display name must be at most ${MAX_DISPLAY_NAME_LENGTH} characters`,
    });
  }

  // Check for inappropriate content (basic)
  const inappropriate = /\b(fuck|shit|bitch|damn|sex|xxx)\b/gi;
  if (inappropriate.test(trimmed)) {
    errors.push({
      field: 'display_name',
      message: 'Display name contains inappropriate content',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate bio (short or long)
 */
export function validateBio(
  bio: string | null | undefined,
  type: 'short' | 'long'
): FieldValidationResult {
  const errors: ValidationError[] = [];
  const fieldName = type === 'short' ? 'bio_short' : 'bio_long';
  const maxLength = type === 'short' ? MAX_BIO_SHORT_LENGTH : MAX_BIO_LONG_LENGTH;

  if (!bio || !bio.trim()) {
    // Bio is optional, but if provided must be valid
    return { valid: true, errors: [] };
  }

  const trimmed = bio.trim();

  if (trimmed.length < MIN_BIO_LENGTH) {
    errors.push({
      field: fieldName,
      message: `Bio must be at least ${MIN_BIO_LENGTH} characters`,
    });
  }

  if (trimmed.length > maxLength) {
    errors.push({
      field: fieldName,
      message: `Bio must be at most ${maxLength} characters`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate phone number (E.164 format)
 */
export function validatePhoneE164(phone: string | null | undefined): FieldValidationResult {
  const errors: ValidationError[] = [];

  if (!phone || !phone.trim()) {
    errors.push({
      field: 'phone_public_e164',
      message: 'Phone number is required',
    });
    return { valid: false, errors };
  }

  const e164Regex = /^\+[1-9]\d{1,14}$/;
  if (!e164Regex.test(phone)) {
    errors.push({
      field: 'phone_public_e164',
      message: 'Phone number must be in E.164 format (e.g., +1234567890)',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate outcall radius
 */
export function validateOutcallRadius(
  radius: number | null | undefined
): FieldValidationResult {
  const errors: ValidationError[] = [];

  if (radius === null || radius === undefined) {
    return { valid: true, errors: [] }; // Optional
  }

  if (radius < MIN_OUTCALL_RADIUS) {
    errors.push({
      field: 'outcall_radius_miles',
      message: `Radius must be at least ${MIN_OUTCALL_RADIUS} miles`,
    });
  }

  if (radius > MAX_OUTCALL_RADIUS) {
    errors.push({
      field: 'outcall_radius_miles',
      message: `Radius must be at most ${MAX_OUTCALL_RADIUS} miles`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): FieldValidationResult {
  const errors: ValidationError[] = [];

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    errors.push({
      field: 'photo',
      message: `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    });
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    errors.push({
      field: 'photo',
      message: `File size must be less than ${MAX_IMAGE_SIZE_MB}MB`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Rate Validators
// ============================================================================

/**
 * Validate rate duration
 */
export function validateDuration(duration: number): FieldValidationResult {
  const errors: ValidationError[] = [];

  if (!ALLOWED_DURATIONS.includes(duration)) {
    errors.push({
      field: 'duration_minutes',
      message: `Duration must be one of: ${ALLOWED_DURATIONS.join(', ')} minutes`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate rate price
 */
export function validatePrice(priceCents: number): FieldValidationResult {
  const errors: ValidationError[] = [];

  if (priceCents <= 0) {
    errors.push({
      field: 'price_cents',
      message: 'Price must be greater than 0',
    });
  }

  // Minimum price: $50
  if (priceCents < 5000) {
    errors.push({
      field: 'price_cents',
      message: 'Price must be at least $50.00',
    });
  }

  // Maximum price: $1000
  if (priceCents > 100000) {
    errors.push({
      field: 'price_cents',
      message: 'Price must be at most $1000.00',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate price per minute
 */
export function calculatePricePerMinute(priceCents: number, durationMinutes: number): number {
  return priceCents / durationMinutes;
}

/**
 * Validate 33% rule for rates
 *
 * No rate can have price/min > 133% of the base rate price/min
 * Base rate = shortest duration for the same context
 */
export function validate33PercentRule(
  newRate: { context: RateContext; duration_minutes: number; price_cents: number },
  existingRates: ProfileRate[]
): FieldValidationResult {
  const errors: ValidationError[] = [];

  // Filter to same context and active rates
  const sameContextRates = existingRates.filter(
    (r) => r.context === newRate.context && r.is_active
  );

  // If no existing rates, this becomes the base
  if (sameContextRates.length === 0) {
    return { valid: true, errors: [] };
  }

  // Find base rate (shortest duration)
  const baseRate = sameContextRates.reduce((shortest, current) =>
    current.duration_minutes < shortest.duration_minutes ? current : shortest
  );

  // Determine which is actually the base (new or existing)
  let basePricePerMin: number;
  let newPricePerMin: number;

  if (newRate.duration_minutes < baseRate.duration_minutes) {
    // New rate is shorter, it becomes the base
    basePricePerMin = calculatePricePerMinute(newRate.price_cents, newRate.duration_minutes);
    newPricePerMin = calculatePricePerMinute(baseRate.price_cents, baseRate.duration_minutes);
  } else {
    // Existing rate is base
    basePricePerMin = calculatePricePerMinute(baseRate.price_cents, baseRate.duration_minutes);
    newPricePerMin = calculatePricePerMinute(newRate.price_cents, newRate.duration_minutes);
  }

  const maxAllowedPerMin = basePricePerMin * RATE_33_PERCENT_MULTIPLIER;

  if (newPricePerMin > maxAllowedPerMin) {
    errors.push({
      field: 'price_cents',
      message: `Price per minute ($${(newPricePerMin / 100).toFixed(2)}) exceeds 33% above base rate ($${(basePricePerMin / 100).toFixed(2)}). Maximum allowed: $${(maxAllowedPerMin / 100).toFixed(2)}`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Batch Validators
// ============================================================================

/**
 * Validate entire profile
 */
export function validateProfile(profile: {
  display_name?: string;
  bio_short?: string;
  bio_long?: string;
  phone_public_e164?: string;
  outcall_radius_miles?: number;
}): FieldValidationResult {
  const allErrors: ValidationError[] = [];

  // Display name
  const nameResult = validateDisplayName(profile.display_name);
  allErrors.push(...nameResult.errors);

  // Phone
  const phoneResult = validatePhoneE164(profile.phone_public_e164);
  allErrors.push(...phoneResult.errors);

  // Bios (optional but if provided must be valid)
  if (profile.bio_short) {
    const bioShortResult = validateBio(profile.bio_short, 'short');
    allErrors.push(...bioShortResult.errors);
  }

  if (profile.bio_long) {
    const bioLongResult = validateBio(profile.bio_long, 'long');
    allErrors.push(...bioLongResult.errors);
  }

  // Outcall radius (optional)
  if (profile.outcall_radius_miles !== undefined) {
    const radiusResult = validateOutcallRadius(profile.outcall_radius_miles);
    allErrors.push(...radiusResult.errors);
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Validate rate creation
 */
export function validateRateCreation(
  rate: { context: RateContext; duration_minutes: number; price_cents: number },
  existingRates: ProfileRate[]
): FieldValidationResult {
  const allErrors: ValidationError[] = [];

  // Duration
  const durationResult = validateDuration(rate.duration_minutes);
  allErrors.push(...durationResult.errors);

  // Price
  const priceResult = validatePrice(rate.price_cents);
  allErrors.push(...priceResult.errors);

  // 33% rule
  const ruleResult = validate33PercentRule(rate, existingRates);
  allErrors.push(...ruleResult.errors);

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Format price for display
 */
export function formatPrice(priceCents: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return formatter.format(priceCents / 100);
}

/**
 * Format validation errors for API response
 */
export function formatValidationErrors(errors: ValidationError[]) {
  return errors.reduce(
    (acc, err) => {
      if (!acc[err.field]) {
        acc[err.field] = [];
      }
      acc[err.field].push(err.message);
      return acc;
    },
    {} as Record<string, string[]>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default {
  validateDisplayName,
  validateBio,
  validatePhoneE164,
  validateOutcallRadius,
  validateImageFile,
  validateDuration,
  validatePrice,
  validate33PercentRule,
  validateProfile,
  validateRateCreation,
  calculatePricePerMinute,
  formatPrice,
  formatValidationErrors,
};
