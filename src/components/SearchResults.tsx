
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    searchProducts();
    // Log search query if user is logged in
    if (user && query) {
      logSearch();
    }
  }, [query, category, user]);

  const searchProducts = async () => {
    setLoading(true);
    try {
      let supabaseQuery = supabase
        .from('products')
        .select('*')
        .eq('status', 'active');

      // Apply search filters
      if (query) {
        supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      if (category && category !== 'All Categories') {
        supabaseQuery = supabaseQuery.eq('category', category);
      }

      const { data: dbProducts, error } = await supabaseQuery
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // If no products found in database, trigger scraping
      if (!dbProducts || dbProducts.length === 0) {
        console.log('No products found, triggering scraping...');
        await triggerScraping();
        return;
      }

      // Convert to expected format
      const formattedProducts = dbProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        image: product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        category: product.category || 'General',
        rating: 4.5,
        reviews: 100,
        prices: [{
          store: 'Multiple Stores',
          price: product.price || 0,
          shipping: 'Free shipping',
          availability: 'In stock',
          link: product.affiliate_url || '#'
        }]
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error searching products:', error);
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "Failed to search products. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerScraping = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('scrape-products', {
        body: { 
          query: query || category || 'products',
          category: category || 'general'
        }
      });

      if (error) {
        console.error('Scraping error:', error);
        // Show fallback message
        setProducts([]);
      } else {
        console.log('Scraping completed:', data);
        // Reload search after scraping
        setTimeout(() => {
          searchProducts();
        }, 2000);
      }
    } catch (error) {
      console.error('Error triggering scraping:', error);
      setProducts([]);
    }
  };

  const logSearch = async () => {
    try {
      await supabase
        .from('search_logs')
        .insert({
          user_id: user.id,
          search_query: query,
          results_count: products.length
        });
    } catch (error) {
      console.error('Error logging search:', error);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {query ? `Search results for "${query}"` : category || 'All Products'}
              </h1>
              <p className="text-gray-600 mt-1">
                {loading ? 'Searching...' : `${products.length} products found`}
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
            </div>
          </div>
          
          <FilterPanel />
        </div>

        {/* Results */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                We're searching for products that match your criteria. This may take a moment.
              </p>
              <div className="space-y-2">
                <button
                  onClick={triggerScraping}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mr-2"
                >
                  Search Again
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
