import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Header } from '../components/layout/Header';

interface ArtPieceFormData {
  artistName: string;
  artName: string;
  image: File | null;
  latitude: number;
  longitude: number;
  splat: File | null;
  audio: File | null;
}

interface PageContent {
  title: string;
  content: string;
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f9fafb',
  },
  section: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#111827',
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
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    minHeight: '200px',
    fontFamily: 'inherit',
  },
  button: {
    padding: '10px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
  },
  message: {
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '6px',
  },
  successMessage: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#e5e7eb',
    color: '#374151',
  },
  activeTab: {
    backgroundColor: '#2563eb',
    color: 'white',
  },
  coordinatesContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
};

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<'art' | 'content'>('art');
  const [artFormData, setArtFormData] = useState<ArtPieceFormData>({
    artistName: '',
    artName: '',
    image: null,
    latitude: 0,
    longitude: 0,
    splat: null,
    audio: null,
  });
  const [contentFormData, setContentFormData] = useState<PageContent>({
    title: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch existing info page content
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('PageContent')
        .select('title, content')
        .eq('page_name', 'info')
        .single();

      if (!error && data) {
        setContentFormData(data);
      }
    };

    if (activeTab === 'content') {
      fetchContent();
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
      // 1. Upload image to Supabase Storage
      let imageUrl = '';
      if (artFormData.image) {
        const fileExt = artFormData.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: imageData, error: imageError } = await supabase.storage
          .from('art-images')
          .upload(fileName, artFormData.image);

        if (imageError) throw imageError;
        imageUrl = `${supabase.storage.from('art-images').getPublicUrl(fileName).data.publicUrl}`;
      }

      // 2. Check if artist exists, if not create new artist
      const { data: existingArtists, error: artistError } = await supabase
        .from('Artists')
        .select('id')
        .eq('name', artFormData.artistName)
        .limit(1);

      if (artistError) throw artistError;

      let artistId;
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

      // 3. Create art piece
      const { error: artError } = await supabase
        .from('ArtPieces')
        .insert([{
          name: artFormData.artName,
          artist_id: artistId,
          image: imageUrl,
          coordinates: `POINT(${artFormData.longitude} ${artFormData.latitude})`,
          splat: artFormData.splat,
          audio: artFormData.audio,
        }]);

      if (artError) throw artError;

      setMessage('Art piece added successfully!');
      // Reset form
      setArtFormData({
        artistName: '',
        artName: '',
        image: null,
        latitude: 0,
        longitude: 0,
        splat: null,
        audio: null,
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
    setMessage('');

    try {
      const { error } = await supabase
        .from('PageContent')
        .update({
          title: contentFormData.title,
          content: contentFormData.content,
          last_updated: new Date().toISOString(),
        })
        .eq('page_name', 'info');

      if (error) throw error;
      setMessage('Content updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error updating content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      
      <div style={styles.tabs}>
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
          ...(message.includes('Error') ? styles.errorMessage : styles.successMessage),
        }}>
          {message}
        </div>
      )}

      {activeTab === 'art' ? (
        <div style={styles.section}>
          <h2 style={styles.title}>Add New Art Piece</h2>
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>
                Artist Name
                <input
                  type="text"
                  value={artFormData.artistName}
                  onChange={(e) => setArtFormData(prev => ({ ...prev, artistName: e.target.value }))}
                  style={styles.input}
                  required
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
                  required
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
                  required
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
                  required
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
                  required
                />
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
                    onChange={(e) => setArtFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                    style={styles.input}
                    required
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
                    onChange={(e) => setArtFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                    style={styles.input}
                    required
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.button,
                ...(isSubmitting ? styles.buttonDisabled : {}),
              }}
            >
              {isSubmitting ? 'Adding...' : 'Add Art Piece'}
            </button>
          </form>
        </div>
      ) : (
        <div style={styles.section}>
          <h2 style={styles.title}>Edit Info Page</h2>
          <form style={styles.form} onSubmit={handleContentSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>
                Page Title
                <input
                  type="text"
                  value={contentFormData.title}
                  onChange={(e) => setContentFormData(prev => ({ ...prev, title: e.target.value }))}
                  style={styles.input}
                  required
                />
              </label>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Content
                <textarea
                  value={contentFormData.content}
                  onChange={(e) => setContentFormData(prev => ({ ...prev, content: e.target.value }))}
                  style={styles.textarea}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.button,
                ...(isSubmitting ? styles.buttonDisabled : {}),
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
