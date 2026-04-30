import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDailyHoroscope, fetchWeeklyHoroscope, fetchMonthlyHoroscope, setSelectedSign } from '../redux/slices/horoscopeSlice';
import { RootState, AppDispatch } from '../redux/store';

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ZODIAC_EMOJIS: Record<string, string> = {
  'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
  'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

export const Horoscope: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { daily, weekly, monthly, loading, error, selectedSign } = useSelector(
    (state: RootState) => state.horoscope
  );

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentSign, setCurrentSign] = useState<string>(selectedSign || 'Aries');

  useEffect(() => {
    // Fetch horoscope when sign or tab changes
    if (activeTab === 'daily') {
      dispatch(fetchDailyHoroscope(currentSign));
    } else if (activeTab === 'weekly') {
      dispatch(fetchWeeklyHoroscope(currentSign));
    } else if (activeTab === 'monthly') {
      dispatch(fetchMonthlyHoroscope(currentSign));
    }
  }, [currentSign, activeTab, dispatch]);

  const handleSignChange = (sign: string) => {
    setCurrentSign(sign);
    dispatch(setSelectedSign(sign));
  };

  const getDisplayContent = () => {
    if (activeTab === 'daily') return daily?.horoscope;
    if (activeTab === 'weekly') return weekly?.horoscope;
    if (activeTab === 'monthly') return monthly?.horoscope;
    return null;
  };

  return (
    <main className="min-h-screen bg-cosmic-black pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-poppins font-bold text-cosmic-text mb-4">
            Your <span className="text-cosmic-orange">Cosmic Readings</span>
          </h1>
          <p className="text-cosmic-text-muted font-inter text-lg">
            Discover what the stars have in store for you
          </p>
        </div>

        {/* Zodiac Selector */}
        <div className="mb-12">
          <h2 className="text-cosmic-text font-poppins font-bold text-xl mb-6">Select Your Sign</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {ZODIAC_SIGNS.map((sign) => (
              <button
                key={sign}
                onClick={() => handleSignChange(sign)}
                className={`p-4 rounded-lg font-poppins font-semibold transition transform hover:scale-105 ${
                  currentSign === sign
                    ? 'bg-cosmic-orange text-cosmic-black shadow-cosmic-glow'
                    : 'bg-cosmic-card/40 border border-cosmic-orange/20 text-cosmic-text hover:border-cosmic-orange/50'
                }`}
              >
                <div className="text-2xl mb-1">{ZODIAC_EMOJIS[sign]}</div>
                <div className="text-xs">{sign}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-cosmic-orange/20">
          {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-poppins font-semibold transition capitalize ${
                activeTab === tab
                  ? 'text-cosmic-orange border-b-2 border-cosmic-orange'
                  : 'text-cosmic-text-muted hover:text-cosmic-text'
              }`}
            >
              {tab} Horoscope
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-cosmic-card/40 backdrop-blur-sm border border-cosmic-orange/20 rounded-2xl p-8 md:p-12">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-cosmic-orange border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-cosmic-text-muted font-inter">Loading your horoscope...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-500 font-inter">{error}</p>
            </div>
          ) : getDisplayContent() ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">{ZODIAC_EMOJIS[currentSign]}</div>
                <div>
                  <h3 className="text-3xl font-poppins font-bold text-cosmic-text">{currentSign}</h3>
                  <p className="text-cosmic-text-muted font-inter">
                    {activeTab === 'daily' && 'Today\'s Reading'}
                    {activeTab === 'weekly' && 'This Week\'s Reading'}
                    {activeTab === 'monthly' && 'This Month\'s Reading'}
                  </p>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-cosmic-text font-inter text-lg leading-relaxed whitespace-pre-wrap">
                  {getDisplayContent()}
                </p>
              </div>

              <div className="mt-8 p-6 bg-cosmic-orange/10 border border-cosmic-orange/30 rounded-lg">
                <p className="text-cosmic-text-muted font-inter text-sm">
                  ✨ Remember: Astrology is a guide, not a destiny. Use these insights to reflect on your life and make conscious choices.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-cosmic-text-muted font-inter">No horoscope available at the moment.</p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Daily Updates',
              description: 'Check back daily for fresh cosmic insights tailored to your sign.',
            },
            {
              title: 'Personalized Readings',
              description: 'Generate your birth chart for deeper, more personalized astrological insights.',
            },
            {
              title: 'Cosmic Guidance',
              description: 'Use these readings as a tool for self-reflection and personal growth.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-cosmic-card/40 border border-cosmic-orange/20 rounded-lg hover:border-cosmic-orange/50 transition"
            >
              <h4 className="text-cosmic-text font-poppins font-bold mb-2">{item.title}</h4>
              <p className="text-cosmic-text-muted font-inter text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Horoscope;
