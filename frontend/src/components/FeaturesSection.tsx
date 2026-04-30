import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useIsDesktop } from '../hooks/useIsDesktop';

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    id: 'birth-chart',
    title: 'Birth Chart / Kundali',
    description: 'Discover your personalized birth chart with planetary positions and house placements.',
    icon: '♈',
  },
  {
    id: 'daily-horoscope',
    title: 'Daily Horoscope',
    description: 'Get personalized daily predictions based on your zodiac sign and current planetary movements.',
    icon: '☀️',
  },
  {
    id: 'planet-positions',
    title: 'Planet Positions',
    description: 'Track the current positions of planets and their influence on your life.',
    icon: '🌙',
  },
  {
    id: 'daily-remedies',
    title: 'Daily Remedies',
    description: 'Receive personalized recommendations to harmonize with cosmic energies.',
    icon: '✨',
  },
];

export const FeaturesSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!isDesktop || !containerRef.current) return;

    // Staggered card reveal animation
    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.15,
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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-accent-gold mb-4">
            What You'll Discover
          </h2>
          <p className="font-inter text-text-light/80 text-lg">
            Explore the cosmic insights that await you
          </p>
        </div>

        {/* Features grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <div
              key={feature.id}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group relative p-6 rounded-lg backdrop-blur-md bg-dark-secondary/40 border border-accent-gold/20 hover:border-accent-gold/50 transition-all duration-300 overflow-hidden"
            >
              {/* Glow effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple/10 to-accent-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Glow border effect */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: '0 0 20px rgba(106, 90, 205, 0.3), inset 0 0 20px rgba(212, 175, 55, 0.1)',
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-cinzel text-xl font-bold text-accent-gold mb-3">
                  {feature.title}
                </h3>
                <p className="font-inter text-text-light/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
