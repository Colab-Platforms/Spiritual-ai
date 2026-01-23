import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Eye, Heart, Briefcase, Calendar, User, Shield, Star, Zap } from 'lucide-react';
import { zodiacSigns } from '@/data/zodiacData';
import ZodiacCard from '@/components/ZodiacCard';
import NewsletterForm from '@/components/NewsletterForm';

// Import zodiac images for the wheel
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

const zodiacWheelImages = [
  { name: 'Aries', img: ariesImg },
  { name: 'Taurus', img: taurusImg },
  { name: 'Gemini', img: geminiImg },
  { name: 'Cancer', img: cancerImg },
  { name: 'Leo', img: leoImg },
  { name: 'Virgo', img: virgoImg },
  { name: 'Libra', img: libraImg },
  { name: 'Scorpio', img: scorpioImg },
  { name: 'Sagittarius', img: sagittariusImg },
  { name: 'Capricorn', img: capricornImg },
  { name: 'Aquarius', img: aquariusImg },
  { name: 'Pisces', img: piscesImg },
];

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const offerRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero content animation
      gsap.fromTo('.hero-content', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
      );

      // Zodiac wheel slow rotation
      gsap.to(wheelRef.current, {
        rotation: 360,
        duration: 120,
        repeat: -1,
        ease: 'none',
      });

      // How it works section
      gsap.fromTo('.step-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          },
        }
      );

      // What we offer section
      gsap.fromTo('.offer-card',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: offerRef.current,
            start: 'top 80%',
          },
        }
      );

      // Trust section
      gsap.fromTo('.trust-item',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: trustRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const howItWorks = [
    { step: '01', title: 'Select Your Sign', description: 'Choose your zodiac sign from our mystical wheel', icon: Star },
    { step: '02', title: 'Explore Traits', description: 'Discover your personality, strengths and hidden depths', icon: Eye },
    { step: '03', title: 'Check Compatibility', description: 'Find your cosmic matches and understand relationships', icon: Heart },
    { step: '04', title: 'Daily Insights', description: 'Get personalized cosmic guidance every day', icon: Zap },
  ];

  const offerings = [
    { title: 'Zodiac Analysis', description: 'Deep personality insights for all 12 signs', icon: User },
    { title: 'Love Compatibility', description: 'Discover your perfect cosmic match', icon: Heart },
    { title: 'Career Guidance', description: 'Align your work with the stars', icon: Briefcase },
    { title: 'Daily Horoscope', description: 'Fresh cosmic wisdom every morning', icon: Calendar },
    { title: 'Birth Chart', description: 'Your unique celestial blueprint', icon: Sparkles },
    { title: 'Weekly Forecast', description: 'Plan ahead with stellar insights', icon: Eye },
  ];

  const trustReasons = [
    { title: 'Ancient Wisdom', description: 'Based on thousands of years of astrological tradition' },
    { title: 'Modern Precision', description: 'Enhanced with contemporary psychological insights' },
    { title: 'Personalized Readings', description: 'Tailored interpretations for your unique chart' },
    { title: 'Daily Updates', description: 'Fresh content aligned with celestial movements' },
  ];

  return (
    <div className="relative">
      {/* Hero Section with Zodiac Wheel */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Central Zodiac Wheel */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            ref={wheelRef}
            className="relative w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-30"
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-primary/20" />
            <div className="absolute inset-8 rounded-full border border-primary/15" />
            <div className="absolute inset-16 rounded-full border border-primary/10" />
            
            {/* Zodiac symbols around the wheel */}
            {zodiacWheelImages.map((zodiac, index) => {
              const angle = (index * 30 - 90) * (Math.PI / 180);
              const radius = 42;
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);
              
              return (
                <div
                  key={zodiac.name}
                  className="absolute w-12 h-12 md:w-16 md:h-16 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  <img 
                    src={zodiac.img} 
                    alt={zodiac.name}
                    className="w-full h-full object-contain opacity-60"
                  />
                </div>
              );
            })}

            {/* Center mystical geometry */}
            <div className="absolute inset-[35%] rounded-full border border-primary/30 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary/50 animate-pulse-glow" />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="hero-content relative z-10 container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider mb-6">
            <span className="text-cosmic">Discover Your</span>
            <br />
            <span className="text-foreground">Cosmic Blueprint</span>
          </h1>

          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 tracking-wide">
            Unlock the ancient wisdom of the stars and illuminate your path forward
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/zodiac" 
              className="btn-cosmic btn-pulse px-8 py-4 rounded-lg inline-flex items-center gap-3"
            >
              Explore Your Sign
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/horoscopes" 
              className="btn-outline-cosmic px-8 py-4 rounded-lg"
            >
              Daily Horoscope
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary rounded-full animate-pulse-glow" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={featuresRef} className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl tracking-wider text-glow text-primary mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto tracking-wide">
              Your journey to cosmic enlightenment in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div 
                key={index}
                className="step-card glass-card-hover rounded-2xl p-6 text-center relative"
              >
                <div className="absolute top-4 left-4 text-5xl font-display text-primary/10">
                  {item.step}
                </div>
                <div className="w-14 h-14 mx-auto mb-5 rounded-xl border border-primary/30 flex items-center justify-center bg-primary/5">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg tracking-wider text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section ref={offerRef} className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl tracking-wider text-glow text-primary mb-4">
              What We Offer
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto tracking-wide">
              Comprehensive cosmic guidance for every aspect of your life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings.map((item, index) => (
              <div 
                key={index}
                className="offer-card glass-card rounded-2xl p-6 border border-border hover:border-primary/40 transition-all duration-500 group cursor-pointer hover:shadow-[0_0_30px_rgba(245,195,106,0.1)]"
              >
                <div className="w-12 h-12 mb-4 rounded-lg border border-primary/30 flex items-center justify-center bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl tracking-wider text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zodiac Signs Grid */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl tracking-wider text-glow text-primary mb-4">
              The Twelve Signs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto tracking-wide">
              Each zodiac sign holds unique energies and cosmic wisdom
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {zodiacSigns.slice(0, 8).map((sign, index) => (
              <div key={sign.name} className="zodiac-preview-card">
                <ZodiacCard sign={sign} index={index} compact />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link 
              to="/zodiac" 
              className="btn-outline-cosmic px-8 py-3 rounded-lg inline-flex items-center gap-2"
            >
              View All Signs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Trust Section */}
      <section ref={trustRef} className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-primary mb-4">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-[0.2em]">Trust & Accuracy</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl tracking-wider text-foreground mb-6">
                  Why Trust Our Astrology
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Our readings combine ancient astrological wisdom with modern psychological insights, 
                  providing you with accurate, meaningful guidance for your journey through life.
                </p>
                <Link 
                  to="/about" 
                  className="btn-cosmic px-6 py-3 rounded-lg inline-flex items-center gap-2"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {trustReasons.map((reason, index) => (
                  <div 
                    key={index}
                    className="trust-item flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                    <div>
                      <h4 className="font-display text-lg tracking-wider text-foreground mb-1">{reason.title}</h4>
                      <p className="text-sm text-muted-foreground">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30" />
            
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="font-display text-2xl md:text-3xl tracking-wider text-foreground mb-4">
              Receive Daily Cosmic Wisdom
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Subscribe to get personalized horoscopes and celestial insights delivered to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
