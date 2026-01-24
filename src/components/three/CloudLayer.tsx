import { motion } from 'framer-motion';

interface CloudLayerProps {
  scrollProgress: number;
}

export const CloudLayer = ({ scrollProgress }: CloudLayerProps) => {
  // Clouds appear between 40% and 70% scroll
  const cloudOpacity = scrollProgress > 0.4 && scrollProgress < 0.7 
    ? Math.sin((scrollProgress - 0.4) / 0.3 * Math.PI) * 0.8
    : 0;

  const cloudY = (1 - scrollProgress) * 100;

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity: cloudOpacity }}
    >
      {/* Cloud layers with parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: `${cloudY * 0.5}%` }}
      >
        {/* Large cloud wisps */}
        <div className="absolute top-1/4 left-0 w-full h-64 bg-gradient-to-r from-transparent via-muted/40 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-1/2 h-48 bg-muted/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-2/3 h-56 bg-gradient-to-l from-muted/30 to-transparent blur-3xl" />
      </motion.div>
      
      <motion.div 
        className="absolute inset-0"
        style={{ y: `${cloudY * 0.3}%` }}
      >
        <div className="absolute top-1/3 left-1/3 w-1/3 h-40 bg-muted/20 rounded-full blur-2xl" />
        <div className="absolute top-2/5 right-1/4 w-1/4 h-32 bg-muted/25 rounded-full blur-2xl" />
      </motion.div>
      
      {/* Fog overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent"
        style={{ opacity: cloudOpacity * 0.5 }}
      />
    </div>
  );
};

export default CloudLayer;
