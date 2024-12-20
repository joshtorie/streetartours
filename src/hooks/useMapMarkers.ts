import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { ArtLocation } from '../types/map';

export function useMapMarkers() {
  const markers = useRef<mapboxgl.Marker[]>([]);

  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  const addMarkers = (
    map: mapboxgl.Map,
    locations: ArtLocation[],
    onClick: (location: ArtLocation) => void
  ) => {
    locations.forEach(location => {
      const el = document.createElement('div');
      el.className = 'w-8 h-8 bg-blue-600 rounded-full border-2 border-white cursor-pointer';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.coordinates)
        .addTo(map);

      el.addEventListener('click', () => onClick(location));
      markers.current.push(marker);
    });
  };

  return { addMarkers, clearMarkers };
}