import React, { useState, useEffect } from 'react';
import { useRouteGeneration } from '../hooks/useRouteGeneration';
import { supabase } from '../supabaseClient';
import mapboxgl from 'mapbox-gl';

interface Artist {
  id: string;
  name: string;
}

interface RouteGeneratorProps {
  mapInstance: mapboxgl.Map | null;
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    margin: '20px',
    maxWidth: '400px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  select: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '10px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
  },
  error: {
    color: '#dc2626',
    marginTop: '10px',
  },
};

export function RouteGenerator({ mapInstance }: RouteGeneratorProps) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(60);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { generateRoute, loading, error } = useRouteGeneration();

  useEffect(() => {
    // Fetch artists
    const fetchArtists = async () => {
      const { data, error } = await supabase
        .from('Artists')
        .select('id, name');
      
      if (!error && data) {
        setArtists(data);
      }
    };

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    fetchArtists();
  }, []);

  const handleGenerateRoute = async () => {
    if (!mapInstance) return;

    const route = await generateRoute({
      artists: selectedArtists,
      duration: duration,
      startPoint: userLocation || undefined,
    });

    if (route && route.points.length > 0) {
      // Create a GeoJSON feature collection from the route points
      const geojson = {
        type: 'FeatureCollection',
        features: route.points.map(point => ({
          type: 'Feature',
          properties: {
            name: point.name,
            order: point.order,
          },
          geometry: {
            type: 'Point',
            coordinates: [point.coordinates[1], point.coordinates[0]], // Mapbox uses [lng, lat]
          },
        })),
      };

      // Remove existing route layer if it exists
      if (mapInstance.getLayer('route-points')) {
        mapInstance.removeLayer('route-points');
      }
      if (mapInstance.getSource('route-points')) {
        mapInstance.removeSource('route-points');
      }

      // Add new route to map
      mapInstance.addSource('route-points', {
        type: 'geojson',
        data: geojson,
      });

      mapInstance.addLayer({
        id: 'route-points',
        type: 'circle',
        source: 'route-points',
        paint: {
          'circle-radius': 8,
          'circle-color': '#2563eb',
          'circle-stroke-width': 2,
          'circle-stroke-color': 'white',
        },
      });

      // Fit map to show all points
      const bounds = new mapboxgl.LngLatBounds();
      route.points.forEach(point => {
        bounds.extend([point.coordinates[1], point.coordinates[0]]);
      });
      mapInstance.fitBounds(bounds, { padding: 50 });
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={(e) => {
        e.preventDefault();
        handleGenerateRoute();
      }}>
        <select
          multiple
          value={selectedArtists}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, option => option.value);
            setSelectedArtists(values);
          }}
          style={styles.select}
        >
          {artists.map(artist => (
            <option key={artist.id} value={artist.id}>
              {artist.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          min="15"
          max="240"
          step="15"
          placeholder="Duration (minutes)"
          style={styles.input}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? 'Generating...' : 'Generate Route'}
        </button>

        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  );
}
