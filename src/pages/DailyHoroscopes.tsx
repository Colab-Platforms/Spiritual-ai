import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Heart, Briefcase, Activity, Sparkles } from 'lucide-react';
import { zodiacSigns } from '@/data/zodiacData';

// Import zodiac images for visual display
import ariesImg from '@/assets/zodiac/aries.png';
import taurusImg from '@/assets/zodiac/taurus.png';
import geminiImg from '@/assets/zodiac/gemini.png';
import cancerImg from '@/assets/zodiac/cancer.png';
import leoImg from '@/assets/zodiac/leo.png';
import virgoImg from '@/assets/zodiac/virgo.png';
import libraImg from '@/assets/zodiac/libra.png';
import scorpioImg from '@/assets/zodiac/scorpio.png';
import sagittariusImg from '@/assets/zodiac/sagittarius.png';
import capricornImg from '@/assets/zodiac/capricorn.png';
import aquariusImg from '@/assets/zodiac/aquarius.png';
import piscesImg from '@/assets/zodiac/pisces.png';

gsap.registerPlugin(ScrollTrigger);

const zodiacImages: Record<string, string> = {
  aries: ariesImg,
  taurus: taurusImg,
  gemini: geminiImg,
  cancer: cancerImg,
  leo: leoImg,
  virgo: virgoImg,
  libra: libraImg,
  scorpio: scorpioImg,
  sagittarius: sagittariusImg,
  capricorn: capricornImg,
  aquarius: aquariusImg,
  pisces: piscesImg,
};

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
      {/* Glassmorphism cosmic background */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-sm" />
      
      {/* Cosmic decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="page-title font-display text-5xl md:text-6xl lg:text-7xl text-glow text-primary mb-4">
            Daily Horoscopes
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select your zodiac sign to receive your personalized celestial guidance for today
          </p>
        </div>

        {/* Zodiac Selector */}
        <div className="zodiac-selector max-w-md mx-auto mb-12">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full glass-card bg-card/40 backdrop-blur-xl p-4 rounded-xl flex items-center justify-between text-left border-primary/20"
            >
              {selectedZodiac ? (
                <div className="flex items-center gap-4">
                  <img 
                    src={zodiacImages[selectedSign!]} 
                    alt={selectedZodiac.name}
                    className="w-12 h-12 object-contain"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(245, 195, 106, 0.5))' }}
                  />
                  <div>
                    <div className="font-display text-xl text-foreground">{selectedZodiac.name}</div>
                    <div className="text-base text-muted-foreground">{selectedZodiac.dates}</div>
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground text-lg">Choose your zodiac sign...</span>
              )}
              <ChevronDown className={`w-6 h-6 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-card bg-card/60 backdrop-blur-xl rounded-xl overflow-hidden z-20 max-h-80 overflow-y-auto border-primary/20">
                {zodiacSigns.map((sign) => (
                  <button
                    key={sign.name}
                    onClick={() => {
                      setSelectedSign(sign.name.toLowerCase());
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full p-4 flex items-center gap-4 hover:bg-primary/10 transition-colors ${
                      selectedSign === sign.name.toLowerCase() ? 'bg-primary/15' : ''
                    }`}
                  >
                    <img 
                      src={zodiacImages[sign.name.toLowerCase()]} 
                      alt={sign.name}
                      className="w-10 h-10 object-contain"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(245, 195, 106, 0.4))' }}
                    />
                    <div className="text-left">
                      <div className="font-display text-base text-foreground">{sign.name}</div>
                      <div className="text-sm text-muted-foreground">{sign.dates}</div>
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
              <div className="flex justify-center mb-4">
                <img 
                  src={zodiacImages[selectedSign]} 
                  alt={selectedZodiac.name}
                  className="w-24 h-24 object-contain"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(245, 195, 106, 0.6))' }}
                />
              </div>
              <h2 className="font-display text-4xl text-foreground mb-2">{selectedZodiac.name}</h2>
              <p className="text-muted-foreground text-lg">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Categories */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {categories.map((cat) => (
                <div key={cat.key} className="glass-card bg-card/40 backdrop-blur-xl rounded-2xl p-6 border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <cat.icon className={`w-7 h-7 ${cat.color}`} />
                    <h3 className="font-display text-xl text-foreground">{cat.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {reading[cat.key as keyof typeof reading]}
                  </p>
                </div>
              ))}
            </div>

            {/* Lucky Numbers */}
            <div className="glass-card bg-card/40 backdrop-blur-xl rounded-2xl p-8 text-center border-primary/10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <h3 className="font-display text-xl text-foreground">Lucky Numbers</h3>
              </div>
              <div className="flex justify-center gap-4 flex-wrap">
                {reading.lucky.map((num, index) => (
                  <div 
                    key={index}
                    className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center font-display text-primary text-xl border border-primary/30"
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
            <div className="text-7xl mb-6 opacity-30">✨</div>
            <p className="text-muted-foreground text-lg">Select your zodiac sign above to reveal today's cosmic guidance</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyHoroscopes;