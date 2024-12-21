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
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
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
    color: '#666',
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  textarea: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%',
    minHeight: '100px',
    resize: 'vertical' as const,
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    ':hover': {
      backgroundColor: '#0056b3',
    },
    ':disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  },
  message: {
    marginTop: '10px',
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
  },
  coordinatesContainer: {
    display: 'flex',
    gap: '15px',
  },
  tabContainer: {
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    backgroundColor: '#f8f9fa',
    cursor: 'pointer',
    marginRight: '10px',
    borderRadius: '4px',
  },
  activeTab: {
    backgroundColor: '#007bff',
    color: 'white',
  },
};

export function AdminPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState<Neighborhood[]>([]);
  const [activeTab, setActiveTab] = useState<'art' | 'content'>('art');
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
      
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'art' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('art')}
        >
          Add Art
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'content' ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab('content')}
        >
          Edit Info Page
        </button>
      </div>

      {message && (
        <div style={{
          ...styles.message,
          ...(message.includes('Error') ? styles.error : {}),
        }}>
          {message}
        </div>
      )}
      {contentMessage && (
        <div style={{
          ...styles.message,
          ...(contentMessage.includes('Error') ? styles.error : {}),
        }}>
          {contentMessage}
        </div>
      )}

      {activeTab === 'art' ? (
        <div style={styles.form}>
          <h2 style={styles.heading}>Add New Art Piece</h2>
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>
                Artist Name
                <input
                  type="text"
                  value={artFormData.artistName}
                  onChange={(e) => setArtFormData(prev => ({ ...prev, artistName: e.target.value }))}
                  style={styles.input}
                />
              </label>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Art Name
                <input
                  type="text"
                  value={artFormData.artName}
                  onChange={(e) => setArtFormData(prev => ({ ...prev, artName: e.target.value }))}
                  style={styles.input}
                />
              </label>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Description
                <textarea
                  value={artFormData.description}
                  onChange={(e) => setArtFormData(prev => ({ ...prev, description: e.target.value }))}
                  style={styles.textarea}
                />
              </label>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.input}
                />
              </label>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                3D Splat
                <input
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleSplatChange}
                  style={styles.input}
                />
              </label>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Audio File
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  style={styles.input}
                />
              </label>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                City
                <select
                  value={artFormData.cityId}
                  onChange={(e) => setArtFormData(prev => ({ ...prev, cityId: e.target.value }))}
                  style={styles.select}
                >
                  <option value="">Select a city</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Neighborhood
                <select
                  value={artFormData.neighborhoodId}
                  onChange={(e) => setArtFormData(prev => ({ ...prev, neighborhoodId: e.target.value }))}
                  style={styles.select}
                >
                  <option value="">Select a neighborhood</option>
                  {filteredNeighborhoods.map(neighborhood => (
                    <option key={neighborhood.id} value={neighborhood.id}>{neighborhood.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div style={styles.coordinatesContainer}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Latitude
                  <input
                    type="number"
                    step="any"
                    value={artFormData.latitude}
                    onChange={(e) => handleCoordinatesChange(e, 'latitude')}
                    style={styles.input}
                  />
                </label>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Longitude
                  <input
                    type="number"
                    step="any"
                    value={artFormData.longitude}
                    onChange={(e) => handleCoordinatesChange(e, 'longitude')}
                    style={styles.input}
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.button,
                ...(isSubmitting ? styles.button[':disabled'] : {}),
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add Art Piece'}
            </button>
          </form>
        </div>
      ) : (
        <div style={styles.form}>
          <h2 style={styles.heading}>Edit Info Page</h2>
          <form style={styles.form} onSubmit={handleContentSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>
                Page Title
                <input
                  type="text"
                  value={pageContent.title}
                  onChange={(e) => setPageContent(prev => ({ ...prev, title: e.target.value }))}
                  style={styles.input}
                />
              </label>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Content
                <textarea
                  value={pageContent.content}
                  onChange={(e) => setPageContent(prev => ({ ...prev, content: e.target.value }))}
                  style={styles.textarea}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.button,
                ...(isSubmitting ? styles.button[':disabled'] : {}),
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
