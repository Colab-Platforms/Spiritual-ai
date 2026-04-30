import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useIsDesktop } from '../hooks/useIsDesktop';

gsap.registerPlugin(ScrollTrigger);

export const TrustSection: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!isDesktop) return;

    // Text fade-in animation
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
            markers: false,
          },
        }
      );
    }

    // SVG constellation draw animation
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll('path, line');
      paths.forEach((path) => {
        const element = path as SVGElement;
        const length = (element as any).getTotalLength?.() || 0;
        if (length > 0) {
          element.style.strokeDasharray = `${length}`;
          element.style.strokeDashoffset = `${length}`;

          gsap.to(element, {
            strokeDashoffset: 0,
            duration: 2,
            scrollTrigger: {
              trigger: svgRef.current,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1,
              markers: false,
            },
          });
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isDesktop]);

  return (
    <section className="relative py-20 px-4 md:px-8 bg-dark-primary overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div ref={textRef} className="opacity-0">
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-accent-gold mb-6">
              Why Astrology Matters
            </h2>
            <p className="font-inter text-text-light/80 text-lg leading-relaxed mb-4">
              For thousands of years, civilizations have looked to the stars for guidance and understanding. 
              Astrology is not about predicting the future—it's about understanding yourself.
            </p>
            <p className="font-inter text-text-light/80 text-lg leading-relaxed mb-4">
              Your birth chart is a cosmic snapshot of the exact moment you entered the world. 
              It reveals your strengths, challenges, and the unique path written in the stars.
            </p>
            <p className="font-inter text-text-light/80 text-lg leading-relaxed">
              In our modern world, this ancient wisdom offers clarity, perspective, and a deeper connection 
              to yourself and the universe around you.
            </p>
          </div>

          {/* Right: Constellation SVG */}
          <div className="flex justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 300 300"
              className="w-full max-w-sm h-auto"
              aria-hidden="true"
            >
              {/* Constellation lines */}
              <line x1="50" y1="50" x2="150" y2="100" stroke="#D4AF37" strokeWidth="2" />
              <line x1="150" y1="100" x2="250" y2="80" stroke="#D4AF37" strokeWidth="2" />
              <line x1="250" y1="80" x2="200" y2="200" stroke="#D4AF37" strokeWidth="2" />
              <line x1="200" y1="200" x2="100" y2="180" stroke="#D4AF37" strokeWidth="2" />
              <line x1="100" y1="180" x2="50" y2="50" stroke="#D4AF37" strokeWidth="2" />
              <line x1="150" y1="100" x2="100" y2="180" stroke="#D4AF37" strokeWidth="2" />
              <line x1="150" y1="100" x2="200" y2="200" stroke="#D4AF37" strokeWidth="2" />

              {/* Stars (circles) */}
              <circle cx="50" cy="50" r="4" fill="#D4AF37" />
              <circle cx="150" cy="100" r="5" fill="#D4AF37" />
              <circle cx="250" cy="80" r="4" fill="#D4AF37" />
              <circle cx="200" cy="200" r="4" fill="#D4AF37" />
              <circle cx="100" cy="180" r="4" fill="#D4AF37" />

              {/* Glow effect */}
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle cx="150" cy="100" r="6" fill="none" stroke="#6A5ACD" strokeWidth="1" filter="url(#glow)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
