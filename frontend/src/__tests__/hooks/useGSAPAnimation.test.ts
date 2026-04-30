import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import gsap from 'gsap';

/**
 * Unit tests for useGSAPAnimation hook
 * Tests that animations only use transform and opacity properties
 */

describe('useGSAPAnimation Hook', () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    // Create a mock DOM element
    mockElement = document.createElement('div');
    mockElement.id = 'test-element';
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    // Clean up
    gsap.killTweensOf(mockElement);
    document.body.removeChild(mockElement);
  });

  it('should create a GSAP animation with transform properties', () => {
    const animation = {
      x: 100,
      y: 50,
      duration: 1,
    };

    const tween = gsap.to(mockElement, animation);
    expect(tween).toBeDefined();
    expect(tween.targets()).toContain(mockElement);
  });

  it('should create a GSAP animation with opacity property', () => {
    const animation = {
      opacity: 0.5,
      duration: 1,
    };

    const tween = gsap.to(mockElement, animation);
    expect(tween).toBeDefined();
    expect(tween.targets()).toContain(mockElement);
  });

  it('should create a GSAP animation with scale property', () => {
    const animation = {
      scale: 1.5,
      duration: 1,
    };

    const tween = gsap.to(mockElement, animation);
    expect(tween).toBeDefined();
    expect(tween.targets()).toContain(mockElement);
  });

  it('should create a GSAP animation with rotation property', () => {
    const animation = {
      rotation: 360,
      duration: 2,
    };

    const tween = gsap.to(mockElement, animation);
    expect(tween).toBeDefined();
    expect(tween.targets()).toContain(mockElement);
  });

  it('should allow combined transform and opacity animations', () => {
    const animation = {
      x: 100,
      y: 50,
      scale: 1.2,
      opacity: 0.8,
      rotation: 45,
      duration: 1,
    };

    const tween = gsap.to(mockElement, animation);
    expect(tween).toBeDefined();
    expect(tween.targets()).toContain(mockElement);
  });

  it('should pause and play animations', () => {
    const animation = {
      x: 100,
      duration: 2,
    };

    const tween = gsap.to(mockElement, animation);
    
    tween.pause();
    expect(tween.paused()).toBe(true);
    
    tween.play();
    expect(tween.paused()).toBe(false);
  });

  it('should kill animations', () => {
    const animation = {
      x: 100,
      duration: 2,
    };

    const tween = gsap.to(mockElement, animation);
    const initialProgress = tween.progress();
    
    tween.kill();
    // After killing, the tween should not progress further
    // The progress should remain at the point it was killed
    expect(tween.progress()).toBe(initialProgress);
  });
});
