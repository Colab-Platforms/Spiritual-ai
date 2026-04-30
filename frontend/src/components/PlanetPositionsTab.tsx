interface Planet {
  name: string;
  sign: string;
  degree: number;
  house: number;
}

interface PlanetPositionsTabProps {
  planets: Planet[];
}

export const PlanetPositionsTab: React.FC<PlanetPositionsTabProps> = ({ planets }) => {
  if (!planets || planets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-cosmic-text-muted font-inter">No planet data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-cosmic-orange/20">
              <th className="text-left px-4 py-3 text-cosmic-text font-poppins font-bold">Planet</th>
              <th className="text-left px-4 py-3 text-cosmic-text font-poppins font-bold">Sign</th>
              <th className="text-left px-4 py-3 text-cosmic-text font-poppins font-bold">Degree</th>
              <th className="text-left px-4 py-3 text-cosmic-text font-poppins font-bold">House</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((planet, idx) => (
              <tr
                key={idx}
                className="border-b border-cosmic-orange/10 hover:bg-cosmic-orange/5 transition"
              >
                <td className="px-4 py-4 text-cosmic-text font-inter font-semibold">{planet.name}</td>
                <td className="px-4 py-4 text-cosmic-orange font-inter">{planet.sign}</td>
                <td className="px-4 py-4 text-cosmic-text font-inter">{planet.degree.toFixed(2)}°</td>
                <td className="px-4 py-4 text-cosmic-text font-inter">{planet.house}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Planet Meanings */}
      <div className="mt-8 p-6 bg-cosmic-orange/10 border border-cosmic-orange/20 rounded-lg">
        <h4 className="text-cosmic-text font-poppins font-bold mb-4">Planet Meanings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-inter text-cosmic-text-muted">
          <div>
            <p className="text-cosmic-orange font-semibold mb-1">Sun</p>
            <p>Core identity and life purpose</p>
          </div>
          <div>
            <p className="text-cosmic-orange font-semibold mb-1">Moon</p>
            <p>Emotions and inner world</p>
          </div>
          <div>
            <p className="text-cosmic-orange font-semibold mb-1">Mercury</p>
            <p>Communication and intellect</p>
          </div>
          <div>
            <p className="text-cosmic-orange font-semibold mb-1">Venus</p>
            <p>Love and relationships</p>
          </div>
          <div>
            <p className="text-cosmic-orange font-semibold mb-1">Mars</p>
            <p>Energy and action</p>
          </div>
          <div>
            <p className="text-cosmic-orange font-semibold mb-1">Jupiter</p>
            <p>Expansion and luck</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetPositionsTab;
