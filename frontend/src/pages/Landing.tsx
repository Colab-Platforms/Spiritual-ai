import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero section animations
    if (heroRef.current) {
      const elements = heroRef.current.querySelectorAll('.fade-in');
      gsap.from(elements, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }

    // Features section staggered reveal
    if (featuresRef.current) {
      const cards = featuresRef.current.querySelectorAll('.feature-card');
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: false,
        },
      });
    }

    // Trust section text fade
    if (trustRef.current) {
      const textElement = trustRef.current.querySelector('.trust-text');
      if (textElement) {
        gsap.from(textElement, {
          opacity: 0,
          x: -30,
          duration: 0.8,
          scrollTrigger: {
            trigger: trustRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: false,
          },
        });
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className="w-full bg-cosmic-black overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-cosmic-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-cosmic-orange flex items-center justify-center text-cosmic-black font-bold">C</div>
          <span className="text-cosmic-text font-poppins font-bold text-xl">Chani</span>
        </div>
        <div className="hidden md:flex gap-8 text-cosmic-text-muted font-inter text-sm">
          <a href="#" className="hover:text-cosmic-orange transition">Home</a>
          <a href="#features" className="hover:text-cosmic-orange transition">Features</a>
          <a href="#testimonials" className="hover:text-cosmic-orange transition">Testimonials</a>
        </div>
        <button className="px-6 py-2 bg-cosmic-orange text-cosmic-black font-poppins font-semibold rounded-full hover:bg-cosmic-orange-light transition">
          Download
        </button>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-between px-8 md:px-16 pt-32 pb-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-cosmic-gradient pointer-events-none" />
        
        {/* Left Content */}
        <div className="relative z-10 flex-1 max-w-2xl">
          <div className="fade-in mb-6 inline-block px-4 py-2 bg-cosmic-orange/10 border border-cosmic-orange/30 rounded-full">
            <span className="text-cosmic-orange font-poppins text-sm font-semibold">Mobile App</span>
          </div>

          <h1 className="fade-in text-6xl md:text-7xl font-poppins font-bold text-cosmic-text mb-6 leading-tight">
            Unlock the secrets of the stars and discover your <span className="text-cosmic-orange">cosmic path.</span>
          </h1>

          <p className="fade-in text-cosmic-text-muted font-inter text-lg mb-8 max-w-xl leading-relaxed">
            Discover your cosmic destiny with daily horoscopes, birth charts, and personalized insights. Let the stars guide your journey!
          </p>

          <div className="fade-in flex flex-col md:flex-row gap-4 mb-12">
            <button
              onClick={() => navigate('/kundali')}
              className="px-8 py-4 bg-cosmic-orange text-cosmic-black font-poppins font-bold rounded-full hover:bg-cosmic-orange-light transition transform hover:scale-105"
            >
              Generate My Kundali
            </button>
            <button className="px-8 py-4 border-2 border-cosmic-orange/30 text-cosmic-text font-poppins font-semibold rounded-full hover:border-cosmic-orange hover:bg-cosmic-orange/5 transition">
              Get Started for Free
            </button>
          </div>

          <div className="fade-in flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-cosmic-orange/20 border-2 border-cosmic-dark" />
              ))}
            </div>
            <span className="text-cosmic-text-muted font-inter text-sm">10K+ <span className="text-cosmic-text">users worldwide</span></span>
          </div>
        </div>

        {/* Right - Phone Mockup */}
        <div className="hidden lg:flex flex-1 items-center justify-center relative">
          <div className="relative w-80 h-96">
            {/* Phone frame */}
            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-card to-cosmic-dark rounded-3xl border-8 border-cosmic-card shadow-2xl overflow-hidden">
              {/* Screen content */}
              <div className="w-full h-full bg-cosmic-dark p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-cosmic-text text-xs font-poppins">9:41</span>
                  <div className="flex gap-1 text-cosmic-text text-xs">📶 📡 🔋</div>
                </div>
                
                <div className="flex-1 flex flex-col gap-3">
                  <div className="text-cosmic-text font-poppins font-semibold text-sm">Good Morning ✨</div>
                  
                  {/* Tabs */}
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-cosmic-orange text-cosmic-black text-xs font-semibold rounded-full">Today</button>
                    <button className="px-3 py-1 text-cosmic-text-muted text-xs">This week</button>
                    <button className="px-3 py-1 text-cosmic-text-muted text-xs">This year</button>
                  </div>

                  {/* Chart placeholder */}
                  <div className="flex-1 bg-cosmic-black/50 rounded-2xl border border-cosmic-orange/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">♈</div>
                      <div className="text-cosmic-text-muted text-xs">Your cosmic day</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-2">
                    <div className="flex-1 bg-cosmic-black/50 rounded-lg p-2 text-center">
                      <div className="text-cosmic-orange font-bold text-sm">75%</div>
                      <div className="text-cosmic-text-muted text-xs">Love</div>
                    </div>
                    <div className="flex-1 bg-cosmic-black/50 rounded-lg p-2 text-center">
                      <div className="text-cosmic-orange font-bold text-sm">60%</div>
                      <div className="text-cosmic-text-muted text-xs">Work</div>
                    </div>
                    <div className="flex-1 bg-cosmic-black/50 rounded-lg p-2 text-center">
                      <div className="text-cosmic-orange font-bold text-sm">80%</div>
                      <div className="text-cosmic-text-muted text-xs">Health</div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full py-2 bg-cosmic-orange text-cosmic-black font-semibold text-xs rounded-lg hover:bg-cosmic-orange-light transition">
                    Explore Today
                  </button>

                  {/* Bottom nav */}
                  <div className="flex justify-around pt-2 border-t border-cosmic-orange/10">
                    <button className="p-2 bg-cosmic-orange/20 rounded-lg text-cosmic-orange">🏠</button>
                    <button className="p-2 text-cosmic-text-muted">⚙️</button>
                    <button className="p-2 text-cosmic-text-muted">🕐</button>
                    <button className="p-2 text-cosmic-text-muted">🎧</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-cosmic-orange/10 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section ref={trustRef} className="relative py-24 px-8 md:px-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="trust-text">
            <h2 className="text-5xl font-poppins font-bold text-cosmic-text mb-6">
              Why Astrology <span className="text-cosmic-orange">Matters</span>
            </h2>
            <p className="text-cosmic-text-muted font-inter text-lg mb-6 leading-relaxed">
              For thousands of years, astrology has guided humanity through life's greatest questions. Your birth chart is a cosmic blueprint—a unique map of your soul's journey.
            </p>
            <p className="text-cosmic-text-muted font-inter text-lg leading-relaxed">
              In our modern world, reconnecting with the stars helps us understand ourselves deeper, make better decisions, and navigate life with purpose and clarity.
            </p>
          </div>

          {/* Right - Constellation SVG */}
          <div className="flex items-center justify-center">
            <svg className="w-full max-w-sm" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
              {/* Constellation lines */}
              <g stroke="rgba(255, 106, 0, 0.3)" strokeWidth="1" fill="none">
                <line x1="50" y1="50" x2="150" y2="100" />
                <line x1="150" y1="100" x2="250" y2="80" />
                <line x1="250" y1="80" x2="200" y2="200" />
                <line x1="200" y1="200" x2="100" y2="180" />
                <line x1="100" y1="180" x2="50" y2="50" />
              </g>
              {/* Stars */}
              <g fill="rgba(255, 106, 0, 0.6)">
                <circle cx="50" cy="50" r="3" />
                <circle cx="150" cy="100" r="3" />
                <circle cx="250" cy="80" r="3" />
                <circle cx="200" cy="200" r="3" />
                <circle cx="100" cy="180" r="3" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="relative py-24 px-8 md:px-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-cosmic-orange/10 border border-cosmic-orange/30 rounded-full mb-4">
              <span className="text-cosmic-orange font-poppins text-sm font-semibold">Features</span>
            </div>
            <h2 className="text-5xl font-poppins font-bold text-cosmic-text mb-4">
              Explore Your <span className="text-cosmic-orange">Cosmic Journey</span>
            </h2>
            <p className="text-cosmic-text-muted font-inter max-w-2xl mx-auto">
              Unlock deep insights with our premium astrology tools, designed to reveal your cosmic influences and guide your path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '♈', title: 'Birth Chart', desc: 'Generate your personalized Kundali and discover planetary insights.' },
              { icon: '🌙', title: 'Daily Horoscopes', desc: 'Personalized daily, weekly, and monthly predictions just for you.' },
              { icon: '💕', title: 'Relationship Insights', desc: 'Discover compatibility and relationship guidance through astrology.' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="feature-card group p-8 rounded-2xl bg-cosmic-card/40 backdrop-blur-sm border border-cosmic-orange/20 hover:border-cosmic-orange/50 transition-all duration-300 hover:shadow-cosmic-glow"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-cosmic-text font-poppins font-bold mb-3 group-hover:text-cosmic-orange transition">{item.title}</h3>
                <p className="text-cosmic-text-muted font-inter text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline / How It Works Section */}
      <section className="relative py-24 px-8 md:px-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-cosmic-orange/10 border border-cosmic-orange/30 rounded-full mb-4">
              <span className="text-cosmic-orange font-poppins text-sm font-semibold">How It Works</span>
            </div>
            <h2 className="text-5xl font-poppins font-bold text-cosmic-text mb-4">
              Three Steps to Your <span className="text-cosmic-orange">Cosmic Destiny</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { num: '01', title: 'Enter Your Birth Data', desc: 'Share your date, time, and place of birth to begin your journey.' },
              { num: '02', title: 'Generate Your Kundali', desc: 'Our system calculates your personalized birth chart instantly.' },
              { num: '03', title: 'Explore Your Insights', desc: 'Discover your cosmic blueprint and daily horoscope predictions.' },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cosmic-orange/20 border border-cosmic-orange/50">
                    <span className="text-cosmic-orange font-poppins font-bold text-xl">{step.num}</span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-cosmic-text font-poppins font-bold text-xl mb-2">{step.title}</h3>
                  <p className="text-cosmic-text-muted font-inter">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-24 px-8 md:px-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-cosmic-orange/10 border border-cosmic-orange/30 rounded-full mb-4">
              <span className="text-cosmic-orange font-poppins text-sm font-semibold">Testimonials</span>
            </div>
            <h2 className="text-5xl font-poppins font-bold text-cosmic-text mb-4">
              Trusted by thousands for <span className="text-cosmic-orange">life-changing guidance</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Amanda', rating: 5, text: 'The daily horoscopes and insights have helped me make better decisions in my life.' },
              { name: 'Christopher', rating: 5, text: 'I finally understand myself on a deeper level. The readings feel incredibly accurate!' },
              { name: 'Vill Mnossa', rating: 5, text: 'A must-have for astrology lovers! The predictions always resonate with my life.' },
            ].map((testimonial, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-cosmic-card/40 backdrop-blur-sm border border-cosmic-orange/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-cosmic-orange/20 border border-cosmic-orange/30" />
                  <div>
                    <div className="text-cosmic-text font-poppins font-semibold">{testimonial.name}</div>
                    <div className="text-cosmic-orange text-sm">{'⭐'.repeat(testimonial.rating)}</div>
                  </div>
                </div>
                <p className="text-cosmic-text-muted font-inter text-sm">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="relative py-24 px-8 md:px-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-poppins font-bold text-cosmic-text mb-6">
            Built for the <span className="text-cosmic-orange">Modern Believer</span>
          </h2>
          <p className="text-cosmic-text-muted font-inter text-lg leading-relaxed">
            We believe that ancient wisdom and modern technology can coexist beautifully. Our mission is to make astrology accessible, accurate, and meaningful for everyone seeking guidance in their cosmic journey.
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-8 md:px-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-poppins font-bold text-cosmic-text mb-6">
            Your Kundali is already written. <span className="text-cosmic-orange">Have you read it yet?</span>
          </h2>
          <p className="text-cosmic-text-muted font-inter text-lg mb-8">
            Begin your transformative astrological journey today. Unlock personalized insights and navigate your unique cosmic path.
          </p>
          <button
            onClick={() => navigate('/kundali')}
            className="px-8 py-4 bg-cosmic-orange text-cosmic-black font-poppins font-bold rounded-full hover:bg-cosmic-orange-light transition transform hover:scale-105 shadow-cosmic-glow"
          >
            Generate My Kundali Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-8 md:px-16 text-center text-cosmic-text-muted font-inter text-sm">
        <p>© 2024 Chani. All rights reserved. | Discover your cosmic destiny</p>
      </footer>
    </main>
  );
};

export default Landing;
