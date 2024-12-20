import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CityPage } from './pages/CityPage';
import { MapView } from './components/map/MapView';
import { ArtCard } from './components/art/ArtCard';
import { ArtDetails } from './components/art/ArtDetails';
import { ArtLocation } from './types/map';
import { artLocations } from './data/artLocations';
import { MapIcon } from 'lucide-react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cities/:cityId" element={<CityPage />} />
        <Route
          path="/tour"
          element={
            <TourView
              artLocations={artLocations}
            />
          }
        />
      </Routes>
    </Router>
  );
}

// Separate the current view into its own component
function TourView({ artLocations }: { artLocations: ArtLocation[] }) {
  const [selectedArt, setSelectedArt] = React.useState<ArtLocation | null>(null);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <MapIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Street Art Tours</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="w-96 p-4 overflow-y-auto">
          <div className="grid gap-4">
            {artLocations.map(art => (
              <ArtCard
                key={art.id}
                art={art}
                onClick={() => setSelectedArt(art)}
              />
            ))}
          </div>
        </div>
        
        <div className="flex-1 relative">
          <MapView
            artLocations={artLocations}
            onMarkerClick={setSelectedArt}
          />
          {selectedArt && (
            <ArtDetails
              art={selectedArt}
              onClose={() => setSelectedArt(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;