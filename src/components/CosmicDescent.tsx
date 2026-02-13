import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

// ─── Canvas Starfield (high-perf, single <canvas>) ───────────────────────────
const CanvasStarfield = memo(({ scrollY }: { scrollY: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<{ x: number; y: number; r: number; o: number; speed: number; hue: number }[]>([]);
  const rafRef = useRef<number>(0);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = isMobile ? 300 : 700;
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      o: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.02 + 0.005,
      hue: Math.random() > 0.8 ? 40 : Math.random() > 0.5 ? 220 : 0,
    }));
  }, [isMobile]);

  useEffect(() => {
    init();
    const onResize = () => init();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [init]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = performance.now() * 0.001;
      starsRef.current.forEach((s) => {
        const twinkle = Math.sin(t * s.speed * 10 + s.x) * 0.3 + 0.7;
        const alpha = s.o * twinkle;
        // Parallax: deeper stars move slower
        const py = ((s.y - scrollY * s.r * 0.08) % canvas.height + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(s.x, py, s.r, 0, Math.PI * 2);
        const hueStr = s.hue === 0 ? '0,0%' : `${s.hue},60%`;
        ctx.fillStyle = `hsla(${hueStr},90%,${alpha})`;
        ctx.fill();
        if (s.r > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, py, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hueStr},80%,${alpha * 0.15})`;
          ctx.fill();
        }
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [scrollY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    />
  );
});
CanvasStarfield.displayName = 'CanvasStarfield';

// ─── Nebula blobs ─────────────────────────────────────────────────────────────
const NebulaLayer = memo(({ progress }: { progress: number }) => {
  const opacity = Math.max(0, 1 - progress * 3);
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity, willChange: 'opacity' }}>
      <div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600, top: '10%', left: '60%',
          background: 'radial-gradient(ellipse, hsla(220, 60%, 40%, 0.2) 0%, hsla(260, 50%, 30%, 0.08) 50%, transparent 70%)',
          filter: 'blur(80px)', transform: 'translate3d(0,0,0)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500, top: '20%', left: '5%',
          background: 'radial-gradient(ellipse, hsla(40, 70%, 50%, 0.15) 0%, hsla(30, 60%, 40%, 0.06) 50%, transparent 70%)',
          filter: 'blur(70px)', transform: 'translate3d(0,0,0)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400, top: '40%', right: '10%',
          background: 'radial-gradient(ellipse, hsla(280, 40%, 35%, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)', transform: 'translate3d(0,0,0)',
        }}
      />
    </div>
  );
});
NebulaLayer.displayName = 'NebulaLayer';

// ─── Zodiac Belt ──────────────────────────────────────────────────────────────
const zodiacSymbols = [
  { sign: '♈', name: 'Aries', x: 8, y: 20 },
  { sign: '♉', name: 'Taurus', x: 25, y: 35 },
  { sign: '♊', name: 'Gemini', x: 45, y: 15 },
  { sign: '♋', name: 'Cancer', x: 62, y: 40 },
  { sign: '♌', name: 'Leo', x: 78, y: 22 },
  { sign: '♍', name: 'Virgo', x: 92, y: 45 },
  { sign: '♎', name: 'Libra', x: 15, y: 55 },
  { sign: '♏', name: 'Scorpio', x: 35, y: 65 },
  { sign: '♐', name: 'Sagittarius', x: 55, y: 58 },
  { sign: '♑', name: 'Capricorn', x: 72, y: 70 },
  { sign: '♒', name: 'Aquarius', x: 88, y: 60 },
  { sign: '♓', name: 'Pisces', x: 50, y: 80 },
];

const ZodiacBelt = memo(({ progress }: { progress: number }) => {
  // Visible between 20%-50%
  const sectionProgress = Math.max(0, Math.min(1, (progress - 0.15) / 0.3));
  const fadeIn = Math.min(1, sectionProgress * 3);
  const fadeOut = Math.max(0, 1 - (sectionProgress - 0.6) * 3);
  const opacity = Math.min(fadeIn, fadeOut);

  if (opacity <= 0) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity, willChange: 'opacity, transform' }}
    >
      {/* Zodiac ring glow */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 500, height: 500,
          transform: `translate3d(-50%, -50%, 0) rotate(${sectionProgress * 30}deg)`,
          border: '1px solid hsla(40, 85%, 65%, 0.15)',
          borderRadius: '50%',
          boxShadow: '0 0 60px hsla(40, 85%, 65%, 0.1), inset 0 0 60px hsla(40, 85%, 65%, 0.05)',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 520, height: 520,
          transform: `translate3d(-50%, -50%, 0) rotate(${-sectionProgress * 15}deg)`,
          border: '1px dashed hsla(40, 85%, 65%, 0.08)',
          borderRadius: '50%',
          willChange: 'transform',
        }}
      />

      {zodiacSymbols.map((z, i) => {
        const delay = i * 0.06;
        const symbolOpacity = Math.max(0, Math.min(1, (sectionProgress - delay) * 4));
        const yOffset = (1 - symbolOpacity) * 30;
        return (
          <div
            key={z.name}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: `${z.x}%`, top: `${z.y}%`,
              opacity: symbolOpacity,
              transform: `translate3d(-50%, ${yOffset}px, 0)`,
              willChange: 'transform, opacity',
            }}
          >
            <span
              className="text-3xl md:text-4xl"
              style={{
                color: 'hsl(40, 85%, 65%)',
                textShadow: '0 0 20px hsla(40, 85%, 65%, 0.6), 0 0 40px hsla(40, 85%, 65%, 0.3)',
                filter: `blur(${(1 - symbolOpacity) * 2}px)`,
              }}
            >
              {z.sign}
            </span>
            <span
              className="text-[10px] tracking-[0.25em] uppercase font-display"
              style={{
                color: 'hsla(40, 85%, 65%, 0.7)',
                textShadow: '0 0 10px hsla(40, 85%, 65%, 0.3)',
              }}
            >
              {z.name}
            </span>
          </div>
        );
      })}

      {/* Section title */}
      <div
        className="absolute left-1/2 bottom-[8%] text-center"
        style={{
          transform: 'translate3d(-50%, 0, 0)',
          opacity: Math.min(fadeIn, fadeOut) * 0.8,
        }}
      >
        <p className="text-xs tracking-[0.4em] uppercase font-display text-muted-foreground">
          The Zodiac Belt
        </p>
      </div>
    </div>
  );
});
ZodiacBelt.displayName = 'ZodiacBelt';

// ─── Solar System (2D parallax planets) ───────────────────────────────────────
const planets = [
  { name: 'Mercury', size: 16, color: 'hsl(30, 20%, 55%)', x: 15, baseY: 120, parallaxSpeed: 0.8 },
  { name: 'Venus', size: 28, color: 'hsl(40, 50%, 60%)', x: 30, baseY: 100, parallaxSpeed: 0.65, glow: 'hsla(40, 50%, 60%, 0.3)' },
  { name: 'Earth', size: 32, color: 'hsl(210, 60%, 50%)', x: 50, baseY: 80, parallaxSpeed: 0.5, glow: 'hsla(210, 60%, 50%, 0.3)', ring: false },
  { name: 'Mars', size: 22, color: 'hsl(10, 70%, 45%)', x: 70, baseY: 110, parallaxSpeed: 0.7 },
  { name: 'Saturn', size: 48, color: 'hsl(40, 40%, 55%)', x: 85, baseY: 70, parallaxSpeed: 0.4, hasRing: true },
];

const SolarSystemLayer = memo(({ progress }: { progress: number }) => {
  // Visible between 45%-75%
  const sectionProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.3));
  const fadeIn = Math.min(1, sectionProgress * 2.5);
  const fadeOut = Math.max(0, 1 - (sectionProgress - 0.65) * 3);
  const opacity = Math.min(fadeIn, fadeOut);

  if (opacity <= 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity, willChange: 'opacity' }}>
      {/* Sun glow at center */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 120, height: 120,
          transform: 'translate3d(-50%, -50%, 0)',
          background: 'radial-gradient(circle, hsla(40, 90%, 65%, 0.8) 0%, hsla(40, 85%, 55%, 0.4) 30%, hsla(30, 80%, 45%, 0.1) 60%, transparent 80%)',
          borderRadius: '50%',
          boxShadow: '0 0 80px hsla(40, 90%, 60%, 0.5), 0 0 160px hsla(40, 85%, 55%, 0.2)',
          willChange: 'transform',
        }}
      />

      {planets.map((p, i) => {
        const yOffset = p.baseY - sectionProgress * p.parallaxSpeed * 200;
        return (
          <div
            key={p.name}
            className="absolute"
            style={{
              left: `${p.x}%`,
              transform: `translate3d(-50%, ${yOffset}px, 0)`,
              willChange: 'transform',
            }}
          >
            {/* Planet body */}
            <div
              style={{
                width: p.size, height: p.size, borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, ${p.color}, hsl(0, 0%, 8%))`,
                boxShadow: p.glow ? `0 0 ${p.size}px ${p.glow}` : undefined,
              }}
            />
            {/* Saturn ring */}
            {p.hasRing && (
              <div
                className="absolute left-1/2 top-1/2"
                style={{
                  width: p.size * 2.2, height: p.size * 0.5,
                  transform: 'translate3d(-50%, -50%, 0) rotateX(70deg)',
                  border: '2px solid hsla(40, 40%, 55%, 0.5)',
                  borderRadius: '50%',
                }}
              />
            )}
            {/* Label */}
            <span
              className="absolute left-1/2 -translate-x-1/2 mt-2 text-[9px] tracking-[0.2em] uppercase font-display whitespace-nowrap"
              style={{ color: 'hsla(40, 20%, 75%, 0.6)' }}
            >
              {p.name}
            </span>
          </div>
        );
      })}

      {/* Orbit rings */}
      {[140, 200, 270, 340, 420].map((r, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: r, height: r,
            transform: 'translate3d(-50%, -50%, 0)',
            border: '1px solid hsla(40, 85%, 65%, 0.06)',
          }}
        />
      ))}
    </div>
  );
});
SolarSystemLayer.displayName = 'SolarSystemLayer';

