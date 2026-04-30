import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook for managing responsive animations using GSAP matchMedia
 * Enables/disables animations based on viewport size
 * 
 * Desktop (> 1024px): All animations enabled
 * Tablet (768px - 1024px): Most animations enabled, some reduced
 * Mobile (< 768px): Animations disabled or simplified
 * 
 * @param config - Responsive animation configuration
 * @param config.target - Element to animate
 * @param config.desktopAnimation - Animation for desktop viewports (> 1024px)
 * @param config.tabletAnimation - Animation for tablet viewports (768px - 1024px), optional
 * @param config.mobileAnimation - Animation for mobile viewports (< 768px), optional
 * @returns Object with methods to control the animation
 */
interface UseResponsiveAnimationConfig {
  target: string | HTMLElement | null;
  desktopAnimation: gsap.TweenVars;
  tabletAnimation?: gsap.TweenVars;
  mobileAnimation?: gsap.TweenVars;
}

interface ResponsiveAnimationControls {
  kill: () => void;
  refresh: () => void;
}

export const useResponsiveAnimation = (config: UseResponsiveAnimationConfig): ResponsiveAnimationControls => {
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const { target, desktopAnimation, tabletAnimation, mobileAnimation } = config;

  useEffect(() => {
    if (!target) {
      return;
    }

    // Create matchMedia context
    const mm = gsap.matchMedia();

    // Desktop animations (> 1024px)
    mm.add('(min-width: 1025px)', () => {
      const tween = gsap.to(target, desktopAnimation);
      tweensRef.current.push(tween);
      return () => tween.kill();
    });

    // Tablet animations (768px - 1024px)
    if (tabletAnimation) {
      mm.add('(min-width: 768px) and (max-width: 1024px)', () => {
        const tween = gsap.to(target, tabletAnimation);
        tweensRef.current.push(tween);
        return () => tween.kill();
      });
    }

    // Mobile animations (< 768px)
    if (mobileAnimation) {
      mm.add('(max-width: 767px)', () => {
        const tween = gsap.to(target, mobileAnimation);
        tweensRef.current.push(tween);
        return () => tween.kill();
      });
    } else {
      // If no mobile animation provided, disable animations on mobile
      mm.add('(max-width: 767px)', () => {
        // Return empty cleanup function - no animation on mobile
        return () => {};
      });
    }

    // Cleanup on unmount
    return () => {
      tweensRef.current.forEach(tween => tween.kill());
      tweensRef.current = [];
      mm.revert();
    };
  }, [target, desktopAnimation, tabletAnimation, mobileAnimation]);

  return {
    kill: () => {
      tweensRef.current.forEach(tween => tween.kill());
      tweensRef.current = [];
    },
    refresh: () => {
      gsap.matchMedia().revert();
    },
  };
};
