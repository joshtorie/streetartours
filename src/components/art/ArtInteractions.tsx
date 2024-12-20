import React from 'react';
import { ArtPiece } from '../../types';
import { Headphones, Cube, Play, ShoppingBag, Star } from 'lucide-react';

interface ArtInteractionsProps {
  art: ArtPiece;
  onPlayAudio: () => void;
  onView3D: () => void;
  onPlayVideo: () => void;
  onViewMerchandise: () => void;
  onRate: () => void;
}

export function ArtInteractions({ art, onPlayAudio, onView3D, onPlayVideo, onViewMerchandise, onRate }: ArtInteractionsProps) {
  return (
    <div className="flex gap-4 mt-4">
      {art.audioGuide && (
        <button
          onClick={onPlayAudio}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Headphones className="w-5 h-5" />
          <span>Audio Guide</span>
        </button>
      )}
      
      {art.modelUrl && (
        <button
          onClick={onView3D}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Cube className="w-5 h-5" />
          <span>View 3D</span>
        </button>
      )}
      
      {art.videoUrl && (
        <button
          onClick={onPlayVideo}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Play className="w-5 h-5" />
          <span>Watch Video</span>
        </button>
      )}
      
      {art.merchandise.length > 0 && (
        <button
          onClick={onViewMerchandise}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Shop</span>
        </button>
      )}
      
      <button
        onClick={onRate}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
      >
        <Star className="w-5 h-5" />
        <span>Rate</span>
      </button>
    </div>
  );
}