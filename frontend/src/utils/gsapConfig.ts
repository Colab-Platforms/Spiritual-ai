import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ScrollTrigger will be registered lazily when needed
let scrollTriggerRegistered = false;

/**
 * Ensure ScrollTrigger is registered
 */
const ensureScrollTriggerRegistered = (): void => {
  if (!scrollTriggerRegistered && !gsap.plugins.scrollTrigger) {
    try {
      gsap.registerPlugin(ScrollTrigger);
      scrollTriggerRegistered = true;
    } catch (e) {
      // ScrollTrigger registration may fail in test environments without matchMedia
      console.warn('ScrollTrigger registration failed:', e);
    }
  }
};

/**
 * GSAP Configuration and Setup
 * Initializes GSAP with performance optimizations and responsive settings
 */

/**
 * Breakpoints for responsive animations
 */
export const BREAKPOINTS = {
  mobile: 768,      // < 768px: mobile
  tablet: 1024,     // 768px - 1024px: tablet
  desktop: 1025,    // > 1024px: desktop
};

/**
 * Animation performance settings
 * Only animate transform and opacity properties
 */
export const ANIMATION_CONSTRAINTS = {
  allowedProperties: [
    'x', 'y', 'z',
    'rotation', 'rotationX', 'rotationY', 'rotationZ',
    'scale', 'scaleX', 'scaleY', 'scaleZ',
    'opacity',
    'duration', 'delay', 'ease', 'onComplete', 'onStart', 'onUpdate'
  ],
  forbiddenProperties: [
    'width', 'height', 'top', 'left', 'bottom', 'right',
    'boxShadow', 'backgroundColor', 'color'
  ],
};

/**
 * Initialize GSAP with global settings
 */
export const initializeGSAP = (): void => {
  // Set default easing
  gsap.defaults({ ease: 'power2.inOut' });

  // Disable GSAP warnings in production
  if (process.env.NODE_ENV === 'production') {
    gsap.config({ nullTargetAction: 'ignore' });
  }

  // Register ScrollTrigger
  ensureScrollTriggerRegistered();
};

/**
 * Get current viewport size category
 */
export const getViewportSize = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.desktop) return 'tablet';
  return 'desktop';
};

/**
 * Check if animations should be enabled for current viewport
 */
export const shouldEnableAnimations = (): boolean => {
  return getViewportSize() !== 'mobile';
};

/**
 * Check if infinite loop animations should be enabled
 */
export const shouldEnableInfiniteLoops = (): boolean => {
  return getViewportSize() === 'desktop';
};

/**
 * Check if parallax animations should be enabled
 */
export const shouldEnableParallax = (): boolean => {
  return getViewportSize() === 'desktop';
};

/**
 * Check if cursor animations should be enabled
 */
export const shouldEnableCursorAnimations = (): boolean => {
  return getViewportSize() === 'desktop';
};

/**
 * Validate animation configuration
 * Warns if forbidden properties are used
 */
export const validateAnimationConfig = (animation: gsap.TweenVars): boolean => {
  const animationKeys = Object.keys(animation);
  const invalidProps = animationKeys.filter(
    key => ANIMATION_CONSTRAINTS.forbiddenProperties.includes(key)
  );

  if (invalidProps.length > 0) {
    console.warn(
      `GSAP Animation Warning: Using forbidden properties for performance: ${invalidProps.join(', ')}. ` +
      `Only use transform (x, y, scale, rotate) and opacity properties.`
    );
    return false;
  }

  return true;
};

/**
 * Create a responsive animation context using matchMedia
 * Returns a cleanup function
 */
export const createResponsiveContext = (
  callback: (viewport: 'mobile' | 'tablet' | 'desktop') => () => void
): (() => void) => {
  ensureScrollTriggerRegistered();
  const mm = gsap.matchMedia();
  const cleanups: (() => void)[] = [];

  // Desktop
  mm.add(`(min-width: ${BREAKPOINTS.desktop}px)`, () => {
    const cleanup = callback('desktop');
    if (cleanup) cleanups.push(cleanup);
    return cleanup;
  });

  // Tablet
  mm.add(`(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`, () => {
    const cleanup = callback('tablet');
    if (cleanup) cleanups.push(cleanup);
    return cleanup;
  });

  // Mobile
  mm.add(`(max-width: ${BREAKPOINTS.mobile - 1}px)`, () => {
    const cleanup = callback('mobile');
    if (cleanup) cleanups.push(cleanup);
    return cleanup;
  });

  // Return cleanup function
  return () => {
    cleanups.forEach(cleanup => cleanup?.());
    mm.revert();
  };
};

/**
 * Disable animations on mobile using matchMedia
 * Useful for performance optimization
 */
export const disableAnimationsOnMobile = (animation: gsap.core.Tween | gsap.core.Timeline): void => {
  ensureScrollTriggerRegistered();
  const mm = gsap.matchMedia();

  mm.add(`(max-width: ${BREAKPOINTS.mobile - 1}px)`, () => {
    animation.pause();
    return () => animation.play();
  });
};

/**
 * Refresh ScrollTrigger on window resize
 * Useful for responsive layouts
 */
export const refreshScrollTrigger = (): void => {
  ensureScrollTriggerRegistered();
  ScrollTrigger.refresh();
};

/**
 * Kill all GSAP animations and ScrollTriggers
 * Useful for cleanup
 */
export const killAllAnimations = (): void => {
  gsap.killTweensOf('*');
  if (scrollTriggerRegistered) {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
};
