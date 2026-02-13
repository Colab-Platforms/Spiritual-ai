import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

interface Constellation {
  id: string;
  name: string;
  stars: { x: number; y: number; size: number }[];
  lines: [number, number][];
  triggerProgress: number;
  mythology: {
    origin: string;
    meaning: string;
    keyStars: string[];
  };
}

// Constellation patterns with mythology data
const constellations: Constellation[] = [
  {
    id: 'orion',
    name: 'Orion',
    stars: [
      { x: 15, y: 8, size: 3 },
      { x: 18, y: 12, size: 2.5 },
      { x: 12, y: 14, size: 2 },
      { x: 15, y: 18, size: 4 },
      { x: 17, y: 18, size: 3.5 },
      { x: 19, y: 18, size: 3 },
      { x: 14, y: 24, size: 2.5 },
      { x: 20, y: 25, size: 2.5 },
    ],
    lines: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [1, 4], [3, 6], [5, 7]],
    triggerProgress: 0.15,
    mythology: {
      origin: 'Greek mythology tells of Orion, a giant huntsman placed among the stars by Zeus.',
      meaning: 'Represents strength, pursuit, and the eternal hunt. Those born under Orion are said to possess unwavering determination.',
      keyStars: ['Betelgeuse', 'Rigel', 'Bellatrix'],
    },
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    stars: [
      { x: 75, y: 15, size: 3 },
      { x: 78, y: 18, size: 2.5 },
      { x: 82, y: 16, size: 3.5 },
      { x: 85, y: 20, size: 2 },
      { x: 88, y: 17, size: 3 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
    triggerProgress: 0.3,
    mythology: {
      origin: 'Named after the vain queen Cassiopeia who boasted of her beauty, angering Poseidon.',
      meaning: 'Symbolizes beauty, pride, and the consequences of vanity. A reminder that true beauty comes from within.',
      keyStars: ['Schedar', 'Caph', 'Ruchbah'],
    },
  },
  {
    id: 'leo',
    name: 'Leo',
    stars: [
      { x: 55, y: 45, size: 4 },
      { x: 58, y: 42, size: 2.5 },
      { x: 62, y: 40, size: 3 },
      { x: 60, y: 48, size: 2 },
      { x: 65, y: 50, size: 3.5 },
      { x: 68, y: 52, size: 2.5 },
    ],
    lines: [[0, 1], [1, 2], [0, 3], [3, 4], [4, 5]],
    triggerProgress: 0.45,
    mythology: {
      origin: 'The Nemean Lion slain by Hercules as his first labor, immortalized in the stars.',
      meaning: 'Embodies courage, royalty, and fierce protection. Leos are natural leaders with hearts of gold.',
      keyStars: ['Regulus', 'Denebola', 'Algieba'],
    },
  },
  {
    id: 'scorpius',
    name: 'Scorpius',
    stars: [
      { x: 25, y: 65, size: 4 },
      { x: 28, y: 68, size: 3 },
      { x: 30, y: 72, size: 2.5 },
      { x: 32, y: 76, size: 3 },
      { x: 35, y: 78, size: 2.5 },
      { x: 38, y: 76, size: 3.5 },
      { x: 40, y: 73, size: 2 },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
    triggerProgress: 0.6,
    mythology: {
      origin: 'The scorpion sent by Gaia to defeat Orion, forever chasing him across the night sky.',
      meaning: 'Represents transformation, passion, and hidden depths. Scorpios possess intense emotional wisdom.',
      keyStars: ['Antares', 'Shaula', 'Sargas'],
    },
  },
];

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  speed: number;
  length: number;
}

// Static background stars as crisp gold vector dots
const staticStars = Array.from({ length: 80 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.6 + 0.2,
  twinkleDelay: Math.random() * 5,
}));

