import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ScrollTrigger will be registered lazily when needed
let scrollTriggerRegistered = false;

const ensureScrollTriggerRegistered = (): void => {
  if (!scrollTriggerRegistered) {
    try {
      gsap.registerPlugin(ScrollTrigger);
      scrollTriggerRegistered = true;
    } catch (e) {
      console.warn('ScrollTrigger registration failed:', e);
    }
  }
};

/**
 * Hook for managing scroll-triggered animations
 * Automatically handles cleanup and respects responsive breakpoints
 * 
 * @param config - ScrollTrigger configuration
 * @param config.trigger - Element that triggers the animation
 * @param config.target - Element(s) to animate
 * @param config.animation - GSAP animation configuration
 * @param config.scrub - Whether to scrub the animation to the scrollbar (default: false)
 * @param config.markers - Whether to show debug markers (default: false)
 * @param config.enabled - Whether the animation should be enabled (default: true)
 * @returns Object with methods to control the scroll trigger
 */
interface UseScrollTriggerConfig {
  trigger: string | HTMLElement | null;
  target: string | HTMLElement | null;
  animation: gsap.TweenVars;
  scrub?: boolean | number;
  markers?: boolean;
  enabled?: boolean;
}

interface ScrollTriggerControls {
  refresh: () => void;
  kill: () => void;
  scrollTrigger: ScrollTrigger | null;
}

export const useScrollTrigger = (config: UseScrollTriggerConfig): ScrollTriggerControls => {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const { trigger, target, animation, scrub = false, markers = false, enabled = true } = config;

  useEffect(() => {
    if (!enabled || !trigger || !target) {
      return;
    }

    // Ensure ScrollTrigger is registered
    ensureScrollTriggerRegistered();

    // Create the scroll-triggered animation
    gsap.to(target, {
      scrollTrigger: {
        trigger: trigger,
        start: 'top center',
        end: 'bottom center',
        scrub: scrub,
        markers: markers,
        onUpdate: (self) => {
          scrollTriggerRef.current = self;
        },
      },
      ...animation,
    });

    // Cleanup on unmount
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [trigger, target, animation, scrub, markers, enabled]);

  return {
    refresh: () => {
      ensureScrollTriggerRegistered();
      ScrollTrigger.refresh();
    },
    kill: () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    },
    scrollTrigger: scrollTriggerRef.current,
  };
};
