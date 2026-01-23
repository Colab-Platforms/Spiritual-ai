import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Star, Moon, Sun } from 'lucide-react';
import heroImage from '@/assets/hero-cosmic.jpg';
import { zodiacSigns } from '@/data/zodiacData';
import ZodiacCard from '@/components/ZodiacCard';
import NewsletterForm from '@/components/NewsletterForm';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const zodiacRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' }
      );

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' }
      );

      // Features section animation
      gsap.fromTo(
        '.feature-card',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          },
        }
      );

      // Zodiac section animation
      gsap.fromTo(
        '.zodiac-preview-card',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: zodiacRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: Star,
      title: 'Daily Horoscopes',
      description: 'Personalized cosmic guidance for love, career, and health updated every day.',
    },
    {
      icon: Moon,
      title: 'Birth Chart',
      description: 'Discover your unique celestial blueprint with detailed planetary positions.',
    },
    {
      icon: Sun,
      title: 'Compatibility',
      description: 'Explore cosmic connections and find your perfect zodiac match.',
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Cosmic background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Your Cosmic Journey Awaits</span>
          </div>

          <h1 
            ref={titleRef}
            className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 leading-tight"
          >
            <span className="text-cosmic">Unlock the Secrets</span>
            <br />
            <span className="text-foreground">of the Stars</span>
          </h1>

          <p 
            ref={subtitleRef}
            className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Discover what the celestial bodies have written for you. Explore your horoscope, 
            understand your zodiac sign, and unlock the mysteries of the cosmos.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/horoscopes" className="btn-cosmic px-8 py-4 rounded-lg inline-flex items-center gap-2">
              Read Your Horoscope
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/zodiac" className="btn-outline-cosmic px-8 py-4 rounded-lg">
              Explore Zodiac Signs
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-primary rounded-full animate-pulse-glow" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-glow text-primary mb-4">
              Explore the Cosmos
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Dive deep into the celestial wisdom with our comprehensive astrology tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="feature-card glass-card-hover rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zodiac Preview Section */}
      <section ref={zodiacRef} className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-glow text-primary mb-4">
              The Twelve Signs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Each zodiac sign holds unique energies and characteristics
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

      {/* Newsletter Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-6xl opacity-10 text-primary">♈</div>
            <div className="absolute bottom-4 right-4 text-6xl opacity-10 text-primary">♓</div>
            
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-6" />
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
              Receive Daily Cosmic Wisdom
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Subscribe to our newsletter and get personalized horoscopes and celestial updates delivered to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
