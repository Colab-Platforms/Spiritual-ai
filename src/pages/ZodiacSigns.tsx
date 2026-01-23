import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { zodiacSigns } from '@/data/zodiacData';
import ZodiacCard from '@/components/ZodiacCard';

gsap.registerPlugin(ScrollTrigger);

// Zodiac wheel component
const ZodiacWheel = () => {
  const signs = zodiacSigns.map(s => ({ name: s.name, symbol: s.symbol }));
  
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-accent/30" />
      
      {/* Inner rings */}
      <div className="absolute inset-8 rounded-full border border-accent/20" />
      <div className="absolute inset-16 rounded-full border border-accent/10" />
      
      {/* Center star pattern */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-20 h-20 text-accent/40">
          <polygon points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        </svg>
      </div>
      
      {/* Zodiac symbols around the wheel */}
      {signs.map((sign, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const radius = 42; // percentage from center
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        
        return (
          <div
            key={sign.name}
            className="absolute text-accent text-lg md:text-xl transition-all duration-300 hover:scale-125 hover:text-accent cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              textShadow: '0 0 10px rgba(232,175,93,0.5)'
            }}
            title={sign.name}
          >
            {sign.symbol}
          </div>
        );
      })}
      
      {/* Decorative lines connecting to center */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x2 = 50 + 30 * Math.cos(angle);
          const y2 = 50 + 30 * Math.sin(angle);
          return (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={x2}
              y2={y2}
              stroke="rgba(232,175,93,0.15)"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>
    </div>
  );
};

const ZodiacSigns = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      // Rotate the wheel slowly
      gsap.to(wheelRef.current, {
        rotation: 360,
        duration: 120,
        repeat: -1,
        ease: 'none'
      });

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
        {/* Header with Zodiac Wheel */}
        <div className="text-center mb-16">
          <div ref={wheelRef} className="mb-8">
            <ZodiacWheel />
          </div>
          <h1 className="page-title font-display text-4xl md:text-5xl lg:text-6xl text-glow text-primary mb-4">
            The Twelve Zodiac Signs
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the unique characteristics, traits, and cosmic energies of each zodiac sign in the celestial wheel
          </p>
        </div>

        {/* Element Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { name: 'Fire', color: '#ef4444' },
            { name: 'Earth', color: '#22c55e' },
            { name: 'Air', color: '#facc15' },
            { name: 'Water', color: '#3b82f6' }
          ].map((element) => (
            <div 
              key={element.name} 
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-[#0a0a0f]"
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: element.color, boxShadow: `0 0 8px ${element.color}` }}
              />
              <span className="text-sm text-muted-foreground">{element.name}</span>
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
