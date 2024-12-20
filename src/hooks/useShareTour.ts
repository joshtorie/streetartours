import { useState } from 'react';

export function useShareTour() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => setIsShareModalOpen(false);

  const shareTour = async (platform: string) => {
    // Implementation would vary based on platform
    switch (platform) {
      case 'twitter':
        // Share to Twitter
        break;
      case 'facebook':
        // Share to Facebook
        break;
      default:
        break;
    }
  };

  return {
    isShareModalOpen,
    openShareModal,
    closeShareModal,
    shareTour,
  };
}