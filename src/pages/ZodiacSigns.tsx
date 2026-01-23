import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { zodiacSigns } from '@/data/zodiacData';
import ZodiacCard from '@/components/ZodiacCard';

gsap.registerPlugin(ScrollTrigger);

const ZodiacSigns = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.zodiac-card',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.zodiac-grid',
            start: 'top 85%',
          },
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="page-title font-display text-4xl md:text-5xl lg:text-6xl text-glow text-primary mb-4">
            The Twelve Zodiac Signs
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the unique characteristics, traits, and cosmic energies of each zodiac sign in the celestial wheel
          </p>
        </div>

        {/* Element Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['Fire', 'Earth', 'Air', 'Water'].map((element) => (
            <div key={element} className="flex items-center gap-2 px-4 py-2 glass-card rounded-full">
              <div 
                className={`w-3 h-3 rounded-full ${
                  element === 'Fire' ? 'bg-red-500' :
                  element === 'Earth' ? 'bg-green-500' :
                  element === 'Air' ? 'bg-yellow-400' :
                  'bg-blue-500'
                }`}
              />
              <span className="text-sm text-muted-foreground">{element}</span>
            </div>
          ))}
        </div>

        {/* Zodiac Grid */}
        <div className="zodiac-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {zodiacSigns.map((sign, index) => (
            <div key={sign.name} className="zodiac-card">
              <ZodiacCard sign={sign} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZodiacSigns;
