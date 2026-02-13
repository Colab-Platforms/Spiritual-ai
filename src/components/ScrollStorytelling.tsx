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
      meaning: 'Represents strength, pursuit, and the eternal hunt.',
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
      origin: 'Named after the vain queen Cassiopeia who boasted of her beauty.',
      meaning: 'Symbolizes beauty, pride, and the consequences of vanity.',
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
      origin: 'The Nemean Lion slain by Hercules, immortalized in the stars.',
      meaning: 'Embodies courage, royalty, and fierce protection.',
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
      origin: 'The scorpion sent by Gaia to defeat Orion.',
      meaning: 'Represents transformation, passion, and hidden depths.',
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

// Static stars — periwinkle/white dots
const staticStars = Array.from({ length: 120 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.7 + 0.3,
  twinkleDelay: Math.random() * 5,
}));

// Floating debris/rocks
const floatingDebris = Array.from({ length: 12 }, (_, i) => ({
  x: Math.random() * 90 + 5,
  y: Math.random() * 70 + 10,
  size: Math.random() * 8 + 3,
  rotation: Math.random() * 360,
  duration: Math.random() * 15 + 10,
  delay: Math.random() * 5,
}));

const ScrollStorytelling = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [hoveredConstellation, setHoveredConstellation] = useState<Constellation | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const shootingStarIdRef = useRef(0);
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Parallax transforms for planet & mountains
  const planetY = useTransform(smoothProgress, [0, 1], [0, -150]);
  const mountainBackY = useTransform(smoothProgress, [0, 1], [0, -40]);
  const mountainFrontY = useTransform(smoothProgress, [0, 1], [0, -20]);
  
  // Phase opacities — overlapping for smooth blending
  const nebulaOpacity = useTransform(smoothProgress, [0, 0.15, 0.5, 0.7], [0.5, 1, 0.7, 0.3]);
  const galaxyOpacity = useTransform(smoothProgress, [0.2, 0.3, 0.55, 0.7], [0, 0.9, 0.9, 0]);
  const galaxyScale = useTransform(smoothProgress, [0.2, 0.45], [0.5, 1]);
  const cloudLayerOpacity = useTransform(smoothProgress, [0.45, 0.6, 0.8, 0.9], [0, 0.7, 0.5, 0.3]);
  const earthLayerOpacity = useTransform(smoothProgress, [0.65, 0.85], [0, 1]);
  const cometProgress = useTransform(smoothProgress, [0.35, 0.6], [0, 1]);
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
        background: 'linear-gradient(to bottom, #1E1B4B 0%, #1a1845 15%, #151340 30%, #111035 50%, #0d0c2d 70%, #0F172A 100%)',
      }}
    >
      {/* Grain/noise texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* === STAR FIELD — periwinkle/white dots === */}
      <svg className="absolute inset-0 w-full h-full">
        {staticStars.map((star, i) => (
          <circle
            key={`star-${i}`}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill={i % 3 === 0 ? '#C7D2FE' : i % 3 === 1 ? '#A5B4FC' : '#E0E7FF'}
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

      {/* === THE GIANT PLANET (Object A) — flat vector style === */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: '5%',
          top: '12%',
          width: '42vw',
          height: '42vw',
          maxWidth: '600px',
          maxHeight: '600px',
          y: planetY,
        }}
      >
        <svg viewBox="0 0 500 500" className="w-full h-full">
          <defs>
            {/* Planet body gradient */}
            <radialGradient id="planetBody" cx="40%" cy="35%" r="50%">
              <stop offset="0%" stopColor="#4338CA" />
              <stop offset="40%" stopColor="#3730A3" />
              <stop offset="70%" stopColor="#312E81" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </radialGradient>
            {/* Planet highlight */}
            <radialGradient id="planetHighlight" cx="30%" cy="25%" r="40%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            {/* Shadow on planet */}
            <radialGradient id="planetShadow" cx="70%" cy="65%" r="50%">
              <stop offset="0%" stopColor="transparent" stopOpacity="0" />
              <stop offset="60%" stopColor="#0F172A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
            </radialGradient>
            {/* Atmospheric glow */}
            <radialGradient id="planetGlow" cx="50%" cy="50%" r="52%">
              <stop offset="85%" stopColor="transparent" stopOpacity="0" />
              <stop offset="95%" stopColor="#6366F1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
            </radialGradient>
            <clipPath id="planetClip">
              <circle cx="250" cy="250" r="180" />
            </clipPath>
          </defs>

          {/* Atmospheric glow behind planet */}
          <circle cx="250" cy="250" r="210" fill="url(#planetGlow)" />
          
          {/* Planet body */}
          <circle cx="250" cy="250" r="180" fill="url(#planetBody)" />

          {/* Surface details — flat vector bands/craters */}
          <g clipPath="url(#planetClip)">
            {/* Horizontal bands */}
            <ellipse cx="250" cy="200" rx="180" ry="15" fill="#4F46E5" opacity="0.3" />
            <ellipse cx="250" cy="230" rx="180" ry="8" fill="#6366F1" opacity="0.2" />
            <ellipse cx="250" cy="270" rx="180" ry="20" fill="#4338CA" opacity="0.25" />
            <ellipse cx="250" cy="310" rx="180" ry="10" fill="#6366F1" opacity="0.15" />
            
            {/* Craters — simple flat circles */}
            <circle cx="200" cy="210" r="25" fill="#312E81" opacity="0.4" />
            <circle cx="200" cy="210" r="22" fill="#3730A3" opacity="0.3" />
            <circle cx="310" cy="270" r="18" fill="#312E81" opacity="0.35" />
            <circle cx="310" cy="270" r="15" fill="#3730A3" opacity="0.25" />
            <circle cx="220" cy="300" r="12" fill="#312E81" opacity="0.3" />
            <circle cx="280" cy="190" r="8" fill="#312E81" opacity="0.25" />

            {/* Light spot detail */}
            <circle cx="190" cy="180" r="35" fill="#818CF8" opacity="0.08" />
          </g>

          {/* Highlight overlay */}
          <circle cx="250" cy="250" r="180" fill="url(#planetHighlight)" />
          
          {/* Shadow overlay */}
          <circle cx="250" cy="250" r="180" fill="url(#planetShadow)" />

          {/* Ring — flat ellipse behind and in front */}
          <ellipse cx="250" cy="260" rx="260" ry="40" fill="none" 
            stroke="#818CF8" strokeWidth="3" opacity="0.35"
            strokeDasharray="8 4"
          />
          <ellipse cx="250" cy="260" rx="240" ry="35" fill="none" 
            stroke="#6366F1" strokeWidth="1.5" opacity="0.25"
          />
          <ellipse cx="250" cy="260" rx="280" ry="45" fill="none" 
            stroke="#A5B4FC" strokeWidth="1" opacity="0.15"
          />
        </svg>
      </motion.div>

      {/* === FLOATING DEBRIS / GEOMETRIC ROCKS === */}
      {floatingDebris.map((rock, i) => (
        <motion.div
          key={`debris-${i}`}
          className="absolute pointer-events-none"
          style={{ left: `${rock.x}%`, top: `${rock.y}%` }}
          animate={{
            y: [0, -15, 0, 10, 0],
            x: [0, 5, -3, 8, 0],
            rotate: [rock.rotation, rock.rotation + 20, rock.rotation - 10, rock.rotation + 15, rock.rotation],
          }}
          transition={{
            duration: rock.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: rock.delay,
          }}
        >
          <svg width={rock.size * 2} height={rock.size * 2} viewBox="0 0 20 20">
            <polygon 
              points="10,2 16,7 14,16 6,14 4,8" 
              fill="#312E81" 
              stroke="#6366F1" 
              strokeWidth="0.5" 
              opacity="0.5"
            />
          </svg>
        </motion.div>
      ))}

      {/* === NEBULA CLOUDS — soft indigo/violet === */}
      <motion.div 
        className="absolute pointer-events-none"
        style={{ opacity: nebulaOpacity }}
      >
        <svg className="absolute" style={{ left: '-10%', top: '-5%', width: '70vw', height: '55vh' }} viewBox="0 0 700 450">
          <defs>
            <radialGradient id="neb1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4338CA" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#3730A3" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#1E1B4B" stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="neb1b" cx="60%" cy="40%" r="40%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#4338CA" stopOpacity="0.12" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="350" cy="225" rx="330" ry="200" fill="url(#neb1)" />
          <ellipse cx="400" cy="190" rx="220" ry="150" fill="url(#neb1b)" />
        </svg>

        <svg className="absolute" style={{ right: '-5%', top: '5%', width: '45vw', height: '40vh' }} viewBox="0 0 400 300">
          <defs>
            <radialGradient id="neb2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#4338CA" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="150" rx="190" ry="130" fill="url(#neb2)" />
        </svg>

        {/* Mid accent glow */}
        <svg className="absolute" style={{ left: '40%', top: '30%', width: '40vw', height: '40vh' }} viewBox="0 0 400 400">
          <defs>
            <radialGradient id="neb3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#6366F1" stopOpacity="0.06" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="200" rx="190" ry="180" fill="url(#neb3)" />
        </svg>
      </motion.div>

      {/* === CONSTELLATIONS — periwinkle vector lines & dots === */}
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
            <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.3"/>
          </linearGradient>
          <linearGradient id="lineGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C7D2FE" stopOpacity="1"/>
            <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0.6"/>
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

      {/* Constellation tooltip */}
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
                background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.15), 0 20px 60px rgba(0, 0, 0, 0.8)',
              }}
            >
              <h3 
                className="font-display text-lg tracking-wider mb-2"
                style={{ color: '#A5B4FC', textShadow: '0 0 10px rgba(165, 180, 252, 0.5)' }}
              >
                {hoveredConstellation.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {hoveredConstellation.mythology.origin}
              </p>
              <div 
                className="text-xs mb-3 p-2 rounded-lg"
                style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}
              >
                <span style={{ color: '#818CF8' }} className="font-display tracking-wider">MEANING: </span>
                <span className="text-foreground/80">{hoveredConstellation.mythology.meaning}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hoveredConstellation.mythology.keyStars.map((star) => (
                  <span 
                    key={star}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#C7D2FE',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
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

      {/* Spiral galaxy — indigo vector */}
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
              <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M60,60 Q80,30 100,50" stroke="#818CF8" strokeWidth="1.5" fill="none" opacity="0.3" />
          <path d="M60,60 Q40,90 20,70" stroke="#818CF8" strokeWidth="1.5" fill="none" opacity="0.3" />
          <path d="M60,60 Q90,70 85,95" stroke="#6366F1" strokeWidth="1" fill="none" opacity="0.2" />
          <path d="M60,60 Q30,50 35,25" stroke="#6366F1" strokeWidth="1" fill="none" opacity="0.2" />
          <circle cx="60" cy="60" r="20" fill="url(#galaxyCenter)" />
          <circle cx="60" cy="60" r="3" fill="#A5B4FC" opacity="0.8" />
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
            style={{ background: 'linear-gradient(to right, transparent, #818CF8)', opacity: 0.8 }}
          />
          <div 
            className="w-3 h-3 rounded-full"
            style={{
              background: 'radial-gradient(circle, #C7D2FE 0%, #6366F1 50%, transparent 100%)',
              boxShadow: '0 0 20px #6366F1, 0 0 40px rgba(99, 102, 241, 0.5)',
            }}
          />
        </div>
      </motion.div>

      {/* === STYLIZED VECTOR CLOUDS === */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: cloudLayerOpacity }}
      >
        <svg className="absolute bottom-0 w-full" style={{ height: '60%' }} viewBox="0 0 1440 600" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cloudGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0" />
              <stop offset="40%" stopColor="#1E1B4B" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="cloudGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#312E81" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path 
            d="M-50,350 Q100,280 250,320 Q400,260 550,300 Q700,250 850,290 Q1000,240 1150,280 Q1300,250 1490,270 L1490,600 L-50,600 Z"
            fill="url(#cloudGrad1)"
          />
          <path 
            d="M-50,400 Q150,340 300,380 Q450,330 600,370 Q750,320 900,360 Q1050,310 1200,350 Q1350,330 1490,340 L1490,600 L-50,600 Z"
            fill="url(#cloudGrad2)"
          />
          <path 
            d="M-50,450 Q200,400 400,430 Q600,390 800,420 Q1000,380 1200,410 Q1350,400 1490,390 L1490,600 L-50,600 Z"
            fill="#0F172A"
            opacity="0.5"
          />
        </svg>
      </motion.div>

      {/* === JAGGED MOUNTAINS (Object B) + FOREGROUND TERRAIN (Object C) === */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: earthLayerOpacity }}
      >
        {/* Atmospheric horizon glow */}
        <div 
          className="absolute w-full bottom-0"
          style={{
            height: '35%',
            background: 'linear-gradient(to top, #0F172A 0%, #1E1B4B 40%, transparent 100%)',
          }}
        />

        {/* Mountain SVG */}
        <svg className="absolute bottom-0 w-full" style={{ height: '280px' }} viewBox="0 0 1440 280" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mtBack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#312E81" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
            <linearGradient id="mtMid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#252362" />
              <stop offset="100%" stopColor="#1a1850" />
            </linearGradient>
            <linearGradient id="mtFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#131136" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <filter id="peakGlow">
              <feGaussianBlur stdDeviation="4" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background mountains — lighter indigo */}
          <motion.path
            style={{ y: mountainBackY }}
            d="M0,200 L60,160 L140,185 L260,110 L380,160 L500,125 L620,165 L760,90 L880,145 L1000,110 L1120,150 L1260,120 L1380,155 L1440,140 L1440,280 L0,280 Z"
            fill="url(#mtBack)"
            opacity="0.7"
          />

          {/* Mid mountains — angular peaks with temple spires */}
          <path
            d="M0,230 L80,195 L180,215 L280,150 L360,185 
               L440,170 L460,115 L470,95 L475,78 L480,95 L490,115 L510,170
               L600,180 L700,135 L820,170 L920,148 
               L1000,130 L1020,95 L1030,70 L1035,55 L1040,70 L1050,95 L1070,130
               L1160,155 L1280,140 L1380,165 L1440,150 L1440,280 L0,280 Z"
            fill="url(#mtMid)"
            opacity="0.9"
          />

          {/* Foreground terrain — darkest, jagged silhouette */}
          <motion.path
            style={{ y: mountainFrontY }}
            d="M0,280 L0,225 L40,218 L80,228 L120,210 L160,222 L200,205 
               L240,218 L280,200 L320,215 L360,203 L400,220 
               L440,208 L480,222 L520,205 L560,218 L600,210 
               L640,225 L680,208 L720,220 L760,205 L800,218 
               L840,208 L880,222 L920,210 L960,225 
               L1000,212 L1040,225 L1080,208 L1120,220 L1160,205 
               L1200,218 L1240,208 L1280,222 L1320,210 L1360,222 
               L1400,215 L1440,220 L1440,280 Z"
            fill="url(#mtFront)"
          />

          {/* Periwinkle edge highlights */}
          <path
            d="M260,110 L380,160 L500,125 L620,165 L760,90 L880,145 L1000,110 L1120,150"
            fill="none"
            stroke="#818CF8"
            strokeWidth="1.2"
            opacity="0.3"
          />
          <path
            d="M280,150 L360,185 L440,170 L475,78"
            fill="none"
            stroke="#6366F1"
            strokeWidth="0.8"
            opacity="0.25"
          />

          {/* Temple spire glow tips */}
          <g filter="url(#peakGlow)">
            <circle cx="475" cy="76" r="3" fill="#818CF8" opacity="0.9" />
            <circle cx="1035" cy="53" r="3" fill="#818CF8" opacity="0.9" />
            <circle cx="760" cy="88" r="2" fill="#6366F1" opacity="0.6" />
          </g>

          {/* Tiny window lights */}
          <rect x="467" y="95" width="2" height="3" fill="#A5B4FC" opacity="0.4" rx="0.5" />
          <rect x="481" y="95" width="2" height="3" fill="#A5B4FC" opacity="0.4" rx="0.5" />
          <rect x="1027" y="70" width="2" height="3" fill="#A5B4FC" opacity="0.4" rx="0.5" />
          <rect x="1041" y="70" width="2" height="3" fill="#A5B4FC" opacity="0.4" rx="0.5" />
        </svg>
      </motion.div>

      {/* Unifying gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(30, 27, 75, 0.08) 0%, rgba(15, 23, 42, 0.05) 30%, rgba(15, 23, 42, 0.1) 60%, rgba(15, 23, 42, 0.2) 100%)',
        }}
      />

      {/* Journey milestones */}
      <JourneyMilestones scrollProgress={smoothProgress} />
    </div>
  );
};

