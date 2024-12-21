import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Header } from '../components/layout/Header';

interface Artist {
  id: string;
  name: string;
}

interface ArtPieceFormData {
  artistName: string;
  artName: string;
  image: File | null;
  latitude: number;
  longitude: number;
}

export function AdminPage() {
  const [formData, setFormData] = useState<ArtPieceFormData>({
    artistName: '',
    artName: '',
    image: null,
    latitude: 0,
    longitude: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // 1. Upload image to Supabase Storage
      let imageUrl = '';
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: imageData, error: imageError } = await supabase.storage
          .from('art-images')
          .upload(fileName, formData.image);

        if (imageError) throw imageError;
        imageUrl = `${supabase.storage.from('art-images').getPublicUrl(fileName).data.publicUrl}`;
      }

      // 2. Check if artist exists, if not create new artist
      const { data: existingArtists, error: artistError } = await supabase
        .from('Artists')
        .select('id')
        .eq('name', formData.artistName)
        .limit(1);

      if (artistError) throw artistError;

      let artistId;
      if (existingArtists && existingArtists.length > 0) {
        artistId = existingArtists[0].id;
      } else {
        const { data: newArtist, error: newArtistError } = await supabase
          .from('Artists')
          .insert([{ name: formData.artistName }])
          .select('id')
          .single();

        if (newArtistError) throw newArtistError;
        artistId = newArtist.id;
      }

      // 3. Create art piece
      const { error: artError } = await supabase
        .from('ArtPieces')
        .insert([{
          name: formData.artName,
          artist_id: artistId,
          image: imageUrl,
          coordinates: `POINT(${formData.longitude} ${formData.latitude})`,
        }]);

      if (artError) throw artError;

      setMessage('Art piece added successfully!');
      // Reset form
      setFormData({
        artistName: '',
        artName: '',
        image: null,
        latitude: 0,
        longitude: 0,
      });
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error adding art piece. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Art Piece</h2>
          
          {message && (
            <div className={`p-4 rounded mb-4 ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="artistName" className="block text-sm font-medium text-gray-700">
                Artist Name
              </label>
              <input
                type="text"
                id="artistName"
                value={formData.artistName}
                onChange={(e) => setFormData(prev => ({ ...prev, artistName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="artName" className="block text-sm font-medium text-gray-700">
                Art Name
              </label>
              <input
                type="text"
                id="artName"
                value={formData.artName}
                onChange={(e) => setFormData(prev => ({ ...prev, artName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isSubmitting ? 'Adding...' : 'Add Art Piece'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