// ─── Atmosphere / Clouds ──────────────────────────────────────────────────────
const AtmosphereLayer = memo(({ progress }: { progress: number }) => {
  // Visible between 65%-90%
  const sectionProgress = Math.max(0, Math.min(1, (progress - 0.6) / 0.25));
  const opacity = Math.min(1, sectionProgress * 2);

  if (opacity <= 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ willChange: 'opacity' }}>
      {/* Cloud layers with parallax */}
      {[
        { y: 10, blur: 30, o: 0.15, speed: 0 },
        { y: 30, blur: 20, o: 0.2, speed: 0.1 },
        { y: 55, blur: 15, o: 0.3, speed: 0.2 },
        { y: 75, blur: 10, o: 0.4, speed: 0.3 },
      ].map((cloud, i) => {
        const cloudOpacity = Math.max(0, opacity - cloud.speed * sectionProgress);
        // Clouds clear as you descend
        const clearProgress = Math.max(0, (sectionProgress - 0.4) * 2);
        const finalOpacity = cloudOpacity * (1 - clearProgress * (1 - i * 0.2));
        return (
          <div
            key={i}
            className="absolute left-0 right-0"
            style={{
              top: `${cloud.y}%`, height: '25%',
              opacity: Math.max(0, finalOpacity),
              background: `linear-gradient(180deg, transparent 0%, hsla(210, 30%, 80%, ${cloud.o}) 40%, hsla(210, 25%, 85%, ${cloud.o * 0.8}) 60%, transparent 100%)`,
              filter: `blur(${cloud.blur}px)`,
              transform: `translate3d(${Math.sin(sectionProgress * 2 + i) * 20}px, 0, 0)`,
              willChange: 'transform, opacity',
            }}
          />
        );
      })}

      {/* Atmospheric glow */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          opacity: opacity * 0.4,
          background: 'linear-gradient(to top, hsla(210, 40%, 70%, 0.15), transparent)',
        }}
      />
    </div>
  );
});
AtmosphereLayer.displayName = 'AtmosphereLayer';

