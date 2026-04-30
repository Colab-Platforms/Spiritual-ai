import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useIsDesktop } from '../hooks/useIsDesktop';

export const FinalCTASection: React.FC = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!isDesktop || !buttonRef.current) return;

    // Pulse animation for button
    gsap.to(buttonRef.current, {
      boxShadow: [
        '0 0 20px rgba(212, 175, 55, 0.5)',
        '0 0 40px rgba(212, 175, 55, 0.8)',
        '0 0 20px rgba(212, 175, 55, 0.5)',
      ],
      duration: 2,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }, [isDesktop]);

  const handleClick = () => {
    // Scroll to hero section
    const heroSection = document.querySelector('section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 px-4 md:px-8 bg-dark-primary overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-accent-gold mb-8">
          Your Kundali is already written.
          <br />
          Have you read it yet?
        </h2>

        <p className="font-inter text-lg text-text-light/80 mb-12">
          Discover the cosmic blueprint of your life. Your personalized birth chart awaits.
        </p>

        <button
          ref={buttonRef}
          onClick={handleClick}
          className="px-8 py-4 rounded-lg bg-accent-gold/20 border-2 border-accent-gold text-accent-gold font-cinzel font-bold text-lg hover:bg-accent-gold/30 transition-colors duration-300"
        >
          Generate My Kundali
        </button>
      </div>
    </section>
  );
};

export default FinalCTASection;
