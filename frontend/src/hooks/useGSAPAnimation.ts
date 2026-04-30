import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook for managing GSAP animations on DOM elements
 * Ensures animations only use transform and opacity properties for performance
 * 
 * @param config - Animation configuration object
 * @param config.target - CSS selector or DOM element to animate
 * @param config.animation - GSAP animation configuration (vars object)
 * @param config.trigger - Optional trigger element for scroll-based animations
 * @param config.enabled - Whether the animation should be enabled (default: true)
 * @returns Object with methods to control the animation
 */
interface UseGSAPAnimationConfig {
  target: string | HTMLElement | null;
  animation: gsap.TweenVars;
  trigger?: string | HTMLElement;
  enabled?: boolean;
}

interface AnimationControls {
  play: () => void;
  pause: () => void;
  kill: () => void;
  tween: gsap.core.Tween | null;
}

export const useGSAPAnimation = (config: UseGSAPAnimationConfig): AnimationControls => {
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const { target, animation, enabled = true } = config;

  useEffect(() => {
    if (!enabled || !target) {
      return;
    }

    // Validate that animation only uses allowed properties (transform, opacity)
    const allowedProps = ['x', 'y', 'z', 'rotation', 'rotationX', 'rotationY', 'rotationZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'opacity', 'duration', 'delay', 'ease', 'onComplete', 'onStart', 'onUpdate'];
    const animationKeys = Object.keys(animation);
    const invalidProps = animationKeys.filter(key => !allowedProps.includes(key));

    if (invalidProps.length > 0) {
      console.warn(`useGSAPAnimation: Animation contains non-transform/opacity properties: ${invalidProps.join(', ')}. These may cause performance issues.`);
    }

    // Create the animation
    tweenRef.current = gsap.to(target, animation);

    // Cleanup on unmount
    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, [target, animation, enabled]);

  return {
    play: () => tweenRef.current?.play(),
    pause: () => tweenRef.current?.pause(),
    kill: () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
    },
    tween: tweenRef.current,
  };
};