// ─── Earth / Temple Silhouette ────────────────────────────────────────────────
const EarthLanding = memo(({ progress }: { progress: number }) => {
  // Visible from 80% onwards
  const sectionProgress = Math.max(0, Math.min(1, (progress - 0.75) / 0.25));
  const opacity = Math.min(1, sectionProgress * 2);

  if (opacity <= 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity, willChange: 'opacity' }}>
      {/* Ground gradient */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background: 'linear-gradient(to top, hsla(215, 30%, 5%, 1) 0%, hsla(215, 25%, 8%, 0.8) 40%, transparent 100%)',
        }}
      />

      {/* Mountain / Temple SVG silhouette */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{
          height: '35vh',
          transform: `translate3d(0, ${(1 - sectionProgress) * 50}px, 0)`,
          willChange: 'transform',
        }}
      >
        <defs>
          <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(215, 25%, 12%)" />
            <stop offset="100%" stopColor="hsl(215, 30%, 5%)" />
          </linearGradient>
        </defs>
        {/* Far mountains */}
        <path
          d="M0,200 L80,160 L160,180 L240,120 L320,150 L400,100 L480,140 L560,80 L640,130 L720,90 L760,70 L800,95 L880,110 L960,75 L1040,130 L1120,90 L1200,140 L1280,100 L1360,160 L1440,120 L1440,320 L0,320 Z"
          fill="hsl(215, 25%, 10%)"
          opacity="0.6"
        />
        {/* Near mountains with temple peak */}
        <path
          d="M0,260 L100,220 L200,240 L300,190 L400,210 L500,170 L580,195 L660,140 L700,120 L720,100 L740,120 L780,140 L860,180 L940,200 L1020,160 L1100,190 L1180,210 L1260,180 L1340,220 L1440,200 L1440,320 L0,320 Z"
          fill="url(#mountainGrad)"
        />
        {/* Temple structure at center peak */}
        <g transform="translate(680, 80)" opacity="0.9">
          {/* Temple pillars */}
          <rect x="0" y="12" width="4" height="28" fill="hsl(40, 85%, 65%)" opacity="0.4" />
          <rect x="16" y="12" width="4" height="28" fill="hsl(40, 85%, 65%)" opacity="0.4" />
          <rect x="32" y="12" width="4" height="28" fill="hsl(40, 85%, 65%)" opacity="0.4" />
          <rect x="48" y="12" width="4" height="28" fill="hsl(40, 85%, 65%)" opacity="0.4" />
          <rect x="64" y="12" width="4" height="28" fill="hsl(40, 85%, 65%)" opacity="0.4" />
          {/* Temple roof - triangular pediment */}
          <polygon points="34,0 -4,14 72,14" fill="hsl(40, 85%, 65%)" opacity="0.3" />
          {/* Base */}
          <rect x="-6" y="40" width="80" height="4" fill="hsl(40, 85%, 65%)" opacity="0.3" />
        </g>
      </svg>

      {/* Mystic trees/forest silhouette edges */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        style={{ height: '15vh' }}
      >
        <path
          d="M0,80 C60,60 100,70 140,50 C180,30 200,60 240,40 C280,20 320,50 360,30 C400,10 440,40 480,25 C520,10 560,50 600,35 C640,15 680,45 720,20 C760,5 800,40 840,25 C880,10 920,45 960,30 C1000,15 1040,50 1080,35 C1120,20 1160,45 1200,30 C1240,15 1280,40 1320,25 C1360,10 1400,45 1440,30 L1440,160 L0,160 Z"
          fill="hsl(215, 30%, 5%)"
        />
      </svg>

      {/* Arrival text */}
      <div
        className="absolute bottom-[20%] left-1/2 text-center"
        style={{
          transform: 'translate3d(-50%, 0, 0)',
          opacity: Math.max(0, (sectionProgress - 0.5) * 2),
        }}
      >
        <p
          className="text-xs tracking-[0.5em] uppercase font-display mb-2"
          style={{ color: 'hsla(40, 85%, 65%, 0.6)' }}
        >
          You Have Arrived
        </p>
        <h3
          className="font-display text-xl md:text-2xl tracking-wider"
          style={{
            color: 'hsl(40, 85%, 65%)',
            textShadow: '0 0 30px hsla(40, 85%, 65%, 0.4)',
          }}
        >
          The Temple of Stars
        </h3>
      </div>
    </div>
  );
});
EarthLanding.displayName = 'EarthLanding';

