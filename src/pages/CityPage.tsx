import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { SearchBar } from '../components/search/SearchBar';
import { NeighborhoodList } from '../components/NeighborhoodList';
import { supabase } from '../supabaseClient';
import { City, Neighborhood } from '../types';

export function CityPage() {
  const { cityId } = useParams();
  const [city, setCity] = useState<City | null>(null);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCityAndNeighborhoods = async () => {
      try {
        // Fetch city data
        const { data: cityData, error: cityError } = await supabase
          .from('Cities')
          .select('*')
          .eq('id', cityId)
          .single();

        if (cityError) throw cityError;
        setCity(cityData);

        // Fetch neighborhoods for this city
        const { data: neighborhoodData, error: neighborhoodError } = await supabase
          .from('Neighborhoods')
          .select('*')
          .eq('city_id', cityId);

        if (neighborhoodError) throw neighborhoodError;
        setNeighborhoods(neighborhoodData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCityAndNeighborhoods();
  }, [cityId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!city) {
    return <div>City not found</div>;
  }

  const filteredNeighborhoods = neighborhoods.filter(
    neighborhood =>
      !searchQuery ||
      neighborhood.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      neighborhood.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pt-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {city.name}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {city.description}
          </p>
          <SearchBar
            placeholder="Search neighborhoods..."
            onSearch={handleSearch}
          />
        </div>

        <NeighborhoodList
          neighborhoods={filteredNeighborhoods}
          onSelectNeighborhood={(neighborhood) => {
            window.location.href = `/cities/${cityId}/neighborhoods/${neighborhood.id}`;
          }}
        />
      </main>
    </div>
  );
}
