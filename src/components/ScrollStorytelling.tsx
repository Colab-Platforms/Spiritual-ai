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

const ScrollStorytelling = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [hoveredConstellation, setHoveredConstellation] = useState<Constellation | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const shootingStarIdRef = useRef(0);
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Transform values for different scroll sections
  const nebulaOpacity = useTransform(smoothProgress, [0.2, 0.4], [0, 0.4]);
  const galaxyScale = useTransform(smoothProgress, [0.5, 0.7], [0.5, 1]);
  const galaxyOpacity = useTransform(smoothProgress, [0.5, 0.6], [0, 1]);
  const cometProgress = useTransform(smoothProgress, [0.7, 0.9], [0, 1]);
  
  // Spawn shooting stars at intervals during scroll
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
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Animated nebula cloud that fades in */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          opacity: nebulaOpacity,
          left: '60%',
          top: '20%',
          background: 'radial-gradient(ellipse at center, hsla(40, 70%, 50%, 0.15) 0%, hsla(40, 60%, 40%, 0.08) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      <motion.div 
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          opacity: nebulaOpacity,
          left: '10%',
          top: '50%',
          background: 'radial-gradient(ellipse at center, hsla(200, 50%, 40%, 0.12) 0%, hsla(220, 40%, 30%, 0.06) 40%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Constellations that appear at scroll milestones - interactive */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="starGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="starGlowHover">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(40, 85%, 65%)" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="hsl(40, 85%, 65%)" stopOpacity="0.2"/>
          </linearGradient>
          <linearGradient id="lineGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(40, 85%, 75%)" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="hsl(40, 85%, 65%)" stopOpacity="0.5"/>
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
              className="p-4 rounded-xl backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, hsla(215, 20%, 12%, 0.95) 0%, hsla(215, 25%, 8%, 0.95) 100%)',
                border: '1px solid hsla(40, 85%, 65%, 0.3)',
                boxShadow: '0 0 40px hsla(40, 85%, 65%, 0.15), 0 20px 60px hsla(215, 30%, 3%, 0.8)',
              }}
            >
              <h3 
                className="font-display text-lg tracking-wider mb-2"
                style={{ 
                  color: 'hsl(40, 85%, 65%)',
                  textShadow: '0 0 10px hsla(40, 85%, 65%, 0.5)',
                }}
              >
                {hoveredConstellation.name}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {hoveredConstellation.mythology.origin}
              </p>
              
              <div 
                className="text-xs mb-3 p-2 rounded-lg"
                style={{ 
                  background: 'hsla(40, 85%, 65%, 0.1)',
                  border: '1px solid hsla(40, 85%, 65%, 0.2)',
                }}
              >
                <span className="text-primary font-display tracking-wider">MEANING: </span>
                <span className="text-foreground/80">{hoveredConstellation.mythology.meaning}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {hoveredConstellation.mythology.keyStars.map((star) => (
                  <span 
                    key={star}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: 'hsla(40, 85%, 65%, 0.15)',
                      color: 'hsl(40, 85%, 70%)',
                      border: '1px solid hsla(40, 85%, 65%, 0.3)',
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

      {/* Distant spiral galaxy */}
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
        <div 
          className="w-full h-full rounded-full animate-spin-slow"
          style={{
            background: `
              conic-gradient(
                from 0deg,
                transparent 0deg,
                hsla(40, 70%, 60%, 0.3) 30deg,
                transparent 60deg,
                hsla(40, 60%, 50%, 0.2) 120deg,
                transparent 180deg,
                hsla(40, 70%, 60%, 0.25) 240deg,
                transparent 300deg,
                hsla(40, 60%, 50%, 0.2) 340deg,
                transparent 360deg
              )
            `,
            filter: 'blur(8px)',
          }}
        />
        <div 
          className="absolute inset-1/4 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(40, 80%, 70%, 0.5) 0%, transparent 70%)',
            filter: 'blur(4px)',
          }}
        />
      </motion.div>

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <ShootingStarElement key={star.id} star={star} />
      ))}

      {/* Comet with tail at end of journey */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: useTransform(cometProgress, [0, 1], ['0%', '100%']),
          top: useTransform(cometProgress, [0, 1], ['80%', '20%']),
          opacity: useTransform(cometProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
        }}
      >
        <div className="relative">
          {/* Comet tail */}
          <div 
            className="absolute w-32 h-1 -left-32 top-1/2 -translate-y-1/2"
            style={{
              background: 'linear-gradient(to right, transparent, hsla(40, 80%, 65%, 0.8))',
              filter: 'blur(2px)',
            }}
          />
          <div 
            className="absolute w-24 h-0.5 -left-24 top-1/2 -translate-y-1/2 -mt-1"
            style={{
              background: 'linear-gradient(to right, transparent, hsla(40, 70%, 55%, 0.5))',
              filter: 'blur(3px)',
            }}
          />
          {/* Comet head */}
          <div 
            className="w-3 h-3 rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(40, 90%, 80%) 0%, hsl(40, 85%, 65%) 50%, transparent 100%)',
              boxShadow: '0 0 20px hsl(40, 85%, 65%), 0 0 40px hsla(40, 85%, 65%, 0.5)',
            }}
          />
        </div>
      </motion.div>

      {/* Journey milestone text hints */}
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
    [0, 0.3, 1]
  );
  
  const lineProgress = useTransform(
    scrollProgress,
    [constellation.triggerProgress, constellation.triggerProgress + 0.15],
    [0, 1]
  );

  // Calculate bounding box for hit area
  const minX = Math.min(...constellation.stars.map(s => s.x)) - 3;
  const maxX = Math.max(...constellation.stars.map(s => s.x)) + 3;
  const minY = Math.min(...constellation.stars.map(s => s.y)) - 3;
  const maxY = Math.max(...constellation.stars.map(s => s.y)) + 3;

  return (
    <motion.g style={{ opacity: visibility }}>
      {/* Invisible hit area for hover detection */}
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
      
      {/* Constellation lines */}
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
      
      {/* Stars */}
      {constellation.stars.map((star, idx) => (
        <motion.circle
          key={`star-${idx}`}
          cx={`${star.x}%`}
          cy={`${star.y}%`}
          r={isHovered ? star.size * 1.5 : star.size}
          fill={isHovered ? "hsl(40, 90%, 85%)" : "hsl(40, 85%, 75%)"}
          filter={isHovered ? "url(#starGlowHover)" : "url(#starGlow)"}
          style={{
            scale: useTransform(visibility, [0, 1], [0, 1]),
            transition: 'r 0.3s, fill 0.3s',
          }}
        />
      ))}
      
      {/* Constellation name label */}
      <motion.text
        x={`${constellation.stars[0].x + 3}%`}
        y={`${constellation.stars[0].y - 2}%`}
        fill={isHovered ? "hsl(40, 90%, 75%)" : "hsl(40, 85%, 65%)"}
        fontSize={isHovered ? "12" : "10"}
        fontFamily="Iceland, sans-serif"
        letterSpacing="0.2em"
        style={{
          opacity: useTransform(visibility, [0.5, 1], [0, isHovered ? 1 : 0.7]),
          transition: 'font-size 0.3s, fill 0.3s',
          textShadow: isHovered ? '0 0 15px hsla(40, 85%, 65%, 0.8)' : 'none',
        }}
      >
        {constellation.name.toUpperCase()}
      </motion.text>
    </motion.g>
  );
};

