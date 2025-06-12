import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, MapPin, Clock, Shield, Star, Users, CheckCircle, Bell, Leaf, Sparkles, Zap, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

const Homepage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState({
    features: false,
    deals: false,
    testimonials: false
  });

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: 'Price Tracking',
      description: 'Monitor price changes across multiple retailers and get alerts when prices drop.',
      details: 'Set up custom price alerts, track historical pricing data, and never miss a deal again.'
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: 'Local Availability',
      description: 'Check product availability at nearby stores with real-time inventory updates.',
      details: 'Real-time inventory tracking across 100+ Canadian retailers with store locator integration.'
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: 'Delivery Estimates',
      description: 'Compare delivery times and shipping costs from different retailers.',
      details: 'Get accurate delivery estimates, compare shipping options, and choose the fastest route.'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Canadian Focused',
      description: 'Designed specifically for Canadian shoppers with local store partnerships.',
      details: 'Built for Canadians, by Canadians. Supporting local businesses and Canadian retailers.'
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
      comment: 'PriceTrackr saved me over $200 on my home renovation project. The price comparison feature is incredible!',
      details: 'I was shopping for power tools and found the same drill for 40% less at a local store. The real-time inventory feature saved me a trip!'
    },
    {
      name: 'Mike Rodriguez',
      location: 'Vancouver, BC',
      rating: 5,
      comment: 'Finally found a tool that shows me real Canadian prices and availability. Game changer for my business.',
      details: 'As a contractor, I need reliable suppliers. PriceTrackr helps me find the best deals and check stock levels instantly.'
    },
    {
      name: 'Jennifer Liu',
      location: 'Calgary, AB',
      rating: 5,
      comment: 'Love the local store finder. I can see what\'s in stock before making the trip. So convenient!',
      details: 'The mobile app is fantastic. I can check prices while shopping and make sure I\'m getting the best deal.'
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
      description: 'Enter what you\'re looking for in our search bar or browse by category.',
      details: 'Use our smart search with filters, categories, and predictive suggestions.'
    },
    {
      step: 2,
      title: 'Compare Prices',
      description: 'View prices from multiple Canadian retailers side by side.',
      details: 'See real-time pricing, historical data, and price trend analysis.'
    },
    {
      step: 3,
      title: 'Check Availability',
      description: 'See which stores have the item in stock near you.',
      details: 'Real-time inventory with store locations and contact information.'
    },
    {
      step: 4,
      title: 'Save Money',
      description: 'Choose the best deal and save money on your purchase.',
      details: 'Set price alerts, compare shipping, and track your savings.'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Products Tracked' },
    { number: '100+', label: 'Partner Stores' },
    { number: '$2.5M+', label: 'Total Savings' },
    { number: '25,000+', label: 'Happy Customers' }
  ];

  return (
    <div className="min-h-screen maple-leaf-bg relative overflow-hidden">
      {/* Particle System */}
      <div className="particles fixed inset-0 z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Parallax Background Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="shape-blob absolute top-20 left-10 w-64 h-64 opacity-30"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="shape-organic absolute bottom-20 right-20 w-96 h-96 opacity-20"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        />
        <div 
          className="shape-blob absolute top-1/2 left-1/2 w-80 h-80 opacity-10 transform -translate-x-1/2 -translate-y-1/2"
          style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.05}px)` }}
        />
      </div>

      {/* Hero Section with Parallax */}
      <section className="hero-gradient py-20 relative overflow-hidden z-10">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <Leaf className="absolute top-20 left-10 h-12 w-12 text-primary/30 floating-element" />
          <Heart className="absolute top-40 right-20 h-8 w-8 text-accent/40 floating-element" />
          <Sparkles className="absolute bottom-20 left-1/4 h-10 w-10 text-primary/25 floating-element" />
          <Zap className="absolute top-60 right-1/3 h-6 w-6 text-accent/35 floating-element" />
          <Leaf className="absolute bottom-40 right-10 h-14 w-14 text-primary/20 floating-element animate-morph" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            className={`text-center mb-12 transition-all duration-1000 ${
              visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            id="hero"
            data-animate
          >
            <div className="inline-flex items-center gap-2 glass-canadian backdrop-blur-sm px-6 py-3 rounded-full mb-6 animate-stagger hover-lift">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">Proudly Canadian</span>
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-stagger-delay-1">
              Find the Best Prices in
              <span className="gradient-text block">Canada</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-stagger-delay-2">
              Compare prices across thousands of products from top Canadian retailers. 
              Find better deals, check local availability, and save money on everything you need.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto animate-stagger-delay-3">
            <div className="glass-intense rounded-3xl p-8 hover-lift">
              <SearchBar />
              <div className="mt-6">
                <FilterPanel />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center animate-stagger-delay-3">
            <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Power Drill', 'Winter Jacket', 'Lumber', 'Smartphone', 'Work Boots'].map((term, index) => (
                <Link
                  key={term}
                  to={`/search?q=${term}`}
                  className={`clay-card px-6 py-3 text-gray-600 text-sm hover-lift transition-all animate-stagger-delay-${index + 1}`}
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section 
        className={`py-16 bg-gradient-to-r from-gray-100 via-white to-gray-100 border-b relative z-10 transition-all duration-1000 ${
          visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        id="stats"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`neomorphism-canadian p-6 hover-lift animate-stagger-delay-${index + 1}`}>
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progressive Disclosure - Featured Deals - SOFTENED WITH GRADIENT */}
      <section 
        className={`py-20 bg-gradient-to-br from-orange-500 via-primary to-red-600 text-primary-foreground relative z-10 transition-all duration-1000 ${
          visibleSections.has('deals') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        id="deals"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-4 hover-lift">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-white">Today's Best</span>
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 className="text-3xl font-bold text-white">Featured Deals</h2>
              <button
                onClick={() => toggleSection('deals')}
                className="p-2 rounded-full glass-card hover-lift transition-all"
              >
                {expandedSections.deals ? 
                  <ChevronUp className="h-5 w-5 text-white" /> : 
                  <ChevronDown className="h-5 w-5 text-white" />
                }
              </button>
            </div>
            <p className="text-lg text-white/90">
              Hand-picked deals from across Canada's top retailers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDeals.map((deal, index) => (
              <div key={index} className={`glass-intense rounded-2xl overflow-hidden hover-lift animate-stagger-delay-${index + 1}`}>
                <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 clay-button px-3 py-2 text-white text-sm font-bold">
                    ${deal.savings} OFF
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-white mb-2">{deal.title}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-white">${deal.salePrice}</span>
                      <span className="text-white/60 line-through ml-2">${deal.originalPrice}</span>
                    </div>
                  </div>
                  <div className="text-sm text-white/80 mb-4 flex items-center">
                    <Leaf className="h-4 w-4 text-accent mr-1" />
                    Available at {deal.store}
                  </div>
                  {expandedSections.deals && (
                    <div className="text-sm text-white/70 mb-4 animate-accordion-down">
                      Limited time offer - while supplies last. Check store for availability.
                    </div>
                  )}
                  <button className="w-full canadian-button text-white py-3 rounded-lg font-semibold">
                    View Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Progressive Disclosure - Features */}
      <section 
        className={`py-20 bg-white relative z-10 transition-all duration-1000 ${
          visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        id="features"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose PriceTrackr?</h2>
              <button
                onClick={() => toggleSection('features')}
                className="p-2 rounded-full neomorphism hover-lift transition-all"
              >
                {expandedSections.features ? 
                  <ChevronUp className="h-5 w-5 text-primary" /> : 
                  <ChevronDown className="h-5 w-5 text-primary" />
                }
              </button>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to find the best deals across Canada's top retailers, 
              saving you time and money on every purchase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`text-center clay-card p-8 hover-lift animate-stagger-delay-${index + 1}`}>
                <div className="flex justify-center mb-4">
                  <div className="neomorphism p-4 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                {expandedSections.features && (
                  <p className="text-sm text-gray-500 animate-accordion-down">
                    {feature.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax How It Works - SOFTENED WITH GRADIENT */}
      <section 
        className={`py-20 bg-gradient-to-tr from-yellow-500 via-primary to-orange-600 text-primary-foreground relative overflow-hidden z-10 transition-all duration-1000 ${
          visibleSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        id="how-it-works"
        data-animate
      >
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <div className="shape-blob absolute top-10 left-10 w-40 h-40 opacity-20" />
          <div className="shape-organic absolute bottom-20 right-20 w-32 h-32 opacity-15" />
          <Leaf className="absolute top-1/2 left-1/4 h-24 w-24 text-white/10 floating-element animate-morph" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How PriceTrackr Works</h2>
            <p className="text-xl opacity-90">Save money in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className={`text-center group animate-stagger-delay-${index + 1}`}>
                <div className="glass-intense w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform hover-lift">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="opacity-90 mb-2">{step.description}</p>
                <p className="text-sm opacity-75">{step.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clear Image Categories - REMOVED IMAGE EFFECTS */}
      <section 
        className={`py-20 bg-gradient-to-br from-gray-50 via-white to-accent/5 relative z-10 transition-all duration-1000 ${
          visibleSections.has('categories') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        id="categories"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">
              Explore thousands of products across our most popular categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/search?category=${category.name}`}
                className={`group relative overflow-hidden clay-card hover-lift animate-stagger-delay-${index + 1}`}
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="glass-card p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} products</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Trending Products */}
      <section 
        className={`py-20 bg-white relative z-10 transition-all duration-1000 ${
          visibleSections.has('trending') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        id="trending"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Now</h2>
            <p className="text-lg text-gray-600">
              See what other Canadians are searching for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingProducts.map((product, index) => (
              <Link
                key={index}
                to={`/search?q=${product}`}
                className={`group neomorphism-canadian p-6 text-center hover-lift transition-all animate-stagger-delay-${index % 4 + 1}`}
              >
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-medium text-gray-900">{product}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Progressive Disclosure - Testimonials - SOFTENED WITH GRADIENT */}
      <section 
        className={`py-20 bg-gradient-to-bl from-red-500 via-primary to-yellow-600 relative overflow-hidden z-10 transition-all duration-1000 ${
          visibleSections.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        id="testimonials"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h2 className="text-3xl font-bold text-white">What Our Customers Say</h2>
              <button
                onClick={() => toggleSection('testimonials')}
                className="p-2 rounded-full glass-card hover-lift transition-all"
              >
                {expandedSections.testimonials ? 
                  <ChevronUp className="h-5 w-5 text-white" /> : 
                  <ChevronDown className="h-5 w-5 text-white" />
                }
              </button>
            </div>
            <p className="text-lg text-white/90">
              Join thousands of satisfied Canadian shoppers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`glass-intense p-8 rounded-2xl hover-lift animate-stagger-delay-${index + 1}`}>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-4 italic">"{testimonial.comment}"</p>
                {expandedSections.testimonials && (
                  <p className="text-white/70 text-sm mb-4 animate-accordion-down">
                    {testimonial.details}
                  </p>
                )}
                <div className="border-t border-white/20 pt-4">
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-white/70">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter with Parallax - SOFTENED WITH GRADIENT */}
      <section 
        className={`py-20 bg-gradient-to-tl from-orange-600 via-primary to-yellow-500 text-primary-foreground relative overflow-hidden z-10 transition-all duration-1000 ${
          visibleSections.has('newsletter') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        id="newsletter"
        data-animate
      >
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        >
          <div className="shape-organic absolute top-1/4 left-1/4 w-64 h-64 opacity-10 animate-morph"></div>
          <div className="shape-blob absolute bottom-1/4 right-1/4 w-48 h-48 opacity-15 floating-element"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="glass-intense p-8 rounded-3xl hover-lift">
              <Bell className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">Never Miss a Deal</h2>
              <p className="text-xl mb-8 opacity-90">
                Get notified when prices drop on products you're watching
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 neomorphism-inset"
                />
                <button className="canadian-button px-8 py-4 rounded-xl font-semibold">
                  Subscribe
                </button>
              </div>
              <p className="text-sm mt-4 opacity-75">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section 
        className={`py-20 bg-white relative z-10 transition-all duration-1000 ${
          visibleSections.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        id="cta"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-canadian rounded-3xl p-12 hover-lift relative overflow-hidden">
            <div className="shape-blob absolute top-0 right-0 w-32 h-32 opacity-20" />
            <div className="shape-organic absolute bottom-0 left-0 w-40 h-40 opacity-15" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Start Saving?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of Canadians who save money with PriceTrackr
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/search"
                  className="inline-flex items-center px-8 py-4 canadian-button font-semibold rounded-xl hover-lift"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Comparing Prices
                </Link>
                <Link
                  to="/stores"
                  className="inline-flex items-center px-8 py-4 clay-card font-semibold rounded-xl hover-lift transition-colors"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Find Local Stores
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