const ScrollStorytelling = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [hoveredConstellation, setHoveredConstellation] = useState<Constellation | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const shootingStarIdRef = useRef(0);
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Transform values — overlapping transitions for smooth blending
  // Phase 1 (0-40%): Deep space with zodiac constellations
  const nebulaOpacity = useTransform(smoothProgress, [0, 0.15, 0.5, 0.7], [0.4, 0.9, 0.6, 0.2]);
  const topNebulaOpacity = useTransform(smoothProgress, [0, 0.1, 0.4, 0.6], [0.7, 1, 0.7, 0.2]);
  // Phase 2 (25-65%): Solar system region
  const galaxyScale = useTransform(smoothProgress, [0.2, 0.45], [0.5, 1]);
  const galaxyOpacity = useTransform(smoothProgress, [0.2, 0.3, 0.55, 0.7], [0, 0.9, 0.9, 0]);
  const cometProgress = useTransform(smoothProgress, [0.35, 0.6], [0, 1]);
  // Phase 3 (50-85%): Clouds transition
  const cloudLayerOpacity = useTransform(smoothProgress, [0.45, 0.6, 0.8, 0.9], [0, 0.7, 0.5, 0.3]);
  // Phase 4 (70-100%): Earth / ground
  const earthLayerOpacity = useTransform(smoothProgress, [0.65, 0.85], [0, 1]);
  // Comet transforms
  const cometLeft = useTransform(cometProgress, [0, 1], ['0%', '100%']);
  const cometTop = useTransform(cometProgress, [0, 1], ['80%', '20%']);
  const cometOpacity = useTransform(cometProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  
  // Spawn shooting stars
  useEffect(() => {
    const spawnShootingStar = () => {
      const newStar: ShootingStar = {
        id: shootingStarIdRef.current++,
        startX: Math.random() * 80 + 10,
        startY: Math.random() * 30,
        angle: Math.random() * 30 + 30,
        speed: Math.random() * 2 + 1,
        length: Math.random() * 80 + 40,
      };
      setShootingStars(prev => [...prev.slice(-3), newStar]);
    };
    const interval = setInterval(spawnShootingStar, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleConstellationHover = (constellation: Constellation | null, event?: React.MouseEvent) => {
    setHoveredConstellation(constellation);
    if (event && constellation) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltipPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ 
        zIndex: -1,
        background: 'linear-gradient(to bottom, #050810 0%, #0a0d18 30%, #080c15 60%, #030508 100%)',
      }}
    >
      {/* === STATIC VECTOR STAR FIELD (crisp gold dots) === */}
      <svg className="absolute inset-0 w-full h-full">
        {staticStars.map((star, i) => (
          <circle
            key={`bg-star-${i}`}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="#D4AF37"
            opacity={star.opacity}
          >
            <animate
              attributeName="opacity"
              values={`${star.opacity};${star.opacity * 0.3};${star.opacity}`}
              dur={`${3 + star.twinkleDelay}s`}
              repeatCount="indefinite"
              begin={`${star.twinkleDelay}s`}
            />
          </circle>
        ))}
      </svg>

      {/* === PHASE 1: STYLIZED VECTOR NEBULAS (not blurry — clean shapes) === */}
      <motion.div 
        className="absolute pointer-events-none"
        style={{ opacity: topNebulaOpacity }}
      >
        {/* Top-left nebula — stylized layered circles */}
        <svg className="absolute" style={{ left: '-5%', top: '-10%', width: '60vw', height: '50vh' }} viewBox="0 0 600 400">
          <defs>
            <radialGradient id="nebula1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b1f7e" stopOpacity="0.5" />
              <stop offset="40%" stopColor="#2a1463" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#1a0e45" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nebula1b" cx="60%" cy="40%" r="40%">
              <stop offset="0%" stopColor="#1e3a6e" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#132850" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="300" cy="200" rx="280" ry="180" fill="url(#nebula1)" />
          <ellipse cx="350" cy="170" rx="200" ry="140" fill="url(#nebula1b)" />
        </svg>

        {/* Top-right nebula accent */}
        <svg className="absolute" style={{ right: '-5%', top: '0%', width: '40vw', height: '40vh' }} viewBox="0 0 400 300">
          <defs>
            <radialGradient id="nebula2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e3a6e" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#142850" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="150" rx="190" ry="130" fill="url(#nebula2)" />
        </svg>
      </motion.div>

      {/* Mid-section gold nebula accent */}
      <motion.div 
        className="absolute pointer-events-none"
        style={{ opacity: nebulaOpacity }}
      >
        <svg className="absolute" style={{ left: '50%', top: '20%', width: '50vw', height: '50vh' }} viewBox="0 0 500 500">
          <defs>
            <radialGradient id="nebula3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.15" />
              <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.06" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="250" cy="250" rx="240" ry="220" fill="url(#nebula3)" />
        </svg>

        <svg className="absolute" style={{ left: '0%', top: '40%', width: '35vw', height: '35vh' }} viewBox="0 0 350 350">
          <defs>
            <radialGradient id="nebula4" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a2d5e" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#0f1c3d" stopOpacity="0.12" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="175" cy="175" rx="165" ry="150" fill="url(#nebula4)" />
        </svg>
      </motion.div>

      {/* === CONSTELLATIONS — crisp gold vector lines & dots === */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
        <defs>
          <filter id="starGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="starGlowHover">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.3"/>
          </linearGradient>
          <linearGradient id="lineGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C547" stopOpacity="1"/>
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.6"/>
          </linearGradient>
        </defs>
        
        {constellations.map((constellation) => (
          <ConstellationGroup
            key={constellation.id}
            constellation={constellation}
            scrollProgress={smoothProgress}
            isHovered={hoveredConstellation?.id === constellation.id}
            onHover={handleConstellationHover}
          />
        ))}
      </svg>

      {/* Constellation mythology tooltip */}
      <AnimatePresence>
        {hoveredConstellation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 pointer-events-none max-w-xs"
            style={{
              left: Math.min(tooltipPosition.x + 20, window.innerWidth - 320),
              top: Math.min(tooltipPosition.y - 20, window.innerHeight - 250),
            }}
          >
            <div 
              className="p-4 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(10, 13, 24, 0.95) 0%, rgba(5, 8, 16, 0.95) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.15), 0 20px 60px rgba(0, 0, 0, 0.8)',
              }}
            >
              <h3 
                className="font-display text-lg tracking-wider mb-2"
                style={{ color: '#D4AF37', textShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }}
              >
                {hoveredConstellation.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {hoveredConstellation.mythology.origin}
              </p>
              <div 
                className="text-xs mb-3 p-2 rounded-lg"
                style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
              >
                <span style={{ color: '#D4AF37' }} className="font-display tracking-wider">MEANING: </span>
                <span className="text-foreground/80">{hoveredConstellation.mythology.meaning}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hoveredConstellation.mythology.keyStars.map((star) => (
                  <span 
                    key={star}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      color: '#E8C547',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                    }}
                  >
                    ★ {star}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Distant spiral galaxy — stylized vector */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          right: '15%',
          top: '60%',
          width: 120,
          height: 120,
          opacity: galaxyOpacity,
          scale: galaxyScale,
        }}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full animate-spin-slow">
          <defs>
            <radialGradient id="galaxyCenter" cx="50%" cy="50%" r="20%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Spiral arms as arcs */}
          <path d="M60,60 Q80,30 100,50" stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.3" />
          <path d="M60,60 Q40,90 20,70" stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.3" />
          <path d="M60,60 Q90,70 85,95" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.2" />
          <path d="M60,60 Q30,50 35,25" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.2" />
          <circle cx="60" cy="60" r="20" fill="url(#galaxyCenter)" />
          <circle cx="60" cy="60" r="3" fill="#D4AF37" opacity="0.8" />
        </svg>
      </motion.div>

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <ShootingStarElement key={star.id} star={star} />
      ))}

      {/* Comet */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ left: cometLeft, top: cometTop, opacity: cometOpacity }}
      >
        <div className="relative">
          <div 
            className="absolute w-32 h-1 -left-32 top-1/2 -translate-y-1/2"
            style={{ background: 'linear-gradient(to right, transparent, #D4AF37)', opacity: 0.8 }}
          />
          <div 
            className="absolute w-24 h-0.5 -left-24 top-1/2 -translate-y-1/2 -mt-1"
            style={{ background: 'linear-gradient(to right, transparent, rgba(212, 175, 55, 0.5))' }}
          />
          <div 
            className="w-3 h-3 rounded-full"
            style={{
              background: 'radial-gradient(circle, #E8C547 0%, #D4AF37 50%, transparent 100%)',
              boxShadow: '0 0 20px #D4AF37, 0 0 40px rgba(212, 175, 55, 0.5)',
            }}
          />
        </div>
      </motion.div>

      {/* === PHASE 3: STYLIZED VECTOR CLOUDS (clean shapes, not blurry) === */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: cloudLayerOpacity }}
      >
        <svg className="absolute bottom-0 w-full" style={{ height: '60%' }} viewBox="0 0 1440 600" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a2240" stopOpacity="0" />
              <stop offset="40%" stopColor="#1a2240" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0f1628" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#151d38" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0c1222" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          {/* Back cloud layer */}
          <path 
            d="M-50,350 Q100,280 250,320 Q400,260 550,300 Q700,250 850,290 Q1000,240 1150,280 Q1300,250 1490,270 L1490,600 L-50,600 Z"
            fill="url(#cloudGrad1)"
          />
          {/* Mid cloud layer */}
          <path 
            d="M-50,400 Q150,340 300,380 Q450,330 600,370 Q750,320 900,360 Q1050,310 1200,350 Q1350,330 1490,340 L1490,600 L-50,600 Z"
            fill="url(#cloudGrad2)"
          />
          {/* Front cloud wisps */}
          <path 
            d="M-50,450 Q200,400 400,430 Q600,390 800,420 Q1000,380 1200,410 Q1350,400 1490,390 L1490,600 L-50,600 Z"
            fill="#0d1525"
            opacity="0.5"
          />
        </svg>
      </motion.div>

      {/* === PHASE 4: SHARP VECTOR MOUNTAIN & TEMPLE SILHOUETTES === */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: earthLayerOpacity }}
      >
        {/* Atmospheric horizon glow */}
        <div 
          className="absolute w-full bottom-0"
          style={{
            height: '35%',
            background: 'linear-gradient(to top, #030508 0%, #0a0d18 40%, transparent 100%)',
          }}
        />

        {/* Mountain & temple silhouette SVG */}
        <svg className="absolute bottom-0 w-full" style={{ height: '280px' }} viewBox="0 0 1440 280" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mtGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#141a2a" />
              <stop offset="100%" stopColor="#0a0e18" />
            </linearGradient>
            <linearGradient id="mtGradMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f1420" />
              <stop offset="100%" stopColor="#070a12" />
            </linearGradient>
            <linearGradient id="mtGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#080b14" />
              <stop offset="100%" stopColor="#030508" />
            </linearGradient>
            <filter id="peakGlow">
              <feGaussianBlur stdDeviation="4" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background mountains — distant, lighter */}
          <path
            d="M0,200 L60,170 L140,190 L260,130 L380,170 L500,140 L620,175 L760,110 L880,155 L1000,125 L1120,160 L1260,135 L1380,165 L1440,150 L1440,280 L0,280 Z"
            fill="url(#mtGradBack)"
            opacity="0.7"
          />

          {/* Mid mountains with temple spire */}
          <path
            d="M0,230 L80,195 L180,215 L280,160 L360,190 
               L440,175 L460,120 L470,100 L475,85 L480,100 L490,120 L510,175
               L600,185 L700,145 L820,180 L920,155 
               L1000,140 L1020,105 L1030,80 L1035,65 L1040,80 L1050,105 L1070,140
               L1160,165 L1280,150 L1380,175 L1440,160 L1440,280 L0,280 Z"
            fill="url(#mtGradMid)"
            opacity="0.9"
          />

          {/* Foreground — sharp dark silhouette with treeline */}
          <path
            d="M0,280 L0,225 L40,220 L60,230 L100,215 L130,225 L160,210 
               L200,218 L240,205 L280,215 L310,200 L340,212 
               L380,220 L420,208 L460,218 L500,210 L540,220 
               L580,212 L620,222 L660,210 L700,218 L740,205 
               L780,215 L820,208 L860,218 L900,210 L940,220 
               L980,212 L1020,222 L1060,210 L1100,218 L1140,205 
               L1180,215 L1220,208 L1260,218 L1300,210 L1340,220 
               L1380,212 L1420,218 L1440,215 L1440,280 Z"
            fill="url(#mtGradFront)"
          />

          {/* Gold edge highlights on peaks */}
          <path
            d="M260,130 L380,170 L500,140 L620,175 L760,110 L880,155 L1000,125 L1120,160"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1"
            opacity="0.25"
          />

          {/* Temple spire gold tips */}
          <g filter="url(#peakGlow)">
            <circle cx="475" cy="83" r="3" fill="#D4AF37" opacity="0.9" />
            <circle cx="1035" cy="63" r="3" fill="#D4AF37" opacity="0.9" />
            <circle cx="760" cy="108" r="2" fill="#D4AF37" opacity="0.6" />
          </g>

          {/* Tiny window lights on temples */}
          <rect x="467" y="100" width="2" height="3" fill="#D4AF37" opacity="0.4" rx="0.5" />
          <rect x="481" y="100" width="2" height="3" fill="#D4AF37" opacity="0.4" rx="0.5" />
          <rect x="1027" y="80" width="2" height="3" fill="#D4AF37" opacity="0.4" rx="0.5" />
          <rect x="1041" y="80" width="2" height="3" fill="#D4AF37" opacity="0.4" rx="0.5" />
        </svg>
      </motion.div>

      {/* Unifying gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(15, 10, 40, 0.12) 0%, rgba(10, 15, 30, 0.08) 30%, rgba(8, 12, 25, 0.12) 60%, rgba(3, 5, 10, 0.25) 100%)',
        }}
      />

      {/* Journey milestone text */}
      <JourneyMilestones scrollProgress={smoothProgress} />
    </div>
  );
};