// ─── Journey Milestones ───────────────────────────────────────────────────────
const milestones = [
  { at: 0.12, text: 'Leaving the Source...' },
  { at: 0.25, text: 'Entering the Zodiac Belt...' },
  { at: 0.5, text: 'Passing through the Solar System...' },
  { at: 0.7, text: 'Descending into the Atmosphere...' },
  { at: 0.88, text: 'Approaching Earth...' },
];

const JourneyMilestones = memo(({ progress }: { progress: number }) => (
  <>
    {milestones.map((m, i) => {
      const dist = Math.abs(progress - m.at);
      const opacity = dist < 0.06 ? 1 - dist / 0.06 : 0;
      if (opacity <= 0) return null;
      return (
        <div
          key={i}
          className="absolute left-1/2 top-[15%] text-center pointer-events-none"
          style={{
            transform: 'translate3d(-50%, 0, 0)',
            opacity,
          }}
        >
          <span
            className="text-xs tracking-[0.3em] uppercase font-display"
            style={{
              color: 'hsl(40, 85%, 65%)',
              textShadow: '0 0 20px hsla(40, 85%, 65%, 0.5)',
            }}
          >
            {m.text}
          </span>
        </div>
      );
    })}
  </>
));
JourneyMilestones.displayName = 'JourneyMilestones';

