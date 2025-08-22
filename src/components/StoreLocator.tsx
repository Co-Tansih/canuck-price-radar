
import React, { useState } from 'react';
import { Search, MapPin, Clock, Phone, Filter } from 'lucide-react';
import StoreMap from './StoreMap';

const StoreLocator = () => {
  const [postalCode, setPostalCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stores, setStores] = useState([]);
  const [searchRadius, setSearchRadius] = useState(10);

  const categories = [
    'All Categories',
    'Hardware Stores',
    'Clothing Retailers',
    'Electronics',
    'Home & Garden',
    'Building Supplies'
  ];

  const handleSearch = () => {
    // Simulate store search based on postal code
    console.log('Searching stores near:', postalCode);
    // In a real app, this would make an API call
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Store Locator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find participating retailers near you. Check product availability, store hours, and get directions.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g., M5V 3A8"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Search Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Radius
              </label>
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Type
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search Stores</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Nearby Stores
            </h2>
            <p className="text-gray-600 mt-1">
              {stores.length} stores found within {searchRadius}km
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>Sort by Distance</option>
              <option>Sort by Price</option>
              <option>Sort by Rating</option>
            </select>
          </div>
        </div>

        {/* Store Map and List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <StoreMap stores={stores} />
        </div>

        {/* Featured Retailers */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Retailers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Home Depot', 'Canadian Tire', 'Best Buy', 'Costco', 'Walmart', 'Loblaws'].map((retailer) => (
              <div key={retailer} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">{retailer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
