import { useState } from 'react';
import { supabase } from '../supabaseClient';

interface ArtPiece {
  id: string;
  name: string;
  artist_id: string;
  coordinates: any;
  style?: string[];
}

interface RouteOptions {
  duration?: number; // in minutes
  artists?: string[]; // array of artist IDs
  styles?: string[]; // array of art styles
  startPoint?: [number, number]; // starting coordinates
}

interface RoutePoint {
  id: string;
  name: string;
  coordinates: [number, number];
  order: number;
}

export function useRouteGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to calculate distance between two points
  const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1[0] * Math.PI) / 180;
    const φ2 = (point2[0] * Math.PI) / 180;
    const Δφ = ((point2[0] - point1[0]) * Math.PI) / 180;
    const Δλ = ((point2[1] - point1[1]) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Helper function to estimate walking time between points in minutes
  const estimateWalkingTime = (distance: number): number => {
    const walkingSpeedMetersPerMinute = 83; // approximately 5km/h
    return distance / walkingSpeedMetersPerMinute;
  };

  // Function to extract coordinates from PostGIS point
  const extractCoordinates = (postgisPoint: string): [number, number] => {
    const match = postgisPoint.match(/POINT\((.*?)\)/);
    if (!match) return [0, 0];
    const [lng, lat] = match[1].split(' ').map(Number);
    return [lat, lng];
  };

  // Main function to generate route
  const generateRoute = async (options: RouteOptions) => {
    setLoading(true);
    setError(null);

    try {
      // Build the query based on options
      let query = supabase
        .from('ArtPieces')
        .select(\`
          id,
          name,
          coordinates,
          artist_id,
          Artists (
            id,
            name
          )
        \`);

      // Apply filters based on options
      if (options.artists && options.artists.length > 0) {
        query = query.in('artist_id', options.artists);
      }

      // Fetch art pieces
      const { data: artPieces, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      if (!artPieces || artPieces.length === 0) {
        throw new Error('No art pieces found matching the criteria');
      }

      // Convert art pieces to route points
      const points: RoutePoint[] = artPieces.map(piece => ({
        id: piece.id,
        name: piece.name,
        coordinates: extractCoordinates(piece.coordinates),
        order: 0,
      }));

      // If we have a start point, use it as the first point
      let currentPoint = options.startPoint || points[0].coordinates;
      let remainingPoints = [...points];
      let orderedPoints: RoutePoint[] = [];
      let totalTime = 0;

      // Generate route using nearest neighbor algorithm
      while (remainingPoints.length > 0 && 
            (!options.duration || totalTime < options.duration)) {
        // Find nearest point
        let nearestIndex = 0;
        let minDistance = Infinity;

        remainingPoints.forEach((point, index) => {
          const distance = calculateDistance(currentPoint, point.coordinates);
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = index;
          }
        });

        // Add walking time to total
        const walkingTime = estimateWalkingTime(minDistance);
        if (options.duration && (totalTime + walkingTime > options.duration)) {
          break;
        }

        // Add point to route
        const nextPoint = remainingPoints[nearestIndex];
        nextPoint.order = orderedPoints.length;
        orderedPoints.push(nextPoint);
        totalTime += walkingTime;

        // Update current point and remove from remaining
        currentPoint = nextPoint.coordinates;
        remainingPoints.splice(nearestIndex, 1);
      }

      return {
        points: orderedPoints,
        estimatedDuration: totalTime,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate route';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateRoute,
    loading,
    error,
  };
}
