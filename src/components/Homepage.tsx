
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Zap, MapPin } from 'lucide-react';
import SearchBar from './SearchBar';
import ProductCard from './ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Homepage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
    // Trigger scraping on component mount
    triggerScraping();
  }, []);

  const loadProducts = async () => {
    try {
      // Fetch products from database
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (products && products.length > 0) {
        // Convert to the expected format
        const formattedProducts = products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          image: product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
          category: product.category || 'General',
          rating: 4.5, // Default rating
          reviews: 100, // Default reviews
          prices: [{
            store: 'Multiple Stores',
            price: product.price || 0,
            shipping: 'Free shipping',
            availability: 'In stock',
            link: product.affiliate_url || '#'
          }]
        }));

        setFeaturedProducts(formattedProducts.slice(0, 8));
        setTrendingProducts(formattedProducts.slice(8, 16));
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerScraping = async () => {
    try {
      console.log('Triggering product scraping...');
      const { data, error } = await supabase.functions.invoke('scrape-products', {
        body: { 
          query: 'popular products',
          category: 'electronics' 
        }
      });

      if (error) {
        console.error('Scraping error:', error);
      } else {
        console.log('Scraping completed:', data);
        // Reload products after scraping
        setTimeout(() => {
          loadProducts();
        }, 2000);
      }
    } catch (error) {
      console.error('Error triggering scraping:', error);
    }
  };

  const categories = [
    { name: 'Electronics', icon: '📱', link: '/search?category=Electronics' },
    { name: 'Home & Garden', icon: '🏠', link: '/search?category=Home & Garden' },
    { name: 'Tools', icon: '🔧', link: '/search?category=Tools' },
    { name: 'Clothing', icon: '👕', link: '/search?category=Clothing' },
    { name: 'Sports', icon: '⚽', link: '/search?category=Sports' },
    { name: 'Automotive', icon: '🚗', link: '/search?category=Automotive' }
  ];

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find the Best Deals
            <span className="text-primary block">Across Canada</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Compare prices from Amazon, Walmart, Home Depot and more. Get real-time pricing data and never overpay again.
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar />
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Real-time pricing</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-green-500" />
              <span>Canadian stores</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span>Price history tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="group bg-gray-50 rounded-xl p-6 text-center hover:bg-primary/5 transition-colors"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Deals</h2>
            <Link
              to="/search"
              className="text-primary hover:text-primary/80 font-medium"
            >
              View all deals →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 mb-4">No featured products available yet.</p>
                <button
                  onClick={triggerScraping}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Load Products
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <Link
              to="/search"
              className="text-primary hover:text-primary/80 font-medium"
            >
              View all trending →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No trending products available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How PriceTrackr Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Products</h3>
              <p className="text-gray-600">
                Search for any product across multiple Canadian retailers
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compare Prices</h3>
              <p className="text-gray-600">
                See real-time prices from Amazon, Walmart, Home Depot and more
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Money</h3>
              <p className="text-gray-600">
                Get the best deals and track price history to buy at the right time
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
