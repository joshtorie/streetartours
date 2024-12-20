import React from 'react';
import { Clock, Route } from 'lucide-react';
import { Tour } from '../../types';

interface TourCardProps {
  tour: Tour;
  onClick: (tour: Tour) => void;
}

export function TourCard({ tour, onClick }: TourCardProps) {
  return (
    <button
      onClick={() => onClick(tour)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-full"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={tour.artPieces[0]?.image || 'default-tour-image.jpg'}
          alt={tour.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{tour.name}</h3>
        <p className="text-gray-600 mb-4">{tour.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{tour.duration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Route className="w-4 h-4" />
            <span>{tour.distance} km</span>
          </div>
        </div>
      </div>
    </button>
  );
}