// Individual constellation with animated drawing and hover interactivity
const ConstellationGroup = ({ 
  constellation, 
  scrollProgress,
  isHovered,
  onHover,
}: { 
  constellation: Constellation;
  scrollProgress: ReturnType<typeof useSpring>;
  isHovered: boolean;
  onHover: (constellation: Constellation | null, event?: React.MouseEvent) => void;
}) => {
  const visibility = useTransform(
    scrollProgress,
    [constellation.triggerProgress - 0.05, constellation.triggerProgress, constellation.triggerProgress + 0.1],
    [0, 0.7, 1]
  );
  
  const lineProgress = useTransform(
    scrollProgress,
    [constellation.triggerProgress, constellation.triggerProgress + 0.15],
    [0, 1]
  );

  const minX = Math.min(...constellation.stars.map(s => s.x)) - 3;
  const maxX = Math.max(...constellation.stars.map(s => s.x)) + 3;
  const minY = Math.min(...constellation.stars.map(s => s.y)) - 3;
  const maxY = Math.max(...constellation.stars.map(s => s.y)) + 3;

  return (
    <motion.g style={{ opacity: visibility }}>
      <rect
        x={`${minX}%`}
        y={`${minY}%`}
        width={`${maxX - minX}%`}
        height={`${maxY - minY}%`}
        fill="transparent"
        className="cursor-pointer"
        style={{ pointerEvents: 'all' }}
        onMouseEnter={(e) => onHover(constellation, e)}
        onMouseMove={(e) => isHovered && onHover(constellation, e)}
        onMouseLeave={() => onHover(null)}
      />
      
      {/* Constellation lines — crisp gold */}
      {constellation.lines.map(([startIdx, endIdx], lineIdx) => {
        const start = constellation.stars[startIdx];
        const end = constellation.stars[endIdx];
        return (
          <motion.line
            key={`line-${lineIdx}`}
            x1={`${start.x}%`}
            y1={`${start.y}%`}
            x2={`${end.x}%`}
            y2={`${end.y}%`}
            stroke={isHovered ? "url(#lineGradientHover)" : "url(#lineGradient)"}
            strokeWidth={isHovered ? 2 : 1}
            strokeDasharray={isHovered ? "0" : "4 4"}
            style={{
              pathLength: lineProgress,
              opacity: useTransform(lineProgress, [0, 0.5], [0, isHovered ? 1 : 0.6]),
              transition: 'stroke-width 0.3s, stroke-dasharray 0.3s',
            }}
          />
        );
      })}
      
      {/* Stars — crisp gold vector dots */}
      {constellation.stars.map((star, idx) => (
        <motion.circle
          key={`star-${idx}`}
          cx={`${star.x}%`}
          cy={`${star.y}%`}
          r={isHovered ? star.size * 1.5 : star.size}
          fill={isHovered ? "#E8C547" : "#D4AF37"}
          filter={isHovered ? "url(#starGlowHover)" : "url(#starGlow)"}
          style={{
            scale: useTransform(visibility, [0, 1], [0, 1]),
            transition: 'r 0.3s, fill 0.3s',
          }}
        />
      ))}
      
      {/* Constellation name */}
      <motion.text
        x={`${constellation.stars[0].x + 3}%`}
        y={`${constellation.stars[0].y - 2}%`}
        fill={isHovered ? "#E8C547" : "#D4AF37"}
        fontSize={isHovered ? "12" : "10"}
        fontFamily="Iceland, sans-serif"
        letterSpacing="0.2em"
        style={{
          opacity: useTransform(visibility, [0.5, 1], [0, isHovered ? 1 : 0.7]),
          transition: 'font-size 0.3s, fill 0.3s',
        }}
      >
        {constellation.name.toUpperCase()}
      </motion.text>
    </motion.g>
  );
};