// Constellation group component
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
      
      {constellation.stars.map((star, idx) => (
        <motion.circle
          key={`star-${idx}`}
          cx={`${star.x}%`}
          cy={`${star.y}%`}
          r={isHovered ? star.size * 1.5 : star.size}
          fill={isHovered ? "#C7D2FE" : "#A5B4FC"}
          filter={isHovered ? "url(#starGlowHover)" : "url(#starGlow)"}
          style={{
            scale: useTransform(visibility, [0, 1], [0, 1]),
            transition: 'r 0.3s, fill 0.3s',
          }}
        />
      ))}
      
      <motion.text
        x={`${constellation.stars[0].x + 3}%`}
        y={`${constellation.stars[0].y - 2}%`}
        fill={isHovered ? "#C7D2FE" : "#A5B4FC"}
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

// Shooting star element
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
        background: '#A5B4FC',
        boxShadow: `
          -${star.length / 4}px 0 ${star.length / 8}px rgba(165, 180, 252, 0.8),
          -${star.length / 2}px 0 ${star.length / 4}px rgba(99, 102, 241, 0.4),
          -${star.length}px 0 ${star.length / 2}px rgba(99, 102, 241, 0.2)
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
        style={{ color: '#A5B4FC', textShadow: '0 0 20px rgba(165, 180, 252, 0.5)' }}
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
