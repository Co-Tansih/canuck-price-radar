import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, MapPin, Clock, Shield, Star, Users, CheckCircle, Bell, Leaf } from 'lucide-react';
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

  const testimonials = [
    {
      name: 'Sarah Thompson',
      location: 'Toronto, ON',
      rating: 5,
      comment: 'PriceTrackr saved me over $200 on my home renovation project. The price comparison feature is incredible!'
    },
    {
      name: 'Mike Rodriguez',
      location: 'Vancouver, BC',
      rating: 5,
      comment: 'Finally found a tool that shows me real Canadian prices and availability. Game changer for my business.'
    },
    {
      name: 'Jennifer Liu',
      location: 'Calgary, AB',
      rating: 5,
      comment: 'Love the local store finder. I can see what\'s in stock before making the trip. So convenient!'
    }
  ];

  const featuredDeals = [
    {
      title: 'DeWalt 20V Drill Kit',
      originalPrice: 189.99,
      salePrice: 149.99,
      savings: 40,
      store: 'Home Depot',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop'
    },
    {
      title: 'Winter Work Jacket',
      originalPrice: 129.99,
      salePrice: 89.99,
      savings: 40,
      store: 'Mark\'s',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=200&fit=crop'
    },
    {
      title: 'Pressure Treated Lumber',
      originalPrice: 24.99,
      salePrice: 19.99,
      savings: 5,
      store: 'Rona',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop'
    }
  ];

  const trendingProducts = [
    'Power Tools', 'Winter Boots', 'Insulation', 'Smart Home Devices', 
    'Work Gloves', 'Paint Supplies', 'Safety Equipment', 'Outdoor Gear'
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: 'Search Products',
      description: 'Enter what you\'re looking for in our search bar or browse by category.'
    },
    {
      step: 2,
      title: 'Compare Prices',
      description: 'View prices from multiple Canadian retailers side by side.'
    },
    {
      step: 3,
      title: 'Check Availability',
      description: 'See which stores have the item in stock near you.'
    },
    {
      step: 4,
      title: 'Save Money',
      description: 'Choose the best deal and save money on your purchase.'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Products Tracked' },
    { number: '100+', label: 'Partner Stores' },
    { number: '$2.5M+', label: 'Total Savings' },
    { number: '25,000+', label: 'Happy Customers' }
  ];

  return (
    <div className="min-h-screen maple-leaf-bg">
      {/* Hero Section with Enhanced Canadian Styling */}
      <section className="hero-gradient py-20 relative overflow-hidden">
        {/* Floating Canadian Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <Leaf className="absolute top-20 left-10 h-12 w-12 text-primary/20 floating-element" />
          <Leaf className="absolute top-40 right-20 h-8 w-8 text-accent/30 floating-element" />
          <Leaf className="absolute bottom-20 left-1/4 h-10 w-10 text-primary/15 floating-element" />
          <Leaf className="absolute top-60 right-1/3 h-6 w-6 text-accent/25 floating-element" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in-up">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">Proudly Canadian</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              Find the Best Prices in
              <span className="text-shimmer block">Canada</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in-up">
              Compare prices across thousands of products from top Canadian retailers. 
              Find better deals, check local availability, and save money on everything you need.
            </p>
          </div>
          
          {/* Enhanced Search Section */}
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="canadian-border-glow rounded-2xl p-6 bg-white/90 backdrop-blur-sm">
              <SearchBar />
              <div className="mt-6">
                <FilterPanel />
              </div>
            </div>
          </div>

          {/* Popular Searches with Canadian styling */}
          <div className="mt-8 text-center animate-fade-in-up">
            <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Power Drill', 'Winter Jacket', 'Lumber', 'Smartphone', 'Work Boots'].map((term) => (
                <Link
                  key={term}
                  to={`/search?q=${term}`}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-600 rounded-full text-sm hover:bg-white hover:shadow-md transition-all border border-primary/20 canadian-button"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Canadian glow effect */}
      <section className="py-16 bg-white border-b canadian-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Deals Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Star className="h-5 w-5 text-primary animate-bounce-gentle" />
              <span className="text-sm font-medium text-primary">Today's Best</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Deals
            </h2>
            <p className="text-lg text-gray-600">
              Hand-picked deals from across Canada's top retailers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDeals.map((deal, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 canadian-border-glow">
                <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-48 object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white px-2 py-1 rounded-full text-sm font-bold">
                    ${deal.savings} OFF
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{deal.title}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">${deal.salePrice}</span>
                      <span className="text-gray-500 line-through ml-2">${deal.originalPrice}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-4 flex items-center">
                    <Leaf className="h-4 w-4 text-primary mr-1" />
                    Available at {deal.store}
                  </div>
                  <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors canadian-button font-semibold">
                    View Deal
                  </button>
                </div>
              </div>
            ))}
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

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground relative overflow-hidden">
        {/* Canadian themed background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <Leaf className="absolute top-10 left-10 h-20 w-20 text-white/10 floating-element" />
          <Leaf className="absolute bottom-20 right-20 h-16 w-16 text-white/10 floating-element" />
          <Leaf className="absolute top-1/2 left-1/4 h-12 w-12 text-white/10 floating-element" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              How PriceTrackr Works
            </h2>
            <p className="text-xl opacity-90">
              Save money in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform canadian-border-glow">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="opacity-90">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-accent/5">
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

      {/* Trending Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trending Now
            </h2>
            <p className="text-lg text-gray-600">
              See what other Canadians are searching for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingProducts.map((product, index) => (
              <Link
                key={index}
                to={`/search?q=${product}`}
                className="group bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg text-center hover:from-primary/10 hover:to-primary/20 transition-all"
              >
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900">{product}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied Canadian shoppers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-bounce-gentle"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/20 rounded-full floating-element"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <Bell className="h-16 w-16 mx-auto mb-6 opacity-90 animate-bounce-gentle" />
            <h2 className="text-3xl font-bold mb-4">
              Never Miss a Deal
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get notified when prices drop on products you're watching
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 canadian-border-glow"
              />
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors canadian-button">
                Subscribe
              </button>
            </div>
            <p className="text-sm mt-4 opacity-75">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-primary/5 via-white to-accent/5 rounded-3xl p-12 canadian-border-glow">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Saving?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of Canadians who save money with PriceTrackr
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors canadian-button"
              >
                Start Comparing Prices
              </Link>
              <Link
                to="/stores"
                className="inline-flex items-center px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors canadian-button"
              >
                Find Local Stores
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
