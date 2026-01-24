import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Heart, Briefcase, Activity, Sparkles } from 'lucide-react';
import { zodiacSigns } from '@/data/zodiacData';

gsap.registerPlugin(ScrollTrigger);

const horoscopeReadings: Record<string, { love: string; career: string; health: string; lucky: number[] }> = {
  aries: {
    love: "Venus aligns with your sign today, bringing passionate energy to your relationships. Single Aries may find an unexpected connection. For those in relationships, express your feelings openly.",
    career: "Mars empowers your professional ambitions. A bold move at work could lead to recognition. Trust your instincts when making decisions.",
    health: "Your energy levels are high today. Channel this into physical activity. Be mindful of stress and take breaks when needed.",
    lucky: [7, 14, 21, 33, 42],
  },
  taurus: {
    love: "The Moon enhances your emotional depth. Connect with your partner on a deeper level. Singles should embrace vulnerability.",
    career: "Financial opportunities arise unexpectedly. Your practical approach will help you make wise decisions. Stay patient.",
    health: "Focus on relaxation and self-care. A spa day or nature walk would benefit your well-being.",
    lucky: [2, 11, 20, 29, 38],
  },
  gemini: {
    love: "Communication is your superpower today. Express your desires clearly. A meaningful conversation could transform a relationship.",
    career: "Your quick thinking impresses colleagues. Multiple projects may demand attention - prioritize wisely.",
    health: "Mental stimulation is important. Engage in puzzles or learning something new to keep your mind sharp.",
    lucky: [5, 14, 23, 32, 41],
  },
  cancer: {
    love: "Your nurturing nature attracts admirers. Family bonds strengthen today. Create a cozy atmosphere for loved ones.",
    career: "Intuition guides your work decisions. Trust your gut feeling about a new opportunity or project.",
    health: "Emotional wellness is the focus. Practice self-compassion and avoid absorbing others' stress.",
    lucky: [2, 7, 21, 28, 35],
  },
  leo: {
    love: "Your charisma is magnetic today. Romance flourishes under your warm glow. Plan something special for your partner.",
    career: "Leadership opportunities arise. Your creative ideas gain recognition. Don't shy away from the spotlight.",
    health: "Your vitality is strong. Express yourself through dance, art, or any creative physical activity.",
    lucky: [1, 10, 19, 28, 37],
  },
  virgo: {
    love: "Small gestures of care speak volumes. Pay attention to details in your relationship. Practical love languages matter.",
    career: "Your analytical skills solve a complex problem. Organization leads to productivity. Help others see the bigger picture.",
    health: "Focus on nutrition and routine. Small health improvements compound over time.",
    lucky: [5, 14, 23, 32, 41],
  },
  libra: {
    love: "Harmony in relationships is your theme. Seek balance between giving and receiving. A romantic gesture is well-received.",
    career: "Partnerships and collaborations are favored. Your diplomatic skills resolve conflicts. Fair negotiations lead to success.",
    health: "Balance is key - not too much, not too little. Find equilibrium in your wellness routine.",
    lucky: [6, 15, 24, 33, 42],
  },
  scorpio: {
    love: "Intensity deepens connections. A transformative conversation brings you closer. Trust allows vulnerability.",
    career: "Your investigative nature uncovers valuable information. Strategic moves lead to advancement.",
    health: "Release emotional tension through exercise or meditation. Transformation begins within.",
    lucky: [9, 18, 27, 36, 45],
  },
  sagittarius: {
    love: "Adventure calls in romance. Plan a spontaneous date or trip. Your optimism is contagious.",
    career: "Expand your horizons professionally. International connections or learning opportunities arise.",
    health: "Outdoor activities boost your spirit. Explore new hiking trails or sports.",
    lucky: [3, 12, 21, 30, 39],
  },
  capricorn: {
    love: "Commitment and stability in love. Show your dedication through actions. Long-term plans take shape.",
    career: "Your ambition reaches new heights. Recognition for hard work is coming. Stay focused on goals.",
    health: "Structure supports your well-being. Stick to your health routine with discipline.",
    lucky: [8, 17, 26, 35, 44],
  },
  aquarius: {
    love: "Unconventional romance excites you. Embrace uniqueness in relationships. Friendship forms the foundation.",
    career: "Innovation sets you apart. Your visionary ideas gain support. Collaborate with like-minded individuals.",
    health: "Try alternative wellness practices. Technology can support your health goals.",
    lucky: [4, 13, 22, 31, 40],
  },
  pisces: {
    love: "Dreamy romantic energy surrounds you. Express love through creativity. Soulful connections deepen.",
    career: "Creative projects flourish. Your intuition guides successful decisions. Art and spirituality merge with work.",
    health: "Water activities soothe your soul. Meditation and gentle yoga benefit you greatly.",
    lucky: [3, 12, 21, 30, 39],
  },
};

