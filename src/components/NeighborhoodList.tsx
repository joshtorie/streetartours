import React from 'react';
import { Neighborhood } from '../types';
import { Navigation } from 'lucide-react';

interface NeighborhoodListProps {
  neighborhoods: Neighborhood[];
  onSelectNeighborhood: (neighborhood: Neighborhood) => void;
}

export function NeighborhoodList({ neighborhoods, onSelectNeighborhood }: NeighborhoodListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {neighborhoods.map((neighborhood) => (
        <button
          key={neighborhood.id}
          onClick={() => onSelectNeighborhood(neighborhood)}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <img
            src={neighborhood.image}
            alt={neighborhood.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold">{neighborhood.name}</h3>
            </div>
            <p className="text-gray-600">{neighborhood.description}</p>
            <p className="mt-2 text-sm text-blue-600">{neighborhood.tours.length} tours available</p>
          </div>
        </button>
      ))}
    </div>
  );
}