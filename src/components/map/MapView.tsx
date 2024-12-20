import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ArtLocation } from '../../types/map';
import { useMapMarkers } from '../../hooks/useMapMarkers';

interface MapViewProps {
  artLocations: ArtLocation[];
  onMarkerClick: (location: ArtLocation) => void;
}

export function MapView({ artLocations, onMarkerClick }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { addMarkers, clearMarkers } = useMapMarkers();

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-74.0060, 40.7128],
      zoom: 12
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    clearMarkers();
    addMarkers(map.current, artLocations, onMarkerClick);
  }, [artLocations, onMarkerClick]);

  return (
    <div ref={mapContainer} className="w-full h-[calc(100vh-4rem)]" />
  );
}