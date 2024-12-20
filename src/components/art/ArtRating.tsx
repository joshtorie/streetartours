import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface ArtRatingProps {
  onSubmit: (rating: number, comment: string) => void;
  onClose: () => void;
}

export function ArtRating({ onSubmit, onClose }: ArtRatingProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Rate this artwork</h3>
      
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => setRating(value)}
            className={`p-1 ${rating >= value ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            <Star className="w-8 h-8 fill-current" />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full p-2 border rounded-lg mb-4"
        rows={3}
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={() => onSubmit(rating, comment)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}