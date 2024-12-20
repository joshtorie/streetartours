import React from 'react';
import { ArtLocation } from '../../types/map';
import { Navigation } from 'lucide-react';

interface ArtCardProps {
  art: ArtLocation;
  onClick: () => void;
}

export function ArtCard({ art, onClick }: ArtCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
    >
      <img
        src={art.image}
        alt={art.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold">{art.title}</h3>
        <Navigation className="w-5 h-5 text-blue-600" />
      </div>
      <p className="text-gray-600 text-sm mb-2">by {art.artist}</p>
      {art.year && (
        <p className="text-gray-500 text-sm">{art.year}</p>
      )}
    </button>
  );
}