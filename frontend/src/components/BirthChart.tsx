import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { IBirthChart } from '../types/kundali';
import { useIsDesktop } from '../hooks/useIsDesktop';

interface BirthChartProps {
  birthChart: IBirthChart;
  animateOnLoad?: boolean;
}

export const BirthChart: React.FC<BirthChartProps> = ({ birthChart, animateOnLoad = true }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!svgRef.current || !animateOnLoad || !isDesktop) return;

    // Animate chart elements on first load
    const elements = svgRef.current.querySelectorAll('[data-animate]');
    gsap.fromTo(
      elements,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'back.out',
      }
    );
  }, [animateOnLoad, isDesktop]);

  const RADIUS = 150;
  const CENTER = 200;

  // Calculate planet position on circle
  const getPlanetPosition = (degree: number) => {
    const angle = (degree * Math.PI) / 180;
    const x = CENTER + RADIUS * Math.cos(angle - Math.PI / 2);
    const y = CENTER + RADIUS * Math.sin(angle - Math.PI / 2);
    return { x, y };
  };

  return (
    <div className="flex justify-center items-center p-4">
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="w-full max-w-md h-auto"
        aria-label="Birth Chart Visualization"
      >
        {/* Outer circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          data-animate
        />

        {/* Inner circles */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS * 0.7}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1"
          opacity="0.5"
          data-animate
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS * 0.4}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1"
          opacity="0.5"
          data-animate
        />

        {/* Center point */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r="4"
          fill="#D4AF37"
          data-animate
        />

        {/* Zodiac signs around the wheel */}
        {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map(
          (sign, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x = CENTER + (RADIUS + 30) * Math.cos(angle - Math.PI / 2);
            const y = CENTER + (RADIUS + 30) * Math.sin(angle - Math.PI / 2);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#D4AF37"
                fontSize="14"
                fontFamily="Cinzel"
                data-animate
              >
                {sign}
              </text>
            );
          }
        )}

        {/* Planets */}
        {birthChart.planets.map((planet, index) => {
          const degree = (planet.degree + (planet.sign.charCodeAt(0) % 12) * 30) % 360;
          const pos = getPlanetPosition(degree);
          return (
            <g key={`planet-${index}`} data-animate>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill="#6A5ACD"
                opacity="0.8"
              />
              <text
                x={pos.x}
                y={pos.y - 15}
                textAnchor="middle"
                fill="#EAEAEA"
                fontSize="10"
                fontFamily="Inter"
              >
                {planet.name}
              </text>
            </g>
          );
        })}

        {/* Ascendant marker */}
        <g data-animate>
          <line
            x1={CENTER}
            y1={CENTER}
            x2={CENTER}
            y2={CENTER - RADIUS}
            stroke="#6A5ACD"
            strokeWidth="2"
            opacity="0.6"
          />
          <text
            x={CENTER}
            y={CENTER - RADIUS - 10}
            textAnchor="middle"
            fill="#6A5ACD"
            fontSize="12"
            fontFamily="Cinzel"
            fontWeight="bold"
          >
            ASC: {birthChart.ascendant}
          </text>
        </g>
      </svg>

      {/* Chart info */}
      <div className="mt-6 p-4 rounded-lg backdrop-blur-md bg-dark-secondary/40 border border-accent-gold/20 max-w-md">
        <h3 className="font-cinzel text-lg font-bold text-accent-gold mb-4">
          Your Birth Chart
        </h3>
        <div className="space-y-2">
          <p className="font-inter text-sm text-text-light/80">
            <span className="text-accent-gold font-semibold">Ascendant:</span> {birthChart.ascendant}
          </p>
          <p className="font-inter text-sm text-text-light/80">
            <span className="text-accent-gold font-semibold">Moon Sign:</span> {birthChart.moonSign}
          </p>
          <p className="font-inter text-sm text-text-light/80">
            <span className="text-accent-gold font-semibold">Planets:</span> {birthChart.planets.length}
          </p>
          <p className="font-inter text-sm text-text-light/80">
            <span className="text-accent-gold font-semibold">Houses:</span> {birthChart.houses.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BirthChart;
