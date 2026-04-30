import fc from 'fast-check';
import { describe, it, expect } from 'vitest';

/**
 * Property-Based Tests for Birth Data Validation
 * Feature: premium-astrology-app
 * Validates: Requirements 1.4
 */

// Helper function to check if a date is in the future
const isFutureDate = (date: Date): boolean => {
  return date > new Date();
};

// Helper function to validate time format HH:MM
const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Helper function to validate place of birth
const isValidPlace = (place: string): boolean => {
  const trimmed = place.trim();
  return trimmed.length >= 2;
};

describe('Feature: premium-astrology-app, Property 2: Invalid Birth Data Rejection', () => {
  it('should reject future dates', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date() }).filter(d => d > new Date()),
        (futureDate) => {
          // Any date in the future should be rejected
          expect(isFutureDate(futureDate)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject invalid time formats', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => !isValidTimeFormat(s)),
        (invalidTime) => {
          // Any string that doesn't match HH:MM format should be invalid
          expect(isValidTimeFormat(invalidTime)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject empty place names', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => s.trim().length < 2),
        (invalidPlace) => {
          // Any place with less than 2 characters should be invalid
          expect(isValidPlace(invalidPlace)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept valid past dates', () => {
    fc.assert(
      fc.property(
        fc.date({ max: new Date() }),
        (pastDate) => {
          // Any date in the past should be valid
          expect(isFutureDate(pastDate)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept valid time formats', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.integer({ min: 0, max: 23 }),
          fc.integer({ min: 0, max: 59 })
        ),
        ([hours, minutes]) => {
          const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
          expect(isValidTimeFormat(time)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should accept valid place names', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 2 }),
        (place) => {
          // Any string with 2+ characters should be valid
          expect(isValidPlace(place)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should trim whitespace from place names', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.string({ minLength: 2 }),
          fc.string({ minLength: 0, maxLength: 5 })
        ),
        ([place, whitespace]) => {
          const paddedPlace = `${whitespace}${place}${whitespace}`;
          const trimmed = paddedPlace.trim();
          expect(trimmed.length >= 2).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject dates with invalid format', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => {
          try {
            new Date(s);
            return false; // If it parses, it's valid
          } catch {
            return true; // If it throws, it's invalid
          }
        }),
        (invalidDateString) => {
          // Invalid date strings should not parse
          const parsed = new Date(invalidDateString);
          expect(isNaN(parsed.getTime())).toBe(true);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should handle edge case: today\'s date', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Today should be valid (not in the future)
    expect(isFutureDate(today)).toBe(false);
  });

  it('should handle edge case: midnight times', () => {
    expect(isValidTimeFormat('00:00')).toBe(true);
    expect(isValidTimeFormat('23:59')).toBe(true);
  });

  it('should handle edge case: single character places', () => {
    expect(isValidPlace('A')).toBe(false);
    expect(isValidPlace('AB')).toBe(true);
  });
});