// Animated shooting star
const ShootingStarElement = ({ star }: { star: ShootingStar }) => {
  return (
    <motion.div
      className="absolute"
      initial={{ 
        left: `${star.startX}%`, 
        top: `${star.startY}%`,
        opacity: 1,
      }}
      animate={{ 
        left: `${star.startX + star.length * Math.cos(star.angle * Math.PI / 180)}%`,
        top: `${star.startY + star.length * Math.sin(star.angle * Math.PI / 180)}%`,
        opacity: 0,
      }}
      transition={{ 
        duration: star.speed, 
        ease: 'easeOut',
      }}
    >
      <div 
        className="w-1 h-1 rounded-full"
        style={{
          background: 'hsl(40, 90%, 80%)',
          boxShadow: `
            -${star.length / 4}px 0 ${star.length / 8}px hsla(40, 85%, 65%, 0.8),
            -${star.length / 2}px 0 ${star.length / 4}px hsla(40, 85%, 65%, 0.4),
            -${star.length}px 0 ${star.length / 2}px hsla(40, 85%, 65%, 0.2)
          `,
          transform: `rotate(${star.angle}deg)`,
        }}
      />
    </motion.div>
  );
};

// Subtle journey milestone text that fades in/out
const JourneyMilestones = ({ 
  scrollProgress 
}: { 
  scrollProgress: ReturnType<typeof useSpring>;
}) => {
  const milestones = [
    { progress: 0.2, text: 'Entering the constellation zone...' },
    { progress: 0.5, text: 'Distant galaxies emerge...' },
    { progress: 0.75, text: 'A comet crosses your path...' },
  ];

  return (
    <>
      {milestones.map((milestone, idx) => (
        <motion.div
          key={idx}
          className="absolute left-1/2 -translate-x-1/2 text-center"
          style={{
            top: `${20 + idx * 25}%`,
            opacity: useTransform(
              scrollProgress,
              [milestone.progress - 0.05, milestone.progress, milestone.progress + 0.08, milestone.progress + 0.15],
              [0, 0.8, 0.8, 0]
            ),
          }}
        >
          <span 
            className="text-xs tracking-[0.3em] uppercase"
            style={{ 
              color: 'hsl(40, 85%, 65%)',
              textShadow: '0 0 20px hsla(40, 85%, 65%, 0.5)',
            }}
          >
            {milestone.text}
          </span>
        </motion.div>
      ))}
    </>
  );
};

export default ScrollStorytelling;
