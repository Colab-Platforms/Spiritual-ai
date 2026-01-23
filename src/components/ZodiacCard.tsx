import { Link } from 'react-router-dom';
import { ZodiacSign } from '@/data/zodiacData';

interface ZodiacCardProps {
  sign: ZodiacSign;
  index: number;
  compact?: boolean;
}

const ZodiacCard = ({ sign, index, compact = false }: ZodiacCardProps) => {
  const elementColors = {
    Fire: 'from-red-500/20 to-orange-500/20',
    Earth: 'from-green-500/20 to-emerald-600/20',
    Air: 'from-yellow-400/20 to-amber-500/20',
    Water: 'from-blue-500/20 to-cyan-500/20',
  };

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
      className="glass-card-hover rounded-2xl p-6 block group relative overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Gradient overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${elementColors[sign.element]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="text-5xl md:text-6xl transition-transform duration-300 group-hover:scale-110"
            style={{ textShadow: `0 0 30px ${sign.color}` }}
          >
            {sign.symbol}
          </div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground px-2 py-1 rounded-full bg-muted/30">
            {sign.element}
          </span>
        </div>

        <h3 className="font-display text-xl text-foreground mb-1">{sign.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{sign.dates}</p>
        
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
          {sign.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {sign.traits.slice(0, 3).map((trait) => (
            <span 
              key={trait}
              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ZodiacCard;
