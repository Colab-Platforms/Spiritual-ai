import { IBirthChart } from '../types/kundali';

interface HousesTabProps {
  birthChart: IBirthChart;
}

const HOUSE_MEANINGS: Record<number, string> = {
  1: 'Self, personality, appearance',
  2: 'Finances, possessions, values',
  3: 'Communication, siblings, short journeys',
  4: 'Home, family, roots, foundation',
  5: 'Creativity, romance, children',
  6: 'Health, work, service, daily routines',
  7: 'Partnerships, marriage, relationships',
  8: 'Transformation, shared resources, intimacy',
  9: 'Higher learning, travel, philosophy',
  10: 'Career, public image, authority',
  11: 'Friendships, groups, hopes, wishes',
  12: 'Spirituality, hidden matters, solitude',
};

export const HousesTab: React.FC<HousesTabProps> = ({ birthChart }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {birthChart.houses.map((house, index) => (
          <div
            key={index}
            className="p-4 rounded-lg backdrop-blur-md bg-dark-secondary/40 border border-accent-gold/20"
          >
            <h4 className="font-cinzel text-lg font-bold text-accent-gold mb-2">
              House {house.number}
            </h4>
            <div className="space-y-2">
              <div className="font-inter text-sm text-text-light/80">
                <p>
                  <span className="text-accent-gold font-semibold">Sign:</span> {house.sign}
                </p>
                <p>
                  <span className="text-accent-gold font-semibold">Degree:</span> {house.degree.toFixed(2)}°
                </p>
              </div>
              <p className="font-inter text-xs text-text-light/60 italic">
                {HOUSE_MEANINGS[house.number]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HousesTab;