const DailyHoroscopes = () => {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.zodiac-selector',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (selectedSign && readingRef.current) {
      gsap.fromTo(
        readingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [selectedSign]);

  const selectedZodiac = zodiacSigns.find(s => s.name.toLowerCase() === selectedSign);
  const reading = selectedSign ? horoscopeReadings[selectedSign] : null;

  const categories = [
    { key: 'love', icon: Heart, title: 'Love & Relationships', color: 'text-pink-400' },
    { key: 'career', icon: Briefcase, title: 'Career & Finance', color: 'text-amber-400' },
    { key: 'health', icon: Activity, title: 'Health & Wellness', color: 'text-emerald-400' },
  ];

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="page-title font-display text-4xl md:text-5xl lg:text-6xl text-glow text-primary mb-4">
            Daily Horoscopes
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your zodiac sign to receive your personalized celestial guidance for today
          </p>
        </div>

        {/* Zodiac Selector */}
        <div className="zodiac-selector max-w-md mx-auto mb-12">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full glass-card p-4 rounded-xl flex items-center justify-between text-left"
            >
              {selectedZodiac ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl" style={{ textShadow: `0 0 20px ${selectedZodiac.color}` }}>
                    {selectedZodiac.symbol}
                  </span>
                  <div>
                    <div className="font-display text-foreground">{selectedZodiac.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedZodiac.dates}</div>
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">Choose your zodiac sign...</span>
              )}
              <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-20 max-h-80 overflow-y-auto">
                {zodiacSigns.map((sign) => (
                  <button
                    key={sign.name}
                    onClick={() => {
                      setSelectedSign(sign.name.toLowerCase());
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full p-3 flex items-center gap-3 hover:bg-primary/10 transition-colors ${
                      selectedSign === sign.name.toLowerCase() ? 'bg-primary/10' : ''
                    }`}
                  >
                    <span className="text-2xl">{sign.symbol}</span>
                    <div className="text-left">
                      <div className="font-display text-sm text-foreground">{sign.name}</div>
                      <div className="text-xs text-muted-foreground">{sign.dates}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Horoscope Reading */}
        {selectedSign && reading && selectedZodiac && (
          <div ref={readingRef} className="max-w-4xl mx-auto">
            {/* Sign Header */}
            <div className="text-center mb-10">
              <div 
                className="text-7xl mb-4"
                style={{ textShadow: `0 0 40px ${selectedZodiac.color}` }}
              >
                {selectedZodiac.symbol}
              </div>
              <h2 className="font-display text-3xl text-foreground mb-2">{selectedZodiac.name}</h2>
              <p className="text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Categories */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {categories.map((cat) => (
                <div key={cat.key} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <cat.icon className={`w-6 h-6 ${cat.color}`} />
                    <h3 className="font-display text-lg text-foreground">{cat.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {reading[cat.key as keyof typeof reading]}
                  </p>
                </div>
              ))}
            </div>

            {/* Lucky Numbers */}
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-display text-lg text-foreground">Lucky Numbers</h3>
              </div>
              <div className="flex justify-center gap-3 flex-wrap">
                {reading.lucky.map((num, index) => (
                  <div 
                    key={index}
                    className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-display text-primary text-lg"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Prompt to select */}
        {!selectedSign && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-30">✨</div>
            <p className="text-muted-foreground">Select your zodiac sign above to reveal today's cosmic guidance</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyHoroscopes;
