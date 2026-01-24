import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { zodiacSigns } from '@/data/zodiacData';
import ZodiacCard from '@/components/ZodiacCard';

// Import zodiac line-art images
import ariesImg from '@/assets/zodiac/aries.png';
import taurusImg from '@/assets/zodiac/taurus.png';
import geminiImg from '@/assets/zodiac/gemini.png';
import cancerImg from '@/assets/zodiac/cancer.png';
import leoImg from '@/assets/zodiac/leo.png';
import virgoImg from '@/assets/zodiac/virgo.png';
import libraImg from '@/assets/zodiac/libra.png';
import scorpioImg from '@/assets/zodiac/scorpio.png';
import sagittariusImg from '@/assets/zodiac/sagittarius.png';
import capricornImg from '@/assets/zodiac/capricorn.png';
import aquariusImg from '@/assets/zodiac/aquarius.png';
import piscesImg from '@/assets/zodiac/pisces.png';

gsap.registerPlugin(ScrollTrigger);

// Zodiac images mapping
const zodiacImages: Record<string, string> = {
  Aries: ariesImg,
  Taurus: taurusImg,
  Gemini: geminiImg,
  Cancer: cancerImg,
  Leo: leoImg,
  Virgo: virgoImg,
  Libra: libraImg,
  Scorpio: scorpioImg,
  Sagittarius: sagittariusImg,
  Capricorn: capricornImg,
  Aquarius: aquariusImg,
  Pisces: piscesImg,
};

// Zodiac wheel component with real icons
const ZodiacWheel = () => {
  const WHEEL_SIZE = 320;
  const ICON_RADIUS = 120;

  return (
    <div className="relative mx-auto" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
      <svg 
        viewBox={`-${WHEEL_SIZE/2} -${WHEEL_SIZE/2} ${WHEEL_SIZE} ${WHEEL_SIZE}`}
        className="w-full h-full"
      >
        {/* SVG glow filter */}
        <defs>
          <filter id="wheelGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle cx="0" cy="0" r="150" fill="none" stroke="hsl(40 85% 65% / 0.2)" strokeWidth="1.5" />
        
        {/* Inner rings */}
        <circle cx="0" cy="0" r={ICON_RADIUS + 8} fill="none" stroke="hsl(40 85% 65% / 0.25)" strokeWidth="1.5" filter="url(#wheelGlow)" />
        <circle cx="0" cy="0" r="80" fill="none" stroke="hsl(40 85% 65% / 0.15)" strokeWidth="1" />
        <circle cx="0" cy="0" r="50" fill="none" stroke="hsl(40 85% 65% / 0.1)" strokeWidth="1" strokeDasharray="3 6" />
        
        {/* Division lines */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const innerR = 40;
          const outerR = ICON_RADIUS - 8;
          return (
            <line
              key={`div-${i}`}
              x1={Math.cos(angle) * innerR}
              y1={Math.sin(angle) * innerR}
              x2={Math.cos(angle) * outerR}
              y2={Math.sin(angle) * outerR}
              stroke="hsl(40 85% 65% / 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Center star pattern */}
        <g filter="url(#wheelGlow)">
          <circle cx="0" cy="0" r="20" fill="hsl(40 85% 65% / 0.08)" />
          <polygon 
            points="0,-15 4,-5 15,-5 6,2 10,13 0,6 -10,13 -6,2 -15,-5 -4,-5" 
            fill="none" 
            stroke="hsl(40 85% 65% / 0.4)" 
            strokeWidth="0.8"
          />
        </g>

        {/* Zodiac icons around the wheel */}
        {zodiacSigns.map((sign, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = Math.cos(angle) * ICON_RADIUS;
          const y = Math.sin(angle) * ICON_RADIUS;
          
          return (
            <g key={sign.name} transform={`translate(${x}, ${y})`}>
              <image
                href={zodiacImages[sign.name]}
                x="-18"
                y="-18"
                width="36"
                height="36"
                className="transition-all duration-300 hover:opacity-100 cursor-pointer"
                style={{ 
                  filter: 'drop-shadow(0 0 6px rgba(245, 195, 106, 0.5))',
                  opacity: 0.85,
                }}
              />
            </g>
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
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-sm" />
      
      <div className="container mx-auto px-4 relative">
        {/* Header with Zodiac Wheel */}
        <div className="text-center mb-16">
          <div ref={wheelRef} className="mb-8">
            <ZodiacWheel />
          </div>
          <h1 className="page-title font-display text-5xl md:text-6xl lg:text-7xl text-glow text-primary mb-4">
            The Twelve Zodiac Signs
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-card/40 backdrop-blur-sm"
            >
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: element.color, boxShadow: `0 0 10px ${element.color}` }}
              />
              <span className="text-base text-muted-foreground">{element.name}</span>
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