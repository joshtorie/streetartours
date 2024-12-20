import React from 'react';
import { X, Link, Twitter, Facebook } from 'lucide-react';
import { Tour } from '../../types';

interface ShareModalProps {
  tour: Tour;
  onClose: () => void;
  onShare: (platform: string) => void;
}

export function ShareModal({ tour, onClose, onShare }: ShareModalProps) {
  const shareUrl = `${window.location.origin}/tour/${tour.id}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Share Tour</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => onShare('twitter')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8]"
            >
              <Twitter className="w-5 h-5" />
              <span>Twitter</span>
            </button>

            <button
              onClick={() => onShare('facebook')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#1664d9]"
            >
              <Facebook className="w-5 h-5" />
              <span>Facebook</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="w-full px-4 py-2 pr-20 border rounded-lg bg-gray-50"
            />
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
            >
              <Link className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}