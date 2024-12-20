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
  city: string;
  neighborhood: string;
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
  const [activeTab, setActiveTab] = useState<'art' | 'content' | null>(null);
  const [artFormData, setArtFormData] = useState<ArtPieceFormData>({
    artistName: '',
    artName: '',
    description: '',
    image: null,
    latitude: 0,
    longitude: 0,
    splat: null,
    audio: null,
    city: '',
    neighborhood: ''
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
          city: artFormData.city,
          neighborhood: artFormData.neighborhood,
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
        city: '',
        neighborhood: ''
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

  const validateCoordinates = async () => {
    if (!artFormData.latitude || !artFormData.longitude) {
      setMessage('Please enter both latitude and longitude');
      return;
    }

    try {
      // Use OpenStreetMap Nominatim API to get location details
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${artFormData.latitude}&lon=${artFormData.longitude}&format=json&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en', // Get results in English
            'User-Agent': 'StreetArtTours/1.0' // Identify our application
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data = await response.json();
      console.log('Location data:', data);

      // Extract city and neighborhood from the response
      const address = data.address;
      const city = address.city || address.town || address.municipality || 'Tel Aviv';
      const neighborhood = address.suburb || address.neighbourhood || address.residential || 'Unknown';

      // Update form data with the location information
      setArtFormData(prev => ({
        ...prev,
        city,
        neighborhood
      }));

      setMessage(`Location validated! City: ${city}, Neighborhood: ${neighborhood}`);
    } catch (error) {
      console.error('Error validating coordinates:', error);
      setMessage('Error validating coordinates. Please try again.');
    }
  };

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

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <Header />
      
      {!activeTab ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginTop: '40px'
        }}>
          <div 
            onClick={() => setActiveTab('content')}
            style={{
              padding: '20px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid #e5e7eb'
            }}
          >
            <h3 style={{ margin: 0, marginBottom: '8px' }}>Add About Us Content</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Edit the content that appears on the About Us page
            </p>
          </div>

          <div 
            onClick={() => setActiveTab('art')}
            style={{
              padding: '20px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid #e5e7eb'
            }}
          >
            <h3 style={{ margin: 0, marginBottom: '8px' }}>Add New Art Piece</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Add a new street art piece to the map
            </p>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '40px' }}>
          <button
            onClick={() => setActiveTab(null)}
            style={{
              marginBottom: '20px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Back to Admin Menu
          </button>

          {activeTab === 'art' ? (
            <div>
              <h2 style={{ marginBottom: '20px' }}>Add New Art Piece</h2>
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

                <div style={{ marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={validateCoordinates}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    Validate Location
                  </button>
                  {message && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px',
                      borderRadius: '4px',
                      backgroundColor: message.includes('successfully') ? '#d1fae5' : '#fee2e2',
                      color: message.includes('successfully') ? '#065f46' : '#991b1b'
                    }}>
                      {message}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    City
                    <input
                      type="text"
                      value={artFormData.city}
                      onChange={(e) => setArtFormData(prev => ({ ...prev, city: e.target.value }))}
                      style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </label>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    Neighborhood
                    <input
                      type="text"
                      value={artFormData.neighborhood}
                      onChange={(e) => setArtFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                      style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                  </label>
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
              <h2 style={{ marginBottom: '20px' }}>Edit About Us Content</h2>
              <form onSubmit={handleContentSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>
                    Content
                    <textarea
                      value={pageContent.content}
                      onChange={(e) => setPageContent(prev => ({ ...prev, content: e.target.value }))}
                      style={{ 
                        width: '100%',
                        minHeight: '200px',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        marginTop: '8px'
                      }}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Content'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
