import { describe, it, expect } from 'vitest';
import {
  validateDisplayName,
  validateBio,
  validatePhoneE164,
  validate33PercentRule,
  validateRateCreation,
  calculatePricePerMinute,
  validateDuration,
  validatePrice,
} from '../validators';

describe('Validators', () => {
  describe('validateDisplayName', () => {
    it('should accept valid name', () => {
      const result = validateDisplayName('Jane Smith');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty name', () => {
      const result = validateDisplayName('');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('required');
    });

    it('should reject null name', () => {
      const result = validateDisplayName(null);
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('required');
    });

    it('should reject name too short', () => {
      const result = validateDisplayName('J');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('at least');
    });

    it('should reject name too long', () => {
      const result = validateDisplayName('A'.repeat(60));
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('at most');
    });

    it('should reject inappropriate content', () => {
      const result = validateDisplayName('Fuck you');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('inappropriate');
    });

    it('should trim whitespace', () => {
      const result = validateDisplayName('  Jane Smith  ');
      expect(result.valid).toBe(true);
    });
  });

  describe('validatePhoneE164', () => {
    it('should accept valid E.164 phone', () => {
      const result = validatePhoneE164('+12145551234');
      expect(result.valid).toBe(true);
    });

    it('should accept international phone', () => {
      const result = validatePhoneE164('+442071234567');
      expect(result.valid).toBe(true);
    });

    it('should reject phone without +', () => {
      const result = validatePhoneE164('12145551234');
      expect(result.valid).toBe(false);
    });

    it('should reject phone with letters', () => {
      const result = validatePhoneE164('+1214555ABCD');
      expect(result.valid).toBe(false);
    });

    it('should reject empty phone', () => {
      const result = validatePhoneE164('');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('required');
    });
  });

  describe('validateBio', () => {
    it('should accept valid bio', () => {
      const bio = 'A'.repeat(100);
      const result = validateBio(bio, 'short');
      expect(result.valid).toBe(true);
    });

    it('should accept empty bio (optional)', () => {
      const result = validateBio('', 'short');
      expect(result.valid).toBe(true);
    });

    it('should reject bio too short', () => {
      const bio = 'Too short';
      const result = validateBio(bio, 'short');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('at least');
    });

    it('should reject short bio too long', () => {
      const bio = 'A'.repeat(600);
      const result = validateBio(bio, 'short');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('at most');
    });

    it('should reject long bio too long', () => {
      const bio = 'A'.repeat(6000);
      const result = validateBio(bio, 'long');
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('at most');
    });
  });

  describe('calculatePricePerMinute', () => {
    it('should calculate correctly for 60min', () => {
      const ppm = calculatePricePerMinute(15000, 60);
      expect(ppm).toBe(250); // $2.50/min = 250 cents/min
    });

    it('should calculate correctly for 90min', () => {
      const ppm = calculatePricePerMinute(22500, 90);
      expect(ppm).toBe(250);
    });

    it('should handle decimal results', () => {
      const ppm = calculatePricePerMinute(10000, 60);
      expect(ppm).toBeCloseTo(166.67, 2);
    });
  });

  describe('validateDuration', () => {
    it('should accept valid durations', () => {
      expect(validateDuration(30).valid).toBe(true);
      expect(validateDuration(60).valid).toBe(true);
      expect(validateDuration(90).valid).toBe(true);
      expect(validateDuration(120).valid).toBe(true);
    });

    it('should reject invalid duration', () => {
      const result = validateDuration(45);
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('must be one of');
    });
  });

  describe('validatePrice', () => {
    it('should accept valid price', () => {
      const result = validatePrice(15000);
      expect(result.valid).toBe(true);
    });

    it('should reject price too low', () => {
      const result = validatePrice(1000); // $10
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('at least $50');
    });

    it('should reject price too high', () => {
      const result = validatePrice(150000); // $1500
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('at most $1000');
    });

    it('should reject zero price', () => {
      const result = validatePrice(0);
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('greater than 0');
    });

    it('should reject negative price', () => {
      const result = validatePrice(-1000);
      expect(result.valid).toBe(false);
    });
  });

  describe('validate33PercentRule', () => {
    it('should pass when rate is within 33%', () => {
      const baseRate = {
        id: '1',
        profile_id: 'test',
        context: 'incall' as const,
        duration_minutes: 60,
        price_cents: 15000, // $150 → $2.50/min
        is_active: true,
        currency: 'USD',
        notes: '',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const newRate = {
        context: 'incall' as const,
        duration_minutes: 90,
        price_cents: 29925, // $299.70 → $3.33/min (exactly 133%)
      };

      const result = validate33PercentRule(newRate, [baseRate]);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when rate exceeds 33%', () => {
      const baseRate = {
        id: '1',
        profile_id: 'test',
        context: 'incall' as const,
        duration_minutes: 60,
        price_cents: 15000, // $2.50/min
        is_active: true,
        currency: 'USD',
        notes: '',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const newRate = {
        context: 'incall' as const,
        duration_minutes: 90,
        price_cents: 32000, // $3.56/min (142% - too high)
      };

      const result = validate33PercentRule(newRate, [baseRate]);
      expect(result.valid).toBe(false);
      expect(result.errors[0].message).toContain('exceeds 33%');
    });

    it('should allow first rate (no base)', () => {
      const newRate = {
        context: 'incall' as const,
        duration_minutes: 60,
        price_cents: 15000,
      };

      const result = validate33PercentRule(newRate, []);
      expect(result.valid).toBe(true);
    });

    it('should handle new rate being shorter than base', () => {
      const baseRate = {
        id: '1',
        profile_id: 'test',
        context: 'incall' as const,
        duration_minutes: 90,
        price_cents: 22500, // $2.50/min
        is_active: true,
        currency: 'USD',
        notes: '',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const newRate = {
        context: 'incall' as const,
        duration_minutes: 60,
        price_cents: 20000, // $3.33/min (new base is 60min)
      };

      // Should validate existing rates against new base
      const result = validate33PercentRule(newRate, [baseRate]);
      expect(result.valid).toBe(true);
    });

    it('should ignore different context', () => {
      const baseRate = {
        id: '1',
        profile_id: 'test',
        context: 'incall' as const,
        duration_minutes: 60,
        price_cents: 15000,
        is_active: true,
        currency: 'USD',
        notes: '',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const newRate = {
        context: 'outcall' as const,
        duration_minutes: 60,
        price_cents: 50000, // Way higher, but different context
      };

      const result = validate33PercentRule(newRate, [baseRate]);
      expect(result.valid).toBe(true);
    });

    it('should ignore inactive rates', () => {
      const inactiveRate = {
        id: '1',
        profile_id: 'test',
        context: 'incall' as const,
        duration_minutes: 60,
        price_cents: 5000, // Very low base
        is_active: false, // INACTIVE
        currency: 'USD',
        notes: '',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const newRate = {
        context: 'incall' as const,
        duration_minutes: 90,
        price_cents: 30000, // Would violate if inactive was considered
      };

      const result = validate33PercentRule(newRate, [inactiveRate]);
      // Should pass because inactive rate is not considered
      expect(result.valid).toBe(true);
    });
  });

  describe('validateRateCreation', () => {
    it('should validate complete rate creation', () => {
      const newRate = {
        context: 'incall' as const,
        duration_minutes: 60,
        price_cents: 15000,
      };

      const result = validateRateCreation(newRate, []);
      expect(result.valid).toBe(true);
    });

    it('should fail on invalid duration', () => {
      const newRate = {
        context: 'incall' as const,
        duration_minutes: 45, // Invalid
        price_cents: 15000,
      };

      const result = validateRateCreation(newRate, []);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'duration_minutes')).toBe(true);
    });

    it('should fail on invalid price', () => {
      const newRate = {
        context: 'incall' as const,
        duration_minutes: 60,
        price_cents: 1000, // Too low
      };

      const result = validateRateCreation(newRate, []);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'price_cents')).toBe(true);
    });

    it('should fail on 33% rule violation', () => {
      const existingRate = {
        id: '1',
        profile_id: 'test',
        context: 'incall' as const,
        duration_minutes: 60,
        price_cents: 15000,
        is_active: true,
        currency: 'USD',
        notes: '',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const newRate = {
        context: 'incall' as const,
        duration_minutes: 90,
        price_cents: 40000, // Way too high
      };

      const result = validateRateCreation(newRate, [existingRate]);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('33%'))).toBe(true);
    });
  });
});