// Shooting star — gold streak
const ShootingStarElement = ({ star }: { star: ShootingStar }) => (
  <motion.div
    className="absolute"
    initial={{ left: `${star.startX}%`, top: `${star.startY}%`, opacity: 1 }}
    animate={{ 
      left: `${star.startX + star.length * Math.cos(star.angle * Math.PI / 180)}%`,
      top: `${star.startY + star.length * Math.sin(star.angle * Math.PI / 180)}%`,
      opacity: 0,
    }}
    transition={{ duration: star.speed, ease: 'easeOut' }}
  >
    <div 
      className="w-1 h-1 rounded-full"
      style={{
        background: '#D4AF37',
        boxShadow: `
          -${star.length / 4}px 0 ${star.length / 8}px rgba(212, 175, 55, 0.8),
          -${star.length / 2}px 0 ${star.length / 4}px rgba(212, 175, 55, 0.4),
          -${star.length}px 0 ${star.length / 2}px rgba(212, 175, 55, 0.2)
        `,
        transform: `rotate(${star.angle}deg)`,
      }}
    />
  </motion.div>
);

// Milestone text
const MilestoneItem = ({ 
  scrollProgress, progress, text, topPercent 
}: { 
  scrollProgress: ReturnType<typeof useSpring>; 
  progress: number; text: string; topPercent: number;
}) => {
  const opacity = useTransform(
    scrollProgress,
    [progress - 0.05, progress, progress + 0.08, progress + 0.15],
    [0, 0.8, 0.8, 0]
  );
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 text-center"
      style={{ top: `${topPercent}%`, opacity }}
    >
      <span 
        className="text-xs tracking-[0.3em] uppercase"
        style={{ color: '#D4AF37', textShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }}
      >
        {text}
      </span>
    </motion.div>
  );
};

const JourneyMilestones = ({ scrollProgress }: { scrollProgress: ReturnType<typeof useSpring> }) => (
  <>
    <MilestoneItem scrollProgress={scrollProgress} progress={0.15} text="Entering the constellation zone..." topPercent={20} />
    <MilestoneItem scrollProgress={scrollProgress} progress={0.4} text="Passing through the Solar System..." topPercent={45} />
    <MilestoneItem scrollProgress={scrollProgress} progress={0.65} text="Descending through the clouds..." topPercent={70} />
    <MilestoneItem scrollProgress={scrollProgress} progress={0.85} text="Approaching the ancient ground..." topPercent={95} />
  </>
);

export default ScrollStorytelling;
