import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  BREAKPOINTS,
  ANIMATION_CONSTRAINTS,
  getViewportSize,
  shouldEnableAnimations,
  shouldEnableInfiniteLoops,
  shouldEnableParallax,
  shouldEnableCursorAnimations,
  validateAnimationConfig,
} from '../../utils/gsapConfig';

/**
 * Unit tests for GSAP configuration utilities
 * Tests responsive animation settings and constraints
 */

describe('GSAP Configuration', () => {
  describe('Breakpoints', () => {
    it('should define correct breakpoint values', () => {
      expect(BREAKPOINTS.mobile).toBe(768);
      expect(BREAKPOINTS.tablet).toBe(1024);
      expect(BREAKPOINTS.desktop).toBe(1025);
    });
  });

  describe('Animation Constraints', () => {
    it('should include allowed transform properties', () => {
      const allowedProps = ANIMATION_CONSTRAINTS.allowedProperties;
      expect(allowedProps).toContain('x');
      expect(allowedProps).toContain('y');
      expect(allowedProps).toContain('scale');
      expect(allowedProps).toContain('rotation');
      expect(allowedProps).toContain('opacity');
    });

    it('should include forbidden properties', () => {
      const forbiddenProps = ANIMATION_CONSTRAINTS.forbiddenProperties;
      expect(forbiddenProps).toContain('width');
      expect(forbiddenProps).toContain('height');
      expect(forbiddenProps).toContain('top');
      expect(forbiddenProps).toContain('left');
      expect(forbiddenProps).toContain('boxShadow');
    });
  });

  describe('Viewport Size Detection', () => {
    beforeEach(() => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });
    });

    afterEach(() => {
      // Restore original value
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('should detect desktop viewport (> 1024px)', () => {
      window.innerWidth = 1200;
      expect(getViewportSize()).toBe('desktop');
    });

    it('should detect tablet viewport (768px - 1024px)', () => {
      window.innerWidth = 900;
      expect(getViewportSize()).toBe('tablet');
    });

    it('should detect mobile viewport (< 768px)', () => {
      window.innerWidth = 500;
      expect(getViewportSize()).toBe('mobile');
    });

    it('should detect boundary at 768px as tablet', () => {
      window.innerWidth = 768;
      expect(getViewportSize()).toBe('tablet');
    });

    it('should detect boundary at 1024px as tablet', () => {
      window.innerWidth = 1024;
      expect(getViewportSize()).toBe('tablet');
    });

    it('should detect boundary at 1025px as desktop', () => {
      window.innerWidth = 1025;
      expect(getViewportSize()).toBe('desktop');
    });
  });

  describe('Animation Enablement Checks', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('should enable animations on desktop', () => {
      window.innerWidth = 1200;
      expect(shouldEnableAnimations()).toBe(true);
    });

    it('should enable animations on tablet', () => {
      window.innerWidth = 900;
      expect(shouldEnableAnimations()).toBe(true);
    });

    it('should disable animations on mobile', () => {
      window.innerWidth = 500;
      expect(shouldEnableAnimations()).toBe(false);
    });

    it('should enable infinite loops only on desktop', () => {
      window.innerWidth = 1200;
      expect(shouldEnableInfiniteLoops()).toBe(true);

      window.innerWidth = 500;
      expect(shouldEnableInfiniteLoops()).toBe(false);
    });

    it('should enable parallax only on desktop', () => {
      window.innerWidth = 1200;
      expect(shouldEnableParallax()).toBe(true);

      window.innerWidth = 500;
      expect(shouldEnableParallax()).toBe(false);
    });

    it('should enable cursor animations only on desktop', () => {
      window.innerWidth = 1200;
      expect(shouldEnableCursorAnimations()).toBe(true);

      window.innerWidth = 500;
      expect(shouldEnableCursorAnimations()).toBe(false);
    });
  });

  describe('Animation Configuration Validation', () => {
    it('should validate animation with allowed properties', () => {
      const animation = {
        x: 100,
        y: 50,
        opacity: 0.8,
        duration: 1,
      };

      expect(validateAnimationConfig(animation)).toBe(true);
    });

    it('should warn about forbidden properties', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const animation = {
        x: 100,
        width: 200, // forbidden
        duration: 1,
      };

      expect(validateAnimationConfig(animation)).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
      
      warnSpy.mockRestore();
    });

    it('should warn about multiple forbidden properties', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const animation = {
        x: 100,
        width: 200,
        height: 300,
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        duration: 1,
      };

      expect(validateAnimationConfig(animation)).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
      
      warnSpy.mockRestore();
    });

    it('should allow scale, rotation, and other transform properties', () => {
      const animation = {
        scale: 1.5,
        rotation: 45,
        scaleX: 1.2,
        scaleY: 0.8,
        rotationX: 30,
        duration: 1,
      };

      expect(validateAnimationConfig(animation)).toBe(true);
    });

    it('should allow z-axis transform properties', () => {
      const animation = {
        z: 100,
        rotationZ: 45,
        scaleZ: 1.5,
        duration: 1,
      };

      expect(validateAnimationConfig(animation)).toBe(true);
    });
  });
});
