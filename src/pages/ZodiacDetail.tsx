import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { zodiacSigns } from '@/data/zodiacData';

const ZodiacDetail = () => {
  const { sign: signParam } = useParams<{ sign: string }>();
  const pageRef = useRef<HTMLDivElement>(null);

  const sign = zodiacSigns.find(s => s.name.toLowerCase() === signParam?.toLowerCase());

  useEffect(() => {
    if (!sign) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.detail-symbol', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' });
      gsap.fromTo('.detail-title', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2 });
      gsap.fromTo('.detail-section', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, delay: 0.4 });
    }, pageRef);

    return () => ctx.revert();
  }, [sign]);

  if (!sign) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Zodiac sign not found</p>
          <Link to="/zodiac" className="btn-outline-cosmic px-6 py-3 rounded-lg">
            Back to Zodiac Signs
          </Link>
        </div>
      </div>
    );
  }

  const elementColors = {
    Fire: 'from-red-500/30 to-orange-500/30',
    Earth: 'from-green-500/30 to-emerald-600/30',
    Air: 'from-yellow-400/30 to-amber-500/30',
    Water: 'from-blue-500/30 to-cyan-500/30',
  };

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <Link 
          to="/zodiac" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Signs
        </Link>

        {/* Hero Section */}
        <div className="glass-card rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${elementColors[sign.element]} opacity-50`} />
          
          <div className="relative z-10 text-center">
            <div 
              className="detail-symbol text-8xl md:text-9xl mb-6"
              style={{ textShadow: `0 0 60px ${sign.color}` }}
            >
              {sign.symbol}
            </div>
            <h1 className="detail-title font-display text-4xl md:text-5xl text-foreground mb-2">{sign.name}</h1>
            <p className="text-muted-foreground text-lg mb-4">{sign.dates}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 glass-card rounded-full text-sm">
                Element: <span className="text-primary">{sign.element}</span>
              </span>
              <span className="px-4 py-2 glass-card rounded-full text-sm">
                Ruling Planet: <span className="text-primary">{sign.ruling}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="detail-section glass-card rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="font-display text-2xl text-primary mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            About {sign.name}
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">{sign.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Traits */}
          <div className="detail-section glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl text-foreground mb-4">Key Traits</h3>
            <div className="flex flex-wrap gap-2">
              {sign.traits.map((trait) => (
                <span key={trait} className="px-3 py-2 rounded-full bg-primary/10 text-primary text-sm">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="detail-section glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl text-foreground mb-4">Strengths</h3>
            <ul className="space-y-2">
              {sign.strengths.map((strength) => (
                <li key={strength} className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-emerald-400">✦</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="detail-section glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl text-foreground mb-4">Challenges</h3>
            <ul className="space-y-2">
              {sign.weaknesses.map((weakness) => (
                <li key={weakness} className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-amber-400">✦</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>

          {/* Compatibility */}
          <div className="detail-section glass-card rounded-2xl p-6">
            <h3 className="font-display text-xl text-foreground mb-4">Best Matches</h3>
            <div className="flex flex-wrap gap-2">
              {sign.compatibility.map((match) => {
                const matchSign = zodiacSigns.find(s => s.name === match);
                return (
                  <Link 
                    key={match}
                    to={`/zodiac/${match.toLowerCase()}`}
                    className="px-3 py-2 rounded-full bg-nebula-pink/20 text-nebula-pink text-sm hover:bg-nebula-pink/30 transition-colors"
                  >
                    {matchSign?.symbol} {match}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZodiacDetail;
