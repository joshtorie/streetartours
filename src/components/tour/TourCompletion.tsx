import React from 'react';
import { Share2, Mail, ShoppingBag } from 'lucide-react';
import { Tour, ArtPiece, Merchandise } from '../../types';
import { ShareModal } from './ShareModal';
import { useShareTour } from '../../hooks/useShareTour';
import { createShoppingCartUrl, formatDuration, emailTourSummary } from '../../utils/tourUtils';

interface TourCompletionProps {
  tour: Tour;
  viewedArt: ArtPiece[];
  selectedMerchandise: Merchandise[];
}

export function TourCompletion({ tour, viewedArt, selectedMerchandise }: TourCompletionProps) {
  const { isShareModalOpen, openShareModal, closeShareModal, shareTour } = useShareTour();

  const handleEmailTour = async () => {
    const cartUrl = createShoppingCartUrl(selectedMerchandise);
    await emailTourSummary(tour, viewedArt, cartUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Tour Complete!</h2>
        
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Tour Summary</h3>
            <p className="text-gray-600">Visited {viewedArt.length} art pieces</p>
            <p className="text-gray-600">Duration: {formatDuration(tour.duration)}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleEmailTour}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Mail className="w-5 h-5" />
              <span>Email Summary</span>
            </button>

            <button
              onClick={openShareModal}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Share2 className="w-5 h-5" />
              <span>Share Tour</span>
            </button>
          </div>

          {selectedMerchandise.length > 0 && (
            <a
              href={createShoppingCartUrl(selectedMerchandise)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>View Selected Items</span>
            </a>
          )}
        </div>
      </div>

      {isShareModalOpen && (
        <ShareModal
          tour={tour}
          onClose={closeShareModal}
          onShare={shareTour}
        />
      )}
    </div>
  );
}