import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const StarField = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const stars: HTMLDivElement[] = [];
    const container = containerRef.current;

    // Create stars
    for (let i = 0; i < 150; i++) {
      const star = document.createElement('div');
      star.className = 'absolute rounded-full';
      
      const size = Math.random() * 3 + 1;
      const opacity = Math.random() * 0.8 + 0.2;
      
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.backgroundColor = size > 2 
        ? `hsl(45, 100%, ${60 + Math.random() * 20}%)` 
        : `hsl(240, 30%, ${85 + Math.random() * 15}%)`;
      star.style.opacity = `${opacity}`;
      star.style.boxShadow = size > 2 
        ? `0 0 ${size * 4}px hsl(45, 100%, 60%)` 
        : 'none';
      
      container.appendChild(star);
      stars.push(star);

      // Animate each star
      gsap.to(star, {
        opacity: opacity * 0.3,
        duration: 1 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      });
    }

    return () => {
      stars.forEach(star => star.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};

export default StarField;
