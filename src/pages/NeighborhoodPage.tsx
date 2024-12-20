import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { TourCard } from '../components/tour/TourCard';
import { cities } from '../data/cities';
import { Tour, TourType } from '../types';

export function NeighborhoodPage() {
  const { cityId, neighborhoodId } = useParams();
  const [selectedFilter, setSelectedFilter] = useState<TourType | 'ALL'>('ALL');
  const [selectedDuration, setSelectedDuration] = useState<string>('ALL');

  const city = cities.find(c => c.id === cityId);
  const neighborhood = city?.neighborhoods.find(n => n.id === neighborhoodId);

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
    // Navigate to tour page
    window.location.href = `/cities/${cityId}/neighborhoods/${neighborhoodId}/tours/${tour.id}`;
  };

  const filteredTours = filterTours(neighborhood.tours);

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
                onClick={handleTourClick}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
