import { Link } from 'react-router-dom';
import { ZodiacSign } from '@/data/zodiacData';

interface ZodiacCardProps {
  sign: ZodiacSign;
  index: number;
  compact?: boolean;
}

// SVG line art for each zodiac sign
const zodiacLineArt: Record<string, JSX.Element> = {
  Aries: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M60 160 C60 100, 80 60, 100 40 C120 60, 140 100, 140 160" strokeLinecap="round"/>
      <path d="M70 120 C80 90, 90 70, 100 55" strokeLinecap="round"/>
      <path d="M130 120 C120 90, 110 70, 100 55" strokeLinecap="round"/>
      <circle cx="60" cy="160" r="8"/>
      <circle cx="140" cy="160" r="8"/>
    </svg>
  ),
  Taurus: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="100" cy="130" rx="50" ry="45"/>
      <path d="M50 130 C50 90, 70 70, 100 70 C130 70, 150 90, 150 130" strokeLinecap="round"/>
      <path d="M40 70 C30 50, 35 30, 55 35" strokeLinecap="round"/>
      <path d="M160 70 C170 50, 165 30, 145 35" strokeLinecap="round"/>
      <circle cx="80" cy="110" r="5"/>
      <circle cx="120" cy="110" r="5"/>
      <ellipse cx="100" cy="135" rx="15" ry="10"/>
    </svg>
  ),
  Gemini: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M50 40 L150 40" strokeLinecap="round"/>
      <path d="M50 160 L150 160" strokeLinecap="round"/>
      <path d="M70 40 L70 160" strokeLinecap="round"/>
      <path d="M130 40 L130 160" strokeLinecap="round"/>
      <circle cx="70" cy="80" r="15"/>
      <circle cx="130" cy="80" r="15"/>
    </svg>
  ),
  Cancer: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M40 100 C40 60, 80 40, 120 50 C140 55, 155 70, 160 90" strokeLinecap="round"/>
      <circle cx="55" cy="100" r="20"/>
      <path d="M160 100 C160 140, 120 160, 80 150 C60 145, 45 130, 40 110" strokeLinecap="round"/>
      <circle cx="145" cy="100" r="20"/>
    </svg>
  ),
  Leo: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="80" cy="80" r="35"/>
      <path d="M115 80 C140 80, 150 100, 140 120 C130 140, 100 150, 80 140" strokeLinecap="round"/>
      <path d="M80 140 C60 150, 50 170, 70 180" strokeLinecap="round"/>
      <path d="M60 60 C40 40, 60 20, 80 30" strokeLinecap="round"/>
      <path d="M100 60 C120 40, 140 50, 130 70" strokeLinecap="round"/>
    </svg>
  ),
  Virgo: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M50 40 L50 140 C50 160, 70 170, 90 160" strokeLinecap="round"/>
      <path d="M80 40 L80 140 C80 160, 100 170, 120 160" strokeLinecap="round"/>
      <path d="M110 40 L110 140 C110 160, 130 170, 150 160" strokeLinecap="round"/>
      <path d="M150 160 C160 180, 140 190, 130 175" strokeLinecap="round"/>
      <path d="M130 175 L145 190" strokeLinecap="round"/>
    </svg>
  ),
  Libra: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M40 140 L160 140" strokeLinecap="round"/>
      <path d="M40 160 L160 160" strokeLinecap="round"/>
      <path d="M100 140 L100 80" strokeLinecap="round"/>
      <path d="M60 80 C60 50, 100 40, 140 80" strokeLinecap="round"/>
    </svg>
  ),
  Scorpio: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M40 40 L40 140 C40 160, 60 170, 80 160" strokeLinecap="round"/>
      <path d="M70 40 L70 140 C70 160, 90 170, 110 160" strokeLinecap="round"/>
      <path d="M100 40 L100 140 C100 160, 120 170, 140 160" strokeLinecap="round"/>
      <path d="M140 160 L160 140" strokeLinecap="round"/>
      <path d="M150 155 L160 140 L165 155" strokeLinecap="round"/>
    </svg>
  ),
  Sagittarius: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M40 160 L160 40" strokeLinecap="round"/>
      <path d="M120 40 L160 40 L160 80" strokeLinecap="round"/>
      <path d="M80 100 L120 140" strokeLinecap="round"/>
    </svg>
  ),
  Capricorn: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M50 40 L50 120 C50 150, 80 160, 100 140" strokeLinecap="round"/>
      <path d="M50 80 C70 60, 100 70, 100 100" strokeLinecap="round"/>
      <path d="M100 140 C120 160, 150 150, 160 120 C170 90, 150 70, 130 80" strokeLinecap="round"/>
      <circle cx="130" cy="80" r="15"/>
    </svg>
  ),
  Aquarius: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M40 80 C60 60, 80 100, 100 80 C120 60, 140 100, 160 80" strokeLinecap="round"/>
      <path d="M40 120 C60 100, 80 140, 100 120 C120 100, 140 140, 160 120" strokeLinecap="round"/>
    </svg>
  ),
  Pisces: (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M60 40 C30 70, 30 130, 60 160" strokeLinecap="round"/>
      <path d="M140 40 C170 70, 170 130, 140 160" strokeLinecap="round"/>
      <path d="M40 100 L160 100" strokeLinecap="round"/>
    </svg>
  ),
};

const ZodiacCard = ({ sign, index, compact = false }: ZodiacCardProps) => {
  if (compact) {
    return (
      <Link 
        to={`/zodiac/${sign.name.toLowerCase()}`}
        className="glass-card-hover rounded-2xl p-5 text-center block group"
      >
        <div 
          className="text-4xl md:text-5xl mb-3 transition-transform duration-300 group-hover:scale-110"
          style={{ textShadow: `0 0 20px ${sign.color}` }}
        >
          {sign.symbol}
        </div>
        <h3 className="font-display text-lg text-foreground mb-1">{sign.name}</h3>
        <p className="text-xs text-muted-foreground">{sign.dates}</p>
      </Link>
    );
  }

  return (
    <Link 
      to={`/zodiac/${sign.name.toLowerCase()}`}
      className="group block relative"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Card container with dark background and subtle grid */}
      <div className="relative rounded-3xl bg-[#0a0a0f] border border-accent/20 overflow-hidden transition-all duration-500 hover:border-accent/50 hover:shadow-[0_0_40px_rgba(232,175,93,0.15)]">
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(232,175,93,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232,175,93,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Line art illustration */}
        <div className="relative h-48 md:h-56 flex items-center justify-center p-8">
          <div className="w-32 h-32 md:w-40 md:h-40 text-accent transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(232,175,93,0.5)]">
            {zodiacLineArt[sign.name]}
          </div>
        </div>

        {/* Content section */}
        <div className="relative px-6 pb-6 pt-2">
          {/* Element badge */}
          <div className="absolute -top-3 right-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent/70 px-3 py-1 rounded-full border border-accent/30 bg-[#0a0a0f]">
              {sign.element}
            </span>
          </div>

          <h3 className="font-display text-2xl text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
            {sign.name}
          </h3>
          <p className="text-sm text-muted-foreground/70 mb-4">{sign.dates}</p>
          
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
            {sign.description}
          </p>

          {/* Traits */}
          <div className="flex flex-wrap gap-2">
            {sign.traits.slice(0, 3).map((trait) => (
              <span 
                key={trait}
                className="text-xs px-3 py-1 rounded-full border border-accent/20 text-accent/80 bg-accent/5"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ZodiacCard;
