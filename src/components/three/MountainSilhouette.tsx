import { motion } from 'framer-motion';

interface MountainSilhouetteProps {
  scrollProgress: number;
}

export const MountainSilhouette = ({ scrollProgress }: MountainSilhouetteProps) => {
  // Mountains appear after 70% scroll
  const mountainOpacity = scrollProgress > 0.7 ? (scrollProgress - 0.7) / 0.3 : 0;
  const mountainY = (1 - mountainOpacity) * 30;

  return (
    <motion.div 
      className="absolute bottom-0 left-0 right-0 pointer-events-none"
      style={{ 
        opacity: mountainOpacity,
        y: `${mountainY}%`,
      }}
    >
      {/* Mountain SVG silhouette */}
      <svg
        viewBox="0 0 1440 320"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          {/* Mountain gradient */}
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--card))" />
            <stop offset="100%" stopColor="hsl(var(--background))" />
          </linearGradient>
          
          {/* Glow effect */}
          <filter id="mountainGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background mountains (darker, further) */}
        <path
          d="M0,256 L120,224 L240,256 L360,192 L480,256 L600,208 L720,256 L840,176 L960,240 L1080,192 L1200,256 L1320,208 L1440,256 L1440,320 L0,320 Z"
          fill="hsl(var(--muted))"
          opacity="0.3"
        />
        
        {/* Middle mountains */}
        <path
          d="M0,288 L80,256 L160,288 L280,224 L400,272 L520,240 L640,288 L760,208 L880,256 L1000,224 L1120,272 L1240,240 L1360,288 L1440,256 L1440,320 L0,320 Z"
          fill="hsl(var(--muted))"
          opacity="0.5"
        />
        
        {/* Foreground mountains with golden edge highlight */}
        <path
          d="M0,320 L100,280 L200,300 L320,240 L440,290 L560,260 L680,300 L800,230 L920,280 L1040,250 L1160,290 L1280,260 L1400,300 L1440,280 L1440,320 L0,320 Z"
          fill="url(#mountainGradient)"
        />
        
        {/* Golden edge line */}
        <path
          d="M0,320 L100,280 L200,300 L320,240 L440,290 L560,260 L680,300 L800,230 L920,280 L1040,250 L1160,290 L1280,260 L1400,300 L1440,280"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          opacity="0.4"
          filter="url(#mountainGlow)"
        />
        
        {/* Stars/lights on peaks */}
        <circle cx="320" cy="238" r="2" fill="hsl(var(--primary))" opacity="0.8" />
        <circle cx="800" cy="228" r="2" fill="hsl(var(--primary))" opacity="0.8" />
        <circle cx="1040" cy="248" r="1.5" fill="hsl(var(--primary))" opacity="0.6" />
      </svg>
      
      {/* Ground gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
    </motion.div>
  );
};

export default MountainSilhouette;
