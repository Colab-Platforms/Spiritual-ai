import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, Flame, Mountain, Wind, Droplets } from 'lucide-react';
import { zodiacSigns, ZodiacSign } from '@/data/zodiacData';

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

// Element icons mapping
const elementIcons = {
  Fire: Flame,
  Earth: Mountain,
  Air: Wind,
  Water: Droplets,
};

// Element colors
const elementColors = {
  Fire: 'text-orange-400',
  Earth: 'text-green-400',
  Air: 'text-sky-400',
  Water: 'text-blue-400',
};

const AUTO_CYCLE_INTERVAL = 5000;
const INACTIVITY_TIMEOUT = 12000;
const WHEEL_SIZE = 480; // Fixed wheel size for perfect circle
const ICON_ORBIT_RADIUS = 180; // Radius where icons sit

export const ZodiacWheelSection = () => {
  const navigate = useNavigate();
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>(zodiacSigns[0]);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const wheelRef = useRef<SVGGElement>(null);
  const rotationRef = useRef<gsap.core.Tween | null>(null);
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Initialize continuous wheel rotation
  useEffect(() => {
    if (wheelRef.current) {
      rotationRef.current = gsap.to(wheelRef.current, {
        rotation: 360,
        duration: 90,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center center',
      });
    }

    return () => {
      rotationRef.current?.kill();
    };
  }, []);

  // Get random zodiac (different from current)
  const getRandomSign = useCallback(() => {
    let newSign: ZodiacSign;
    do {
      const randomIndex = Math.floor(Math.random() * zodiacSigns.length);
      newSign = zodiacSigns[randomIndex];
    } while (newSign.name === selectedSign.name);
    return newSign;
  }, [selectedSign]);

  // Auto-cycling logic
  useEffect(() => {
    if (isAutoMode) {
      autoIntervalRef.current = setInterval(() => {
        if (!isAnimating) {
          setIsAnimating(true);
          const newSign = getRandomSign();
          setTimeout(() => {
            setSelectedSign(newSign);
            setIsAnimating(false);
          }, 150);
        }
      }, AUTO_CYCLE_INTERVAL);
    }

    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    };
  }, [isAutoMode, getRandomSign, isAnimating]);

  // Reset inactivity timeout
  const resetInactivityTimeout = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    inactivityTimeoutRef.current = setTimeout(() => {
      setIsAutoMode(true);
    }, INACTIVITY_TIMEOUT);
  }, []);

  // Handle sign click
  const handleSignClick = useCallback((sign: ZodiacSign) => {
    setIsAutoMode(false);
    setIsAnimating(true);
    
    setTimeout(() => {
      setSelectedSign(sign);
      setIsAnimating(false);
    }, 100);
    
    resetInactivityTimeout();
  }, [resetInactivityTimeout]);

  // Navigate to detail page with transition
  const handleReadMore = useCallback(() => {
    navigate(`/zodiac/${selectedSign.name.toLowerCase()}`);
  }, [navigate, selectedSign]);

  // Calculate position for each zodiac on the wheel (perfect mathematical circle)
  const getZodiacPosition = (index: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180); // Start from top, 30° apart
    return {
      x: Math.cos(angle) * ICON_ORBIT_RADIUS,
      y: Math.sin(angle) * ICON_ORBIT_RADIUS,
      angleDeg: index * 30,
    };
  };

  const ElementIcon = elementIcons[selectedSign.element];

  return (
    <section ref={sectionRef} className="relative z-10 py-20 overflow-hidden">
      {/* Transparent glassmorphism background */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      
      {/* Background cosmic effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl tracking-wider text-glow text-primary mb-4">
            The Twelve Zodiac Signs
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto tracking-wide">
            Explore the cosmic wisdom of each celestial sign
          </p>
        </div>

        {/* Main content - Left info + Right wheel */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[550px]">
          {/* Left: Info Panel */}
          <div className="order-2 lg:order-1">
            <div className="glass-card rounded-3xl p-8 md:p-10 min-h-[420px] flex flex-col justify-center relative overflow-hidden bg-card/30 backdrop-blur-xl border-primary/10">
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-primary/40" />
              <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-primary/40" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-primary/40" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-primary/40" />

              {/* Auto mode indicator */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <div className={`flex items-center gap-2 text-xs uppercase tracking-widest transition-opacity duration-300 ${isAutoMode ? 'opacity-60' : 'opacity-0'}`}>
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-muted-foreground">Auto-exploring</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedSign.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="flex flex-col"
                >
                  {/* Element badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <ElementIcon className={`w-5 h-5 ${elementColors[selectedSign.element]}`} />
                    <span className={`text-base uppercase tracking-[0.2em] ${elementColors[selectedSign.element]}`}>
                      {selectedSign.element} Element
                    </span>
                  </div>

                  {/* Zodiac image + name */}
                  <div className="flex items-center gap-5 mb-4">
                    <div className="w-20 h-20 relative flex-shrink-0">
                      <img 
                        src={zodiacImages[selectedSign.name]} 
                        alt={selectedSign.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(245,195,106,0.5)]"
                        style={{ imageRendering: 'crisp-edges' }}
                      />
                    </div>
                    <div>
                      <h3 className="font-display text-4xl md:text-5xl tracking-wider text-foreground">
                        {selectedSign.name}
                      </h3>
                      <p className="text-muted-foreground text-xl tracking-wide">
                        {selectedSign.dates}
                      </p>
                    </div>
                  </div>

                  {/* Ruling planet */}
                  <div className="text-base text-muted-foreground mb-4">
                    Ruled by <span className="text-primary font-medium">{selectedSign.ruling}</span>
                  </div>

                  {/* Description */}
                  <p className="text-foreground/90 text-lg leading-relaxed mb-6">
                    {selectedSign.description}
                  </p>

                  {/* Traits preview */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedSign.traits.slice(0, 4).map((trait, index) => (
                      <span 
                        key={index}
                        className="px-4 py-1.5 text-sm rounded-full border border-primary/30 text-primary/90 bg-primary/5"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Read more button */}
                  <motion.button
                    onClick={handleReadMore}
                    className="btn-outline-cosmic btn-pulse px-8 py-3.5 rounded-lg inline-flex items-center gap-2 w-fit group text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Read Full Profile</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Zodiac Wheel - Perfect Circle SVG */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div 
              className="relative" 
              style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
            >
              <svg 
                viewBox={`-${WHEEL_SIZE/2} -${WHEEL_SIZE/2} ${WHEEL_SIZE} ${WHEEL_SIZE}`}
                className="w-full h-full"
                style={{ overflow: 'visible' }}
              >
                {/* SVG Filters for glow effects */}
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Static outer decorative ring */}
                <circle 
                  cx="0" cy="0" r="225" 
                  fill="none" 
                  stroke="hsl(40 85% 65% / 0.15)" 
                  strokeWidth="1"
                />
                
                {/* Static orbit ring where icons sit */}
                <circle 
                  cx="0" cy="0" r={ICON_ORBIT_RADIUS + 10} 
                  fill="none" 
                  stroke="hsl(40 85% 65% / 0.25)" 
                  strokeWidth="1.5"
                  style={{ filter: 'url(#glow)' }}
                />
                
                {/* Inner static rings */}
                <circle 
                  cx="0" cy="0" r="130" 
                  fill="none" 
                  stroke="hsl(40 85% 65% / 0.15)" 
                  strokeWidth="1"
                />
                <circle 
                  cx="0" cy="0" r="80" 
                  fill="none" 
                  stroke="hsl(40 85% 65% / 0.1)" 
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />

                {/* Static division lines */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180);
                  const innerR = 60;
                  const outerR = ICON_ORBIT_RADIUS - 10;
                  return (
                    <line
                      key={`line-${i}`}
                      x1={Math.cos(angle) * innerR}
                      y1={Math.sin(angle) * innerR}
                      x2={Math.cos(angle) * outerR}
                      y2={Math.sin(angle) * outerR}
                      stroke="hsl(40 85% 65% / 0.12)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Center sun symbol */}
                <g filter="url(#glowStrong)">
                  <circle cx="0" cy="0" r="25" fill="hsl(40 85% 65% / 0.08)" />
                  <circle cx="0" cy="0" r="15" fill="hsl(40 85% 65% / 0.12)" />
                  <text 
                    x="0" y="6" 
                    textAnchor="middle" 
                    fontSize="24" 
                    fill="hsl(40 85% 65%)"
                  >
                    ☉
                  </text>
                </g>

                {/* Rotating group for zodiac icons */}
                <g ref={wheelRef}>
                  {zodiacSigns.map((sign, index) => {
                    const { x, y, angleDeg } = getZodiacPosition(index);
                    const isSelected = selectedSign.name === sign.name;
                    
                    return (
                      <g 
                        key={sign.name}
                        transform={`translate(${x}, ${y})`}
                        onClick={() => handleSignClick(sign)}
                        style={{ cursor: 'pointer' }}
                        className="transition-opacity duration-300"
                      >
                        {/* Selection glow ring */}
                        {isSelected && (
                          <circle 
                            cx="0" cy="0" r="32" 
                            fill="hsl(40 85% 65% / 0.15)"
                            stroke="hsl(40 85% 65% / 0.6)"
                            strokeWidth="2"
                            filter="url(#glowStrong)"
                          />
                        )}
                        
                        {/* Counter-rotate to keep icons upright */}
                        <g style={{ transform: `rotate(-${angleDeg}deg)`, transformOrigin: 'center' }}>
                          <image
                            href={zodiacImages[sign.name]}
                            x="-22"
                            y="-22"
                            width="44"
                            height="44"
                            className={`transition-all duration-300 ${
                              isSelected 
                                ? 'opacity-100' 
                                : 'opacity-70 hover:opacity-100'
                            }`}
                            style={{ 
                              filter: isSelected 
                                ? 'drop-shadow(0 0 8px rgba(245, 195, 106, 0.8)) brightness(1.2)' 
                                : 'drop-shadow(0 0 4px rgba(245, 195, 106, 0.4))',
                            }}
                          />
                        </g>
                      </g>
                    );
                  })}
                </g>

                {/* Static outer zodiac name labels */}
                {zodiacSigns.map((sign, index) => {
                  const angle = (index * 30 - 90) * (Math.PI / 180);
                  const labelR = 210;
                  const x = Math.cos(angle) * labelR;
                  const y = Math.sin(angle) * labelR;
                  const isSelected = selectedSign.name === sign.name;
                  
                  return (
                    <text
                      key={`label-${sign.name}`}
                      x={x}
                      y={y + 4}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isSelected ? 'hsl(40 85% 65%)' : 'hsl(40 85% 65% / 0.4)'}
                      fontFamily="Iceland, sans-serif"
                      letterSpacing="0.1em"
                      style={{ textTransform: 'uppercase' }}
                      className="transition-all duration-300 pointer-events-none"
                    >
                      {sign.name.toUpperCase()}
                    </text>
                  );
                })}
              </svg>

              {/* Decorative corner stars */}
              {[
                { top: '5%', left: '10%' },
                { top: '8%', right: '15%' },
                { bottom: '10%', left: '8%' },
                { bottom: '15%', right: '12%' },
              ].map((pos, i) => (
                <div 
                  key={`star-${i}`}
                  className="absolute w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"
                  style={{ ...pos, animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZodiacWheelSection;
