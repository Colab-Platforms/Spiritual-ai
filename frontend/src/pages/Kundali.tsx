import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchKundali } from '../redux/slices/kundaliSlice';
import { RootState, AppDispatch } from '../redux/store';
import BirthChart from '../components/BirthChart';
import PlanetPositionsTab from '../components/PlanetPositionsTab';
import HousesTab from '../components/HousesTab';
import { useState } from 'react';

export const Kundali: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: kundali, loading, error } = useSelector((state: RootState) => state.kundali);
  const [activeTab, setActiveTab] = useState<'chart' | 'planets' | 'houses'>('chart');

  useEffect(() => {
    // Fetch Kundali on component mount
    dispatch(fetchKundali());
  }, [dispatch]);

  if (loading) {
    return (
      <main className="min-h-screen bg-cosmic-black flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-cosmic-orange border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-cosmic-text-muted font-inter">Loading your Kundali...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-cosmic-black pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <p className="text-red-500 font-inter mb-4">{error}</p>
            <p className="text-cosmic-text-muted font-inter">
              Please generate your Kundali first by entering your birth data on the landing page.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!kundali) {
    return (
      <main className="min-h-screen bg-cosmic-black pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="p-8 bg-cosmic-card/40 border border-cosmic-orange/20 rounded-lg text-center">
            <p className="text-cosmic-text font-poppins font-bold mb-4">No Kundali Found</p>
            <p className="text-cosmic-text-muted font-inter">
              Generate your Kundali by entering your birth data on the landing page.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const birthChart = kundali.birthChart;

  return (
    <main className="min-h-screen bg-cosmic-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-poppins font-bold text-cosmic-text mb-4">
            Your <span className="text-cosmic-orange">Birth Chart</span>
          </h1>
          <p className="text-cosmic-text-muted font-inter text-lg">
            Discover your cosmic blueprint and astrological profile
          </p>
        </div>

        {/* Birth Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-cosmic-card/40 border border-cosmic-orange/20 rounded-lg">
            <p className="text-cosmic-text-muted font-inter text-sm mb-2">Zodiac Sign</p>
            <p className="text-2xl font-poppins font-bold text-cosmic-orange">{birthChart.zodiacSign}</p>
          </div>
          <div className="p-6 bg-cosmic-card/40 border border-cosmic-orange/20 rounded-lg">
            <p className="text-cosmic-text-muted font-inter text-sm mb-2">Ascendant (Lagna)</p>
            <p className="text-2xl font-poppins font-bold text-cosmic-orange">{birthChart.ascendant}</p>
          </div>
          <div className="p-6 bg-cosmic-card/40 border border-cosmic-orange/20 rounded-lg">
            <p className="text-cosmic-text-muted font-inter text-sm mb-2">Moon Sign</p>
            <p className="text-2xl font-poppins font-bold text-cosmic-orange">{birthChart.moonSign}</p>
          </div>
        </div>

        {/* Yogas Section */}
        {birthChart.yogas && birthChart.yogas.length > 0 && (
          <div className="mb-12 p-8 bg-cosmic-card/40 border border-cosmic-orange/20 rounded-lg">
            <h2 className="text-2xl font-poppins font-bold text-cosmic-text mb-6">Your Yogas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {birthChart.yogas.map((yoga: string, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-cosmic-orange/10 border border-cosmic-orange/30 rounded-lg"
                >
                  <p className="text-cosmic-text font-inter">{yoga}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-cosmic-orange/20 overflow-x-auto">
          {(['chart', 'planets', 'houses'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-poppins font-semibold transition capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'text-cosmic-orange border-b-2 border-cosmic-orange'
                  : 'text-cosmic-text-muted hover:text-cosmic-text'
              }`}
            >
              {tab === 'chart' && 'Birth Chart'}
              {tab === 'planets' && 'Planets'}
              {tab === 'houses' && 'Houses'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-cosmic-card/40 backdrop-blur-sm border border-cosmic-orange/20 rounded-2xl p-8 md:p-12">
          {activeTab === 'chart' && <BirthChart birthChart={birthChart} />}
          {activeTab === 'planets' && <PlanetPositionsTab planets={birthChart.planets} />}
          {activeTab === 'houses' && <HousesTab birthChart={birthChart} />}
        </div>

        {/* Birth Data Info */}
        <div className="mt-12 p-8 bg-cosmic-card/40 border border-cosmic-orange/20 rounded-lg">
          <h3 className="text-xl font-poppins font-bold text-cosmic-text mb-4">Birth Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-cosmic-text-muted font-inter">
            <div>
              <p className="text-sm mb-1">Date of Birth</p>
              <p className="text-cosmic-text">{kundali.birthChart.placeOfBirth}</p>
            </div>
            <div>
              <p className="text-sm mb-1">Location</p>
              <p className="text-cosmic-text">
                {kundali.birthChart.latitude.toFixed(4)}°, {kundali.birthChart.longitude.toFixed(4)}°
              </p>
            </div>
            <div>
              <p className="text-sm mb-1">Timezone</p>
              <p className="text-cosmic-text">UTC +{kundali.birthChart.timezone}</p>
            </div>
            <div>
              <p className="text-sm mb-1">Generated</p>
              <p className="text-cosmic-text">{new Date(kundali.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-6 bg-cosmic-orange/10 border border-cosmic-orange/30 rounded-lg text-center">
          <p className="text-cosmic-text-muted font-inter text-sm">
            ✨ Your birth chart is a unique cosmic blueprint. Use these insights for self-reflection and personal growth.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Kundali;
