
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, MapPin, Clock, Shield } from 'lucide-react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

const Homepage = () => {
  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: 'Price Tracking',
      description: 'Monitor price changes across multiple retailers and get alerts when prices drop.'
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: 'Local Availability',
      description: 'Check product availability at nearby stores with real-time inventory updates.'
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Delivery Estimates',
      description: 'Compare delivery times and shipping costs from different retailers.'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Canadian Focused',
      description: 'Designed specifically for Canadian shoppers with local store partnerships.'
    }
  ];

  const categories = [
    { name: 'Hardware Tools', count: '2,400+', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop' },
    { name: 'Clothing', count: '5,600+', image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop' },
    { name: 'Building Materials', count: '1,800+', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop' },
    { name: 'Accessories', count: '3,200+', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find the Best Prices in
              <span className="text-primary block">Canada</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Compare prices across thousands of products from top Canadian retailers. 
              Find better deals, check local availability, and save money on everything you need.
            </p>
          </div>
          
          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
            <SearchBar />
            <div className="mt-6">
              <FilterPanel />
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Power Drill', 'Winter Jacket', 'Lumber', 'Smartphone', 'Work Boots'].map((term) => (
                <Link
                  key={term}
                  to={`/search?q=${term}`}
                  className="px-3 py-1 bg-white text-gray-600 rounded-full text-sm hover:bg-gray-50 transition-colors border"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose PriceTrackr?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to find the best deals across Canada's top retailers, 
              saving you time and money on every purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Explore thousands of products across our most popular categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/search?category=${category.name}`}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Canadians who save money with PriceTrackr
          </p>
          <Link
            to="/search"
            className="inline-flex items-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Comparing Prices
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
