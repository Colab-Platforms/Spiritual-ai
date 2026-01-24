import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import SolarSystem from './SolarSystem';
import CloudLayer from './CloudLayer';
import MountainSilhouette from './MountainSilhouette';
import ZodiacFormation from './ZodiacFormation';

// Loading fallback for 3D scene
const SceneLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <span className="text-sm text-muted-foreground font-display tracking-wider">Loading cosmos...</span>
    </div>
  </div>
);

export const ScrollytellingHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAssembled, setHasAssembled] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setScrollProgress(v);
      // Trigger zodiac assembly at 85% scroll
      if (v > 0.85 && !hasAssembled) {
        setHasAssembled(true);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, hasAssembled]);

  // Background color transition
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['hsl(220, 20%, 4%)', 'hsl(230, 25%, 10%)', 'hsl(var(--background))']
  );
  
  // Hero content fade
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  
  // 3D scene fade
  const sceneOpacity = useTransform(scrollYProgress, [0.5, 0.8], [1, 0]);
  
  // Zodiac visibility
  const showZodiac = scrollProgress > 0.6;

  return (
    <div ref={containerRef} className="relative" style={{ height: '400vh' }}>
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Animated background */}
        <motion.div 
          className="absolute inset-0"
          style={{ backgroundColor: bgColor }}
        />
        
        {/* 3D Solar System Scene */}
        <motion.div 
          className="absolute inset-0"
          style={{ opacity: sceneOpacity }}
        >
          <Suspense fallback={<SceneLoader />}>
            <SolarSystem scrollProgress={scrollProgress} />
          </Suspense>
        </motion.div>
        
        {/* Cloud layers during descent */}
        <CloudLayer scrollProgress={scrollProgress} />
        
        {/* Mountain silhouette at bottom */}
        <MountainSilhouette scrollProgress={scrollProgress} />
        
        {/* Zodiac formation animation */}
        <ZodiacFormation isVisible={showZodiac} hasAssembled={hasAssembled} />
        
        {/* Hero content overlay */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider mb-6">
                <span className="text-primary text-glow">Journey Through</span>
                <br />
                <span className="text-foreground">The Cosmos</span>
              </h1>
              
              <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 tracking-wide">
                From stardust to destiny — scroll to descend through space and discover the ancient wisdom of the zodiac
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  to="/zodiac" 
                  className="btn-cosmic btn-pulse px-8 py-4 rounded-lg inline-flex items-center gap-3"
                >
                  Explore Your Sign
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/horoscopes" 
                  className="btn-outline-cosmic px-8 py-4 rounded-lg"
                >
                  Daily Horoscope
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground font-display tracking-widest uppercase">
              Scroll to Descend
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-6 h-6 text-primary" />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Bottom section content (visible when scrolled) */}
        {scrollProgress > 0.9 && (
          <motion.div 
            className="absolute bottom-24 left-0 right-0 z-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm text-muted-foreground font-display tracking-[0.3em] uppercase mb-2">
              Stardust Forms Destiny
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-primary text-glow">
              The Twelve Signs Await
            </h2>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScrollytellingHero;