// ─── Shooting Stars ───────────────────────────────────────────────────────────
const ShootingStars = memo(() => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; angle: number }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const spawn = () => {
      setStars((prev) => [
        ...prev.slice(-2),
        { id: idRef.current++, x: Math.random() * 80 + 10, y: Math.random() * 40, angle: Math.random() * 30 + 25 },
      ]);
    };
    const iv = setInterval(spawn, 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute w-1 h-[2px] rounded-full pointer-events-none"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            background: 'hsl(40, 90%, 80%)',
            boxShadow: '-40px 0 20px hsla(40, 85%, 65%, 0.6), -80px 0 40px hsla(40, 85%, 65%, 0.3)',
            transform: `rotate(${s.angle}deg)`,
            willChange: 'transform, opacity',
          }}
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={{ opacity: 0, x: 300, y: 200 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      ))}
    </>
  );
});
ShootingStars.displayName = 'ShootingStars';

// ─── Main Component ───────────────────────────────────────────────────────────
const CosmicDescent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPx, setScrollPx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      setProgress(v);
      setScrollPx(v * window.innerHeight * 4); // Approximate scroll px for canvas
    });
    return unsub;
  }, [scrollYProgress]);

  // Hero content fades
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -80]);

  // Background color shift
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.85, 1],
    ['#050810', '#080c16', '#0a1020', '#0c1525', '#0b0f14']
  );

  // Scroll indicator
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <div ref={containerRef} style={{ height: '500vh' }} className="relative">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background color */}
        <motion.div className="absolute inset-0" style={{ backgroundColor: bgColor }} />

        {/* Canvas starfield */}
        <CanvasStarfield scrollY={scrollPx} />

        {/* Nebula layer (deep space) */}
        <NebulaLayer progress={progress} />

        {/* Shooting stars */}
        <ShootingStars />

        {/* Zodiac belt */}
        <ZodiacBelt progress={progress} />

        {/* Solar system */}
        <SolarSystemLayer progress={progress} />

        {/* Atmosphere / clouds */}
        <AtmosphereLayer progress={progress} />

        {/* Earth landing */}
        <EarthLanding progress={progress} />

        {/* Journey milestones */}
        <JourneyMilestones progress={progress} />

        {/* Hero content */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider mb-6">
                <span className="text-primary text-glow">Descend Through</span>
                <br />
                <span className="text-foreground">The Cosmos</span>
              </h1>
              <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 tracking-wide">
                From source energy to sacred earth — scroll to journey through the stars, the zodiac, and beyond
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/zodiac" className="btn-cosmic btn-pulse px-8 py-4 rounded-lg inline-flex items-center gap-3">
                  Explore Your Sign
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/horoscopes" className="btn-outline-cosmic px-8 py-4 rounded-lg">
                  Daily Horoscope
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground font-display tracking-widest uppercase">
              Scroll to Descend
            </span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
              <ChevronDown className="w-6 h-6 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        {/* Depth indicator */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-1">
          <div
            className="w-[2px] h-32 rounded-full overflow-hidden"
            style={{ background: 'hsla(40, 85%, 65%, 0.1)' }}
          >
            <div
              className="w-full rounded-full"
              style={{
                height: `${progress * 100}%`,
                background: 'linear-gradient(to bottom, hsl(40, 85%, 65%), hsl(40, 70%, 50%))',
                transition: 'height 0.1s',
              }}
            />
          </div>
          <span className="text-[9px] font-display tracking-widest text-muted-foreground mt-1">
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default CosmicDescent;
