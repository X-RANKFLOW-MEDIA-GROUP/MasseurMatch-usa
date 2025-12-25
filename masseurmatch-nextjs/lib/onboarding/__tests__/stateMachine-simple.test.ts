import { describe, it, expect } from 'vitest';
import {
  PHOTO_LIMITS,
  isSensitiveFieldEdit,
  getNextStage,
} from '../stateMachine';

describe('State Machine - Simple Tests', () => {
  describe('PHOTO_LIMITS', () => {
    it('should have correct limits per plan', () => {
      expect(PHOTO_LIMITS.free).toBe(1);
      expect(PHOTO_LIMITS.standard).toBe(4);
      expect(PHOTO_LIMITS.pro).toBe(8);
      expect(PHOTO_LIMITS.elite).toBe(12);
    });
  });

  describe('isSensitiveFieldEdit', () => {
    it('should return true for sensitive fields', () => {
      expect(isSensitiveFieldEdit('display_name')).toBe(true);
      expect(isSensitiveFieldEdit('bio_short')).toBe(true);
    });

    it('should return false for non-sensitive fields', () => {
      expect(isSensitiveFieldEdit('city_slug')).toBe(false);
    });
  });

  describe('getNextStage', () => {
    it('should transition from needs_plan to needs_payment for paid plans', () => {
      const next = getNextStage('needs_plan', 'select_plan', { plan: 'pro' });
      expect(next).toBe('needs_payment');
    });

    it('should transition from needs_plan to needs_identity for free plan', () => {
      const next = getNextStage('needs_plan', 'select_plan', { plan: 'free' });
      expect(next).toBe('needs_identity');
    });

    it('should transition from waiting_admin to live on approve', () => {
      const next = getNextStage('waiting_admin', 'admin_approve', {});
      expect(next).toBe('live');
    });

    it('should return null for invalid transition', () => {
      const next = getNextStage('live', 'select_plan' as any, {});
      expect(next).toBe(null);
    });
  });
});
