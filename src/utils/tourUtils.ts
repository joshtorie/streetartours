import { Tour, ArtPiece, Merchandise } from '../types';

export function createShoppingCartUrl(merchandise: Merchandise[]): string {
  const items = merchandise.map(item => item.id).join(',');
  return `https://www.wagmistuff.com/cart?items=${items}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} minutes`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

export async function emailTourSummary(
  tour: Tour,
  viewedArt: ArtPiece[],
  cartUrl: string
): Promise<void> {
  // Email service implementation would go here
  // This would typically call your backend API
}