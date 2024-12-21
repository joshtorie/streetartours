import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Header } from '../components/layout/Header';

interface City {
  id: string;
  name: string;
}

interface Neighborhood {
  id: string;
  name: string;
  city_id: string;
}

interface ArtPieceFormData {
  artistName: string;
  artName: string;
  description: string;
  image: File | null;
  latitude: number;
  longitude: number;
  splat: File | null;
  audio: File | null;
  cityId: string;
  neighborhoodId: string;
}

interface PageContent {
  title: string;
  content: string;
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  tabContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 10px',
    position: 'relative' as const,
    zIndex: 1,
  },
  tab: {
    padding: '12px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: '#6b7280',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    color: '#3b82f6',
    borderBottom: '2px solid #3b82f6',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#111827',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  field: {
    marginBottom: '15px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    width: '100%',
    transition: 'border-color 0.2s ease',
  },
  textarea: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    width: '100%',
    minHeight: '200px',
    resize: 'vertical' as const,
    transition: 'border-color 0.2s ease',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  message: {
    marginTop: '10px',
    marginBottom: '20px',
    padding: '12px 16px',
    borderRadius: '6px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    fontSize: '14px',
    fontWeight: '500',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  coordinatesContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
};

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'art' | 'content'>('art');
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState<Neighborhood[]>([]);
  const [artFormData, setArtFormData] = useState<ArtPieceFormData>({
    artistName: '',
    artName: '',
    description: '',
    image: null,
    latitude: 0,
    longitude: 0,
    splat: null,
    audio: null,
    cityId: '',
    neighborhoodId: '',
  });
  const [pageContent, setPageContent] = useState<PageContent>({
    title: '',
    content: ''
  });
  const [contentMessage, setContentMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Allow direct access without authentication checks
  }, []);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const { data, error } = await supabase
          .from('PageContent')
          .select('title, content')
          .eq('title', 'About')
          .single();

        if (error) {
          console.error('Error fetching page content:', error);
          return;
        }

        if (data) {
          setPageContent(data);
        }
      } catch (error) {
        console.error('Error in fetchPageContent:', error);
      }
    };

    if (activeTab === 'content') {
      fetchPageContent();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchCitiesAndNeighborhoods = async () => {
      try {
        // Fetch cities
        const { data: citiesData, error: citiesError } = await supabase
          .from('Cities')
          .select('id, name');
        
        if (citiesError) {
          console.error('Error fetching cities:', citiesError);
          throw citiesError;
        }
        console.log('Fetched cities:', citiesData);
        setCities(citiesData || []);

        // Fetch neighborhoods
        const { data: neighborhoodsData, error: neighborhoodsError } = await supabase
          .from('Neighborhoods')
          .select('id, name, city_id');
        
        if (neighborhoodsError) {
          console.error('Error fetching neighborhoods:', neighborhoodsError);
          throw neighborhoodsError;
        }
        console.log('Fetched neighborhoods:', neighborhoodsData);
        setNeighborhoods(neighborhoodsData || []);
      } catch (error) {
        console.error('Error fetching cities and neighborhoods:', error);
      }
    };

    fetchCitiesAndNeighborhoods();
  }, []);

  useEffect(() => {
    if (artFormData.cityId) {
      const filtered = neighborhoods.filter(n => n.city_id === artFormData.cityId);
      setFilteredNeighborhoods(filtered);
      // Reset neighborhood selection if it doesn't belong to the selected city
      if (!filtered.find(n => n.id === artFormData.neighborhoodId)) {
        setArtFormData(prev => ({ ...prev, neighborhoodId: '' }));
      }
    } else {
      setFilteredNeighborhoods([]);
      setArtFormData(prev => ({ ...prev, neighborhoodId: '' }));
    }
  }, [artFormData.cityId, neighborhoods]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArtFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSplatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArtFormData(prev => ({ ...prev, splat: e.target.files![0] }));
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArtFormData(prev => ({ ...prev, audio: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // 1. Upload image to Supabase Storage if provided
      let imageUrl = '';
      if (artFormData.image) {
        const fileExt = artFormData.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: imageData, error: imageError } = await supabase.storage
          .from('art-images')
          .upload(`public/${fileName}`, artFormData.image, {
            cacheControl: '3600',
            upsert: false
          });

        if (imageError) {
          console.error('Image upload error:', imageError);
          throw imageError;
        }
        
        const { data } = supabase.storage
          .from('art-images')
          .getPublicUrl(`public/${fileName}`);
          
        imageUrl = data.publicUrl;
      }

      // 2. Check if artist exists or create new one
      let artistId = null;
      if (artFormData.artistName) {
        const { data: existingArtists, error: artistError } = await supabase
          .from('Artists')
          .select('id')
          .eq('name', artFormData.artistName)
          .limit(1);

        if (artistError) throw artistError;

        if (existingArtists && existingArtists.length > 0) {
          artistId = existingArtists[0].id;
        } else {
          const { data: newArtist, error: newArtistError } = await supabase
            .from('Artists')
            .insert([{ name: artFormData.artistName }])
            .select('id')
            .single();

          if (newArtistError) throw newArtistError;
          artistId = newArtist.id;
        }
      }

      // 3. Upload splat file if provided
      let splatUrl = '';
      if (artFormData.splat) {
        const fileExt = artFormData.splat.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: splatError } = await supabase.storage
          .from('art-splat')
          .upload(`public/${fileName}`, artFormData.splat, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (splatError) throw splatError;
        
        const { data } = supabase.storage
          .from('art-splat')
          .getPublicUrl(`public/${fileName}`);
          
        splatUrl = data.publicUrl;
      }

      // 4. Upload audio file if provided
      let audioUrl = '';
      if (artFormData.audio) {
        const fileExt = artFormData.audio.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: audioError } = await supabase.storage
          .from('art-audio')
          .upload(`public/${fileName}`, artFormData.audio, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (audioError) throw audioError;
        
        const { data } = supabase.storage
          .from('art-audio')
          .getPublicUrl(`public/${fileName}`);
          
        audioUrl = data.publicUrl;
      }

      // 5. Create art piece
      const { error: artError } = await supabase
        .from('ArtPieces')
        .insert([{
          name: artFormData.artName || 'Untitled',
          description: artFormData.description,
          artist_id: artistId,
          city_id: artFormData.cityId || null,
          neighborhood_id: artFormData.neighborhoodId || null,
          image: imageUrl || null,
          coordinates: artFormData.latitude && artFormData.longitude 
            ? `(${artFormData.longitude},${artFormData.latitude})`
            : null,
          splat_url: splatUrl || null,
          audio_url: audioUrl || null,
        }]);

      if (artError) throw artError;
      
      setMessage('Art piece added successfully!');
      // Reset form
      setArtFormData({
        artistName: '',
        artName: '',
        description: '',
        image: null,
        latitude: 0,
        longitude: 0,
        splat: null,
        audio: null,
        cityId: '',
        neighborhoodId: '',
      });
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error adding art piece. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setContentMessage('');

    try {
      // Check if content exists
      const { data: existingContent } = await supabase
        .from('PageContent')
        .select('id')
        .eq('title', pageContent.title)
        .single();

      let error;
      if (existingContent) {
        // Update existing content
        const { error: updateError } = await supabase
          .from('PageContent')
          .update({
            content: pageContent.content,
            updated_at: new Date().toISOString()
          })
          .eq('title', pageContent.title);
        error = updateError;
      } else {
        // Insert new content
        const { error: insertError } = await supabase
          .from('PageContent')
          .insert([{
            title: pageContent.title,
            content: pageContent.content
          }]);
        error = insertError;
      }

      if (error) {
        setContentMessage('Error updating content: ' + error.message);
      } else {
        setContentMessage('Content updated successfully!');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      setContentMessage('Error updating content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to find city and neighborhood based on coordinates
  const findLocationByCoordinates = async (latitude: number, longitude: number) => {
    if (isNaN(latitude) || isNaN(longitude)) return;

    try {
      // Find the nearest city within 5km
      const { data: nearestCity, error: cityError } = await supabase
        .rpc('find_nearest_city', {
          lat: latitude,
          lng: longitude,
          distance_meters: 5000 // 5km radius
        });

      if (cityError) {
        console.error('Error finding nearest city:', cityError);
        return;
      }

      console.log('Nearest city:', nearestCity);

      if (nearestCity && nearestCity.length > 0) {
        const cityId = nearestCity[0].id;
        setArtFormData(prev => ({ ...prev, cityId }));

        // Find the nearest neighborhood
        const { data: nearestNeighborhood, error: neighborhoodError } = await supabase
          .rpc('find_containing_neighborhood', {
            lat: latitude,
            lng: longitude
          });

        if (neighborhoodError) {
          console.error('Error finding neighborhood:', neighborhoodError);
          return;
        }

        console.log('Nearest neighborhood:', nearestNeighborhood);

        if (nearestNeighborhood && nearestNeighborhood.length > 0) {
          setArtFormData(prev => ({ ...prev, neighborhoodId: nearestNeighborhood[0].id }));
        }
      }
    } catch (error) {
      console.error('Error in findLocationByCoordinates:', error);
    }
  };

  // Update coordinates handler to include location finding
  const handleCoordinatesChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'latitude' | 'longitude') => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setArtFormData(prev => ({ ...prev, [field]: value }));

      // If both coordinates are valid numbers, try to find the location
      const otherValue = field === 'latitude' ? artFormData.longitude : artFormData.latitude;
      if (!isNaN(otherValue)) {
        const lat = field === 'latitude' ? value : artFormData.latitude;
        const lng = field === 'longitude' ? value : artFormData.longitude;
        findLocationByCoordinates(lat, lng);
      }
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', display: 'flex', gap: '10px' }}>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'art' ? '#3b82f6' : 'transparent',
            color: activeTab === 'art' ? 'white' : '#333',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('art')}
        >
          Add Art
        </button>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'content' ? '#3b82f6' : 'transparent',
            color: activeTab === 'content' ? 'white' : '#333',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('content')}
        >
          Edit Content
        </button>
      </div>

      {message && (
        <div style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: message.includes('Error') ? '#fee2e2' : '#d1fae5',
          color: message.includes('Error') ? '#991b1b' : '#065f46',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      {activeTab === 'art' ? (
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Add New Art Piece</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Artist Name
                <input
                  type="text"
                  value={artFormData.artistName}
                  onChange={(e) => setArtFormData(prev => ({ ...prev, artistName: e.target.value }))}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Art Name
                <input
                  type="text"
                  value={artFormData.artName}
                  onChange={(e) => setArtFormData(prev => ({ ...prev, artName: e.target.value }))}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Description
                <textarea
                  value={artFormData.description}
                  onChange={(e) => setArtFormData(prev => ({ ...prev, description: e.target.value }))}
                  style={{ 
                    padding: '8px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    minHeight: '200px',
                    resize: 'vertical'
                  }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                City
                <select
                  value={artFormData.cityId}
                  onChange={(e) => setArtFormData(prev => ({ ...prev, cityId: e.target.value }))}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="">Select a city</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Neighborhood
                <select
                  value={artFormData.neighborhoodId}
                  onChange={(e) => setArtFormData(prev => ({ ...prev, neighborhoodId: e.target.value }))}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="">Select a neighborhood</option>
                  {filteredNeighborhoods.map(neighborhood => (
                    <option key={neighborhood.id} value={neighborhood.id}>{neighborhood.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  Latitude
                  <input
                    type="number"
                    step="any"
                    value={artFormData.latitude}
                    onChange={(e) => handleCoordinatesChange(e, 'latitude')}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  Longitude
                  <input
                    type="number"
                    step="any"
                    value={artFormData.longitude}
                    onChange={(e) => handleCoordinatesChange(e, 'longitude')}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Splat File
                <input
                  type="file"
                  accept=".splat"
                  onChange={handleSplatChange}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Audio File
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                backgroundColor: isSubmitting ? '#ccc' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add Art Piece'}
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Edit Content</h2>
          <form onSubmit={handleContentSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Page Title
                <input
                  type="text"
                  value={pageContent.title}
                  onChange={(e) => setPageContent(prev => ({ ...prev, title: e.target.value }))}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                Content
                <textarea
                  value={pageContent.content}
                  onChange={(e) => setPageContent(prev => ({ ...prev, content: e.target.value }))}
                  style={{ 
                    padding: '8px', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px',
                    minHeight: '200px',
                    resize: 'vertical'
                  }}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                backgroundColor: isSubmitting ? '#ccc' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Updating...' : 'Update Content'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
