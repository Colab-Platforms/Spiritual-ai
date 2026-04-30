import { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setSelectedZodiac } from '../redux/slices/uiSlice';

interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  dates: string;
}

const zodiacSigns: ZodiacSign[] = [
  { id: 'aries', name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19' },
  { id: 'taurus', name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20' },
  { id: 'gemini', name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20' },
  { id: 'cancer', name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22' },
  { id: 'leo', name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22' },
  { id: 'virgo', name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22' },
  { id: 'libra', name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22' },
  { id: 'scorpio', name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21' },
  { id: 'sagittarius', name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21' },
  { id: 'capricorn', name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19' },
  { id: 'aquarius', name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18' },
  { id: 'pisces', name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20' },
];

const horoscopes: Record<string, string> = {
  aries: 'The stars align in your favor today. Take bold action on your goals and trust your instincts.',
  taurus: 'A day of stability and growth. Focus on what truly matters and nurture your relationships.',
  gemini: 'Communication is your superpower today. Share your ideas and connect with others.',
  cancer: 'Emotional clarity comes your way. Trust your intuition and honor your feelings.',
  leo: 'Your charisma shines bright. This is your moment to lead and inspire others.',
  virgo: 'Attention to detail brings rewards. Organize and refine your plans for success.',
  libra: 'Balance and harmony are within reach. Seek peace in all your endeavors.',
  scorpio: 'Transformation is in the air. Embrace change and trust the process.',
  sagittarius: 'Adventure calls. Expand your horizons and explore new possibilities.',
  capricorn: 'Ambition meets opportunity. Work steadily toward your long-term goals.',
  aquarius: 'Innovation and inspiration flow through you. Think outside the box.',
  pisces: 'Creativity and intuition guide your path. Let your imagination soar.',
};

export const ZodiacStrip: React.FC = () => {
  const [selectedZodiac, setSelectedZodiacLocal] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleZodiacClick = (zodiacId: string) => {
    setSelectedZodiacLocal(zodiacId);
    dispatch(setSelectedZodiac(zodiacId));
  };

  const handleCloseModal = () => {
    setSelectedZodiacLocal(null);
  };

  const selectedSign = zodiacSigns.find((z) => z.id === selectedZodiac);

  return (
    <section className="relative py-20 px-4 md:px-8 bg-dark-primary overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-accent-gold mb-4">
            Daily Horoscope for All Signs
          </h2>
          <p className="font-inter text-text-light/80 text-lg">
            Explore daily predictions for every zodiac sign
          </p>
        </div>

        {/* Zodiac icons - horizontally scrollable */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max px-4">
            {zodiacSigns.map((sign) => (
              <button
                key={sign.id}
                onClick={() => handleZodiacClick(sign.id)}
                className="flex-shrink-0 p-4 rounded-lg backdrop-blur-md bg-dark-secondary/40 border border-accent-gold/20 hover:border-accent-gold/50 transition-all duration-300 group cursor-pointer"
              >
                <div className="text-4xl mb-2">{sign.symbol}</div>
                <div className="font-cinzel text-sm font-bold text-accent-gold">
                  {sign.name}
                </div>
                <div className="font-inter text-xs text-text-light/60">
                  {sign.dates}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horoscope Modal */}
      {selectedZodiac && selectedSign && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-md p-8 rounded-lg backdrop-blur-md bg-dark-secondary/80 border border-accent-gold/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-text-light/60 hover:text-accent-gold transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal content */}
            <div className="text-center">
              <div className="text-6xl mb-4">{selectedSign.symbol}</div>
              <h3 className="font-cinzel text-2xl font-bold text-accent-gold mb-2">
                {selectedSign.name}
              </h3>
              <p className="font-inter text-sm text-text-light/60 mb-6">
                {selectedSign.dates}
              </p>

              {/* Horoscope content */}
              <div className="mb-6 p-4 rounded-lg bg-dark-primary/50 border border-mystic-purple/20">
                <p className="font-inter text-text-light leading-relaxed mb-4">
                  {horoscopes[selectedZodiac]}
                </p>
                <p className="font-inter text-sm text-text-light/60 italic">
                  Your stars change every day. Come back tomorrow.
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="w-full py-2 px-4 rounded-lg bg-accent-gold/20 border border-accent-gold/50 text-accent-gold font-inter font-semibold hover:bg-accent-gold/30 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ZodiacStrip;
