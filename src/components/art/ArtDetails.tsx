import React from 'react';
import { ArtLocation } from '../../types/map';
import { X } from 'lucide-react';

interface ArtDetailsProps {
  art: ArtLocation;
  onClose: () => void;
}

export function ArtDetails({ art, onClose }: ArtDetailsProps) {
  return (
    <div className="absolute right-4 top-4 w-96 bg-white rounded-lg shadow-lg p-4 z-10">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">{art.title}</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <img
        src={art.image}
        alt={art.title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <p className="text-gray-700 mb-2">{art.description}</p>
      <div className="text-sm text-gray-600">
        <p>Artist: {art.artist}</p>
        {art.year && <p>Year: {art.year}</p>}
      </div>
    </div>
  );
}