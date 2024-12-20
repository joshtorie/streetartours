import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { SearchBar } from '../components/search/SearchBar';
import { NeighborhoodList } from '../components/NeighborhoodList';
import { cities } from '../data/cities';

export function CityPage() {
  const { cityId } = useParams();
  const city = cities.find(c => c.id === cityId);
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!city) {
    return <div>City not found</div>;
  }

  const filteredNeighborhoods = city.neighborhoods?.filter(
    neighborhood =>
      !searchQuery ||
      neighborhood.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      neighborhood.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
            // Navigate to neighborhood page
            window.location.href = `/cities/${cityId}/neighborhoods/${neighborhood.id}`;
          }}
        />
      </main>
    </div>
  );
}
