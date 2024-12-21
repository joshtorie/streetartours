import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { TourCard } from '../components/tour/TourCard';
import { supabase } from '../supabaseClient';
import { Tour, TourType, Neighborhood } from '../types';

export function NeighborhoodPage() {
  const { cityId, neighborhoodId } = useParams();
  const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<TourType | 'ALL'>('ALL');
  const [selectedDuration, setSelectedDuration] = useState<string>('ALL');
  const [artPieces, setArtPieces] = useState<any[]>([]);

  useEffect(() => {
    const fetchNeighborhoodAndTours = async () => {
      try {
        // Fetch neighborhood data
        const { data: neighborhoodData, error: neighborhoodError } = await supabase
          .from('Neighborhoods')
          .select('*')
          .eq('id', neighborhoodId)
          .eq('city_id', cityId)
          .single();

        if (neighborhoodError) throw neighborhoodError;
        setNeighborhood(neighborhoodData);

        // Fetch tours for this neighborhood
        const { data: tourData, error: tourError } = await supabase
          .from('Tours')
          .select(`
            *,
            art_pieces:ArtPieces(*)
          `)
          .eq('neighborhood_id', neighborhoodId);

        if (tourError) throw tourError;
        setTours(tourData || []);

        // Fetch art pieces
        const { data: artPiecesData } = await supabase
          .from('ArtPieces')
          .select('*, image, audio_url: art-audio, splat_url: art-splat');

        setArtPieces(artPiecesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNeighborhoodAndTours();
  }, [cityId, neighborhoodId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!neighborhood) {
    return <div>Neighborhood not found</div>;
  }

  const filterTours = (tours: Tour[]) => {
    return tours.filter(tour => {
      const matchesType = selectedFilter === 'ALL' || tour.type === selectedFilter;
      const matchesDuration = selectedDuration === 'ALL' || 
        (selectedDuration === 'SHORT' && tour.duration <= 60) ||
        (selectedDuration === 'MEDIUM' && tour.duration > 60 && tour.duration <= 120) ||
        (selectedDuration === 'LONG' && tour.duration > 120);
      
      return matchesType && matchesDuration;
    });
  };

  const handleTourClick = (tour: Tour) => {
    window.location.href = `/cities/${cityId}/neighborhoods/${neighborhoodId}/tours/${tour.id}`;
  };

  const filteredTours = filterTours(tours);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {neighborhood.name}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {neighborhood.description}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as TourType | 'ALL')}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value="ARTIST">By Artist</option>
              <option value="STYLE">By Style</option>
            </select>

            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Durations</option>
              <option value="SHORT">Short (1 hour or less)</option>
              <option value="MEDIUM">Medium (1-2 hours)</option>
              <option value="LONG">Long (over 2 hours)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              No tours found matching your criteria
            </p>
          ) : (
            filteredTours.map(tour => (
              <TourCard
                key={tour.id}
                tour={tour}
                onClick={() => handleTourClick(tour)}
              />
            ))
          )}
        </div>

        <div className="mt-12">
          {artPieces.map(piece => (
            <div key={piece.id}>
              <img src={piece.image} alt={piece.name} />
              <audio controls>
                <source src={piece.audio_url} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
              <model-viewer src={piece.splat_url} alt={piece.name} auto-rotate camera-controls></model-viewer>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
