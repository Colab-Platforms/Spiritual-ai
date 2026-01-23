import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MapPin, Clock, Calendar, Sparkles } from 'lucide-react';
import { zodiacSigns } from '@/data/zodiacData';

const BirthChart = () => {
  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });
  const [chartGenerated, setChartGenerated] = useState(false);
  const [chartData, setChartData] = useState<{
    sunSign: string;
    moonSign: string;
    risingSign: string;
    planets: { name: string; sign: string; house: number }[];
  } | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo('.page-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    gsap.fromTo('.form-section', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.3 });
  }, []);

  useEffect(() => {
    if (chartGenerated && chartRef.current) {
      gsap.fromTo(chartRef.current, { opacity: 0, scale: 0.9, rotation: -10 }, { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.5)' });
      gsap.fromTo('.planet-position', { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, delay: 0.5 });
    }
  }, [chartGenerated]);

  const generateChart = () => {
    // Simulate chart generation based on birth date
    const date = new Date(formData.birthDate);
    const month = date.getMonth();
    
    // Determine sun sign based on birth date
    const getSunSign = (month: number, day: number) => {
      const signs = [
        { name: 'Capricorn', start: [12, 22], end: [1, 19] },
        { name: 'Aquarius', start: [1, 20], end: [2, 18] },
        { name: 'Pisces', start: [2, 19], end: [3, 20] },
        { name: 'Aries', start: [3, 21], end: [4, 19] },
        { name: 'Taurus', start: [4, 20], end: [5, 20] },
        { name: 'Gemini', start: [5, 21], end: [6, 20] },
        { name: 'Cancer', start: [6, 21], end: [7, 22] },
        { name: 'Leo', start: [7, 23], end: [8, 22] },
        { name: 'Virgo', start: [8, 23], end: [9, 22] },
        { name: 'Libra', start: [9, 23], end: [10, 22] },
        { name: 'Scorpio', start: [10, 23], end: [11, 21] },
        { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
      ];
      
      for (const sign of signs) {
        if (
          (month + 1 === sign.start[0] && day >= sign.start[1]) ||
          (month + 1 === sign.end[0] && day <= sign.end[1])
        ) {
          return sign.name;
        }
      }
      return 'Capricorn';
    };

    const day = date.getDate();
    const sunSign = getSunSign(month, day);
    
    // Generate pseudo-random but consistent moon and rising based on birth data
    const moonIndex = (month + day) % 12;
    const risingIndex = formData.birthTime ? (parseInt(formData.birthTime.split(':')[0]) + day) % 12 : (day + 3) % 12;

    const planets = [
      { name: 'Mercury', sign: zodiacSigns[(month + 1) % 12].name, house: (day % 12) + 1 },
      { name: 'Venus', sign: zodiacSigns[(month + 2) % 12].name, house: ((day + 2) % 12) + 1 },
      { name: 'Mars', sign: zodiacSigns[(month + 3) % 12].name, house: ((day + 4) % 12) + 1 },
      { name: 'Jupiter', sign: zodiacSigns[(month + 5) % 12].name, house: ((day + 6) % 12) + 1 },
      { name: 'Saturn', sign: zodiacSigns[(month + 7) % 12].name, house: ((day + 8) % 12) + 1 },
    ];

    setChartData({
      sunSign,
      moonSign: zodiacSigns[moonIndex].name,
      risingSign: zodiacSigns[risingIndex].name,
      planets,
    });
    setChartGenerated(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.birthDate) {
      generateChart();
    }
  };

  const getSignSymbol = (name: string) => {
    return zodiacSigns.find(s => s.name === name)?.symbol || '✦';
  };

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="page-title font-display text-4xl md:text-5xl lg:text-6xl text-glow text-primary mb-4">
            Birth Chart Generator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your birth details to generate your unique celestial blueprint
          </p>
        </div>

        {/* Form */}
        <div className="form-section max-w-xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                Birth Date
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full input-cosmic px-4 py-3 rounded-lg text-foreground"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                Birth Time (optional)
              </label>
              <input
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                className="w-full input-cosmic px-4 py-3 rounded-lg text-foreground"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                Birth Place (optional)
              </label>
              <input
                type="text"
                value={formData.birthPlace}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                placeholder="City, Country"
                className="w-full input-cosmic px-4 py-3 rounded-lg text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <button type="submit" className="w-full btn-cosmic py-4 rounded-xl">
              Generate Birth Chart
            </button>
          </form>
        </div>

        {/* Chart Result */}
        {chartGenerated && chartData && (
          <div ref={chartRef} className="max-w-4xl mx-auto">
            {/* Chart Wheel Visual */}
            <div className="glass-card rounded-3xl p-8 md:p-12 mb-8">
              <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
                {/* Middle ring */}
                <div className="absolute inset-8 rounded-full border border-primary/20" />
                {/* Inner ring */}
                <div className="absolute inset-16 rounded-full border border-primary/10 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Your Chart</p>
                  </div>
                </div>
                
                {/* Zodiac symbols around the wheel */}
                {zodiacSigns.map((sign, index) => {
                  const angle = (index * 30 - 90) * (Math.PI / 180);
                  const radius = 120;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <div
                      key={sign.name}
                      className="absolute text-lg opacity-60 hover:opacity-100 transition-opacity"
                      style={{
                        left: `calc(50% + ${x}px - 12px)`,
                        top: `calc(50% + ${y}px - 12px)`,
                      }}
                      title={sign.name}
                    >
                      {sign.symbol}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Big Three */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Sun Sign', value: chartData.sunSign, description: 'Your core identity and ego' },
                { label: 'Moon Sign', value: chartData.moonSign, description: 'Your emotional inner self' },
                { label: 'Rising Sign', value: chartData.risingSign, description: 'How others perceive you' },
              ].map((item) => (
                <div key={item.label} className="glass-card rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-3">{getSignSymbol(item.value)}</div>
                  <h3 className="font-display text-xl text-foreground mb-1">{item.value}</h3>
                  <p className="text-sm text-primary mb-2">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Planetary Positions */}
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <h3 className="font-display text-xl text-primary mb-6 text-center">Planetary Positions</h3>
              <div className="space-y-4">
                {chartData.planets.map((planet) => (
                  <div key={planet.name} className="planet-position flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getSignSymbol(planet.sign)}</span>
                      <div>
                        <p className="font-display text-foreground">{planet.name}</p>
                        <p className="text-sm text-muted-foreground">in {planet.sign}</p>
                      </div>
                    </div>
                    <span className="text-sm text-primary">House {planet.house}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthChart;
