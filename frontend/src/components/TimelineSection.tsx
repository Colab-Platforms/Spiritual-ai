import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useIsDesktop } from '../hooks/useIsDesktop';

gsap.registerPlugin(ScrollTrigger);

interface TimelineStep {
  id: string;
  number: number;
  title: string;
  description: string;
}

const steps: TimelineStep[] = [
  {
    id: 'step-1',
    number: 1,
    title: 'Enter Your Birth Details',
    description: 'Provide your date, time, and place of birth for accurate calculations.',
  },
  {
    id: 'step-2',
    number: 2,
    title: 'Generate Your Kundali',
    description: 'Our system calculates your personalized birth chart based on Vedic astrology.',
  },
  {
    id: 'step-3',
    number: 3,
    title: 'Explore Your Cosmic Profile',
    description: 'Discover insights about your personality, strengths, and life path.',
  },
];

export const TimelineSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!isDesktop || !containerRef.current) return;

    // Animate each step progressively
    stepsRef.current.forEach((step, index) => {
      if (!step) return;

      gsap.fromTo(
        step,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
            markers: false,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isDesktop]);

  return (
    <section className="relative py-20 px-4 md:px-8 bg-dark-primary overflow-hidden">
      {/* Star trail background animation */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="stars" x="100" y="100" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="#D4AF37" />
              <circle cx="50" cy="30" r="1" fill="#D4AF37" />
              <circle cx="80" cy="70" r="1" fill="#D4AF37" />
              <circle cx="30" cy="80" r="1" fill="#D4AF37" />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#stars)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-accent-gold mb-4">
            How It Works
          </h2>
          <p className="font-inter text-text-light/80 text-lg">
            Three simple steps to discover your cosmic destiny
          </p>
        </div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-accent-gold/50 to-mystic-purple/50" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => {
                  stepsRef.current[index] = el;
                }}
                className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="p-6 rounded-lg backdrop-blur-md bg-dark-secondary/40 border border-accent-gold/20">
                    <h3 className="font-cinzel text-xl font-bold text-accent-gold mb-2">
                      {step.title}
                    </h3>
                    <p className="font-inter text-text-light/70">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Step number circle */}
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-dark-secondary border-2 border-accent-gold flex items-center justify-center relative z-10">
                  <span className="font-cinzel text-2xl font-bold text-accent-gold">
                    {step.number}
                  </span>
                </div>

                {/* Empty space for alternating layout */}
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
