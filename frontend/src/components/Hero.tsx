import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import BirthDataForm from './BirthDataForm';
import { useIsDesktop } from '../hooks/useIsDesktop';

export const Hero: React.FC = () => {
  const starsContainerRef = useRef<HTMLDivElement>(null);
  const zodiacWheelRef = useRef<SVGSVGElement>(null);
  const planetsRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    // Create animated stars
    if (starsContainerRef.current) {
      const starsContainer = starsContainerRef.current;
      starsContainer.innerHTML = '';

      // Create 100 random stars
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 2 + 0.5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;

        star.className = 'absolute rounded-full bg-white';
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.opacity = `${Math.random() * 0.7 + 0.3}`;

        starsContainer.appendChild(star);

        // Animate star twinkle
        if (isDesktop) {
          gsap.to(star, {
            opacity: Math.random() * 0.7 + 0.3,
            duration,
            delay,
            repeat: -1,
            yoyo: true,
          });
        }
      }
    }
  }, [isDesktop]);

  useEffect(() => {
    // Animate zodiac wheel rotation
    if (zodiacWheelRef.current && isDesktop) {
      gsap.to(zodiacWheelRef.current, {
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%',
      });
    }
  }, [isDesktop]);

  useEffect(() => {
    // Animate planets Y-axis
    if (planetsRef.current && isDesktop) {
      const planets = planetsRef.current.querySelectorAll('[data-planet]');
      planets.forEach((planet, index) => {
        const delay = index * 0.2;
        gsap.to(planet, {
          y: 20,
          duration: 3,
          delay,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }
  }, [isDesktop]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-dark-primary">
      {/* Cosmic background with stars */}
      <div
        ref={starsContainerRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-primary/50 to-dark-primary" />

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Zodiac wheel */}
        <div className="absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48 opacity-20">
          <svg
            ref={zodiacWheelRef}
            viewBox="0 0 200 200"
            className="w-full h-full"
            aria-hidden="true"
          >
            <circle cx="100" cy="100" r="95" fill="none" stroke="#D4AF37" strokeWidth="2" />
            {/* Zodiac signs around the wheel */}
            {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map(
              (sign, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x = 100 + 75 * Math.cos(angle);
                const y = 100 + 75 * Math.sin(angle);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#D4AF37"
                    fontSize="12"
                    fontFamily="Cinzel"
                  >
                    {sign}
                  </text>
                );
              }
            )}
          </svg>
        </div>

        {/* Floating planets */}
        <div ref={planetsRef} className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Planet 1 */}
          <div
            data-planet
            className="absolute w-8 h-8 rounded-full bg-accent-gold/30 blur-md"
            style={{ top: '20%', left: '10%' }}
            aria-hidden="true"
          />
          {/* Planet 2 */}
          <div
            data-planet
            className="absolute w-12 h-12 rounded-full bg-mystic-purple/20 blur-lg"
            style={{ top: '60%', right: '15%' }}
            aria-hidden="true"
          />
          {/* Planet 3 */}
          <div
            data-planet
            className="absolute w-6 h-6 rounded-full bg-accent-gold/20 blur-md"
            style={{ bottom: '20%', left: '20%' }}
            aria-hidden="true"
          />
        </div>

        {/* Main content */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-accent-gold mb-4">
            Discover What The Stars Have Written For You
          </h1>
          <p className="font-inter text-lg md:text-xl text-text-light/80">
            Ancient wisdom, personalized for your life
          </p>
        </div>

        {/* Birth data form */}
        <div className="w-full max-w-md">
          <BirthDataForm />
        </div>
      </div>
    </section>
  );
};

export default Hero;
