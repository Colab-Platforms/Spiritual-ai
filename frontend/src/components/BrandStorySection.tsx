import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIsDesktop } from '../hooks/useIsDesktop';

export const BrandStorySection: React.FC = () => {
  const starsRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!isDesktop || !starsRef.current) return;

    // Parallax star animations
    const stars = starsRef.current.querySelectorAll('[data-star]');
    stars.forEach((star) => {
      gsap.to(star, {
        y: -50,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 0.2,
      });
    });
  }, [isDesktop]);

  return (
    <section className="relative py-20 px-4 md:px-8 bg-dark-primary overflow-hidden">
      {/* Parallax stars background */}
      <div ref={starsRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            data-star
            className="absolute w-2 h-2 rounded-full bg-accent-gold/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-accent-gold mb-8">
          Built for the Modern Believer
        </h2>

        <p className="font-inter text-lg text-text-light/80 leading-relaxed mb-6">
          In a world of constant change and uncertainty, we believe in the power of self-knowledge. 
          Our mission is to make ancient astrological wisdom accessible to everyone, regardless of 
          their background or experience.
        </p>

        <p className="font-inter text-lg text-text-light/80 leading-relaxed mb-6">
          We combine cutting-edge technology with time-honored astrological principles to create 
          a platform that feels both mystical and modern. Your birth chart is not just data—it's 
          a story written in the stars, waiting to be discovered.
        </p>

        <p className="font-inter text-lg text-text-light/80 leading-relaxed">
          Whether you're seeking clarity, guidance, or simply a deeper understanding of yourself, 
          we're here to help you read what the universe has written for you.
        </p>
      </div>
    </section>
  );
};

export default BrandStorySection;
