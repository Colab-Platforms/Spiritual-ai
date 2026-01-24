import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowRight, Flame, Mountain, Wind, Droplets } from 'lucide-react';
import { zodiacSigns, ZodiacSign } from '@/data/zodiacData';

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

export const ZodiacWheelSection = () => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const wheelRef = useRef<SVGGElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<gsap.core.Tween | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Initialize wheel rotation
  useEffect(() => {
    if (wheelRef.current) {
      rotationRef.current = gsap.to(wheelRef.current, {
        rotation: 360,
        duration: 120,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center center',
      });
    }

    return () => {
      rotationRef.current?.kill();
    };
  }, []);

  // Handle rotation speed based on hover/selection
  useEffect(() => {
    if (rotationRef.current) {
      if (selectedSign) {
        gsap.to(rotationRef.current, { timeScale: 0, duration: 0.8, ease: 'power2.out' });
      } else if (isHovering) {
        gsap.to(rotationRef.current, { timeScale: 0.3, duration: 0.5, ease: 'power2.out' });
      } else {
        gsap.to(rotationRef.current, { timeScale: 1, duration: 0.5, ease: 'power2.out' });
      }
    }
  }, [selectedSign, isHovering]);

  // Animate info panel
  useEffect(() => {
    if (infoPanelRef.current) {
      if (selectedSign) {
        gsap.fromTo(
          infoPanelRef.current.children,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            stagger: 0.08, 
            duration: 0.5, 
            ease: 'power3.out',
          }
        );
      }
    }
  }, [selectedSign]);

  const handleSignClick = useCallback((sign: ZodiacSign) => {
    setSelectedSign(prev => prev?.name === sign.name ? null : sign);
  }, []);

  const handleSignHover = useCallback((hovering: boolean) => {
    setIsHovering(hovering);
  }, []);

  // Calculate position for each zodiac on the wheel
  const getZodiacPosition = (index: number, radius: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180); // Start from top, 30 degrees apart
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const ElementIcon = selectedSign ? elementIcons[selectedSign.element] : null;

  return (
    <section ref={sectionRef} className="relative z-10 py-24 bg-background overflow-hidden">
      {/* Background cosmic effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl tracking-wider text-glow text-primary mb-4">
            The Twelve Zodiac Signs
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto tracking-wide">
            Click on any sign to explore its cosmic mysteries
          </p>
        </div>

        {/* Main content - Left info + Right wheel */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[600px]">
          {/* Left: Info Panel */}
          <div className="order-2 lg:order-1">
            <div 
              ref={infoPanelRef}
              className="glass-card rounded-3xl p-8 md:p-10 min-h-[400px] flex flex-col justify-center relative overflow-hidden"
            >
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-primary/40" />
              <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-primary/40" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-primary/40" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-primary/40" />

              {selectedSign ? (
                <>
                  {/* Element badge */}
                  <div className="flex items-center gap-2 mb-4">
                    {ElementIcon && (
                      <ElementIcon className={`w-4 h-4 ${elementColors[selectedSign.element]}`} />
                    )}
                    <span className={`text-sm uppercase tracking-[0.2em] ${elementColors[selectedSign.element]}`}>
                      {selectedSign.element} Element
                    </span>
                  </div>

                  {/* Zodiac name */}
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-5xl text-primary">{selectedSign.symbol}</span>
                    <h3 className="font-display text-4xl md:text-5xl tracking-wider text-foreground">
                      {selectedSign.name}
                    </h3>
                  </div>

                  {/* Dates */}
                  <p className="text-muted-foreground text-lg mb-6 tracking-wide">
                    {selectedSign.dates}
                  </p>

                  {/* Ruling planet */}
                  <div className="text-sm text-muted-foreground mb-4">
                    Ruled by <span className="text-primary">{selectedSign.ruling}</span>
                  </div>

                  {/* Description */}
                  <p className="text-foreground/90 leading-relaxed mb-8">
                    {selectedSign.description}
                  </p>

                  {/* Traits preview */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedSign.traits.slice(0, 4).map((trait, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-sm rounded-full border border-primary/30 text-primary/80 bg-primary/5"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  {/* Read more button */}
                  <Link
                    to={`/zodiac/${selectedSign.name.toLowerCase()}`}
                    className="btn-outline-cosmic btn-pulse px-6 py-3 rounded-lg inline-flex items-center gap-2 w-fit group"
                  >
                    <span>Read Full Profile</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5">
                    <span className="text-4xl text-primary/50">☉</span>
                  </div>
                  <h3 className="font-display text-2xl tracking-wider text-foreground mb-3">
                    Select a Zodiac Sign
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Click on any symbol in the celestial wheel to reveal its cosmic wisdom
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Zodiac Wheel */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-square">
              <svg
                viewBox="-200 -200 400 400"
                className="w-full h-full"
              >
                <defs>
                  {/* Glow filter for selected/hovered items */}
                  <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="6" result="glow" />
                    <feMerge>
                      <feMergeNode in="glow" />
                      <feMergeNode in="glow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* Radial gradient for center */}
                  <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(40 85% 65% / 0.15)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* Rotating group */}
                <g ref={wheelRef}>
                  {/* Outer decorative ring */}
                  <circle
                    cx="0"
                    cy="0"
                    r="175"
                    fill="none"
                    stroke="hsl(40 85% 65% / 0.1)"
                    strokeWidth="1"
                  />

                  {/* Main wheel circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r="150"
                    fill="none"
                    stroke="hsl(40 85% 65% / 0.25)"
                    strokeWidth="1.5"
                  />

                  {/* Inner decorative circles */}
                  <circle
                    cx="0"
                    cy="0"
                    r="120"
                    fill="none"
                    stroke="hsl(40 85% 65% / 0.15)"
                    strokeWidth="1"
                    strokeDasharray="4 8"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="80"
                    fill="none"
                    stroke="hsl(40 85% 65% / 0.1)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="40"
                    fill="url(#centerGlow)"
                    stroke="hsl(40 85% 65% / 0.2)"
                    strokeWidth="1"
                  />

                  {/* Division lines */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i * 30 - 90) * (Math.PI / 180);
                    const x1 = Math.cos(angle) * 80;
                    const y1 = Math.sin(angle) * 80;
                    const x2 = Math.cos(angle) * 150;
                    const y2 = Math.sin(angle) * 150;
                    return (
                      <line
                        key={`line-${i}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="hsl(40 85% 65% / 0.1)"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Zodiac symbols */}
                  {zodiacSigns.map((sign, index) => {
                    const pos = getZodiacPosition(index, 130);
                    const isSelected = selectedSign?.name === sign.name;

                    return (
                      <g
                        key={sign.name}
                        transform={`translate(${pos.x}, ${pos.y})`}
                        onClick={() => handleSignClick(sign)}
                        onMouseEnter={() => handleSignHover(true)}
                        onMouseLeave={() => handleSignHover(false)}
                        className="cursor-pointer"
                        style={{ transition: 'opacity 0.3s ease' }}
                      >
                        {/* Clickable area */}
                        <circle
                          r="22"
                          fill="transparent"
                        />
                        
                        {/* Symbol background glow when selected */}
                        {isSelected && (
                          <circle
                            r="28"
                            fill="hsl(40 85% 65% / 0.15)"
                            filter="url(#strongGlow)"
                          />
                        )}

                        {/* Zodiac symbol */}
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={isSelected ? "28" : "24"}
                          fill={isSelected ? "hsl(40 85% 70%)" : "hsl(40 85% 65% / 0.7)"}
                          filter={isSelected ? "url(#strongGlow)" : undefined}
                          className="transition-all duration-300"
                          style={{
                            transform: 'rotate(0deg)',
                            opacity: selectedSign && !isSelected ? 0.4 : 1,
                          }}
                        >
                          {sign.symbol}
                        </text>
                      </g>
                    );
                  })}

                  {/* Center sun symbol */}
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="30"
                    fill="hsl(40 85% 65% / 0.6)"
                    filter="url(#glowFilter)"
                  >
                    ☉
                  </text>
                </g>

                {/* Static outer labels (zodiac names) */}
                {zodiacSigns.map((sign, index) => {
                  const angle = (index * 30 - 90);
                  const pos = getZodiacPosition(index, 170);
                  const isSelected = selectedSign?.name === sign.name;

                  return (
                    <text
                      key={`label-${sign.name}`}
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="9"
                      fill={isSelected ? "hsl(40 85% 65%)" : "hsl(40 85% 65% / 0.4)"}
                      className="font-display uppercase tracking-[0.15em] transition-all duration-300"
                      style={{
                        transform: `rotate(${angle + 90}deg)`,
                        transformOrigin: `${pos.x}px ${pos.y}px`,
                      }}
                    >
                      {sign.name}
                    </text>
                  );
                })}

                {/* Decorative stars */}
                {[
                  { x: -180, y: -180, size: 2 },
                  { x: 170, y: -160, size: 1.5 },
                  { x: 160, y: 170, size: 2 },
                  { x: -160, y: 150, size: 1.5 },
                  { x: -100, y: -185, size: 1 },
                  { x: 185, y: 50, size: 1 },
                ].map((star, i) => (
                  <circle
                    key={`star-${i}`}
                    cx={star.x}
                    cy={star.y}
                    r={star.size}
                    fill="hsl(40 85% 65% / 0.5)"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZodiacWheelSection;