import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Grid, List, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Simple in-memory cache
  const cache = useMemo(() => new Map(), []);
  const cacheTimeout = 5 * 60 * 1000; // 5 minutes

  // Auto-switch to list view on mobile for better experience
  useEffect(() => {
    if (isMobile && viewMode === 'grid') {
      setViewMode('list');
    }
  }, [isMobile]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query || category) {
        searchProducts();
        if (user && query) {
          logSearch();
        }
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, category, user]);

  const getCacheKey = (searchQuery, searchCategory) => {
    return `${searchQuery}-${searchCategory}`;
  };

  const searchProducts = async (isRetry = false) => {
    if (isRetry) {
      setRetrying(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const cacheKey = getCacheKey(query, category);
      const cached = cache.get(cacheKey);
      
      // Check cache first
      if (cached && Date.now() - cached.timestamp < cacheTimeout) {
        setProducts(cached.data);
        setLoading(false);
        setRetrying(false);
        return;
      }

      console.log('Fetching products via Supabase Edge Function...', { query, category });
      
      const { data, error } = await supabase.functions.invoke('scrape-products', {
        body: {
          query: query || 'electronics',
          category: category || 'general',
          store: 'amazon'
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to invoke scrape function');
      }

      console.log('Scrape function response:', data);
      
      if (!data || !data.success) {
        throw new Error(data?.error || data?.message || 'Failed to fetch products');
      }

      // If no products found, try again once
      if (!data.products || data.products.length === 0) {
        if (!isRetry) {
          console.log('No products found, retrying...');
          setTimeout(() => searchProducts(true), 1000);
          return;
        }
        setProducts([]);
        setLoading(false);
        setRetrying(false);
        return;
      }

      // Normalize data to our internal schema
      const normalizedProducts = data.products.map((product, index) => ({
        id: product.external_id || `product-${Date.now()}-${index}`,
        name: product.name || 'Unknown Product',
        description: product.description || '',
        image: product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        category: product.category || category || 'General',
        rating: product.rating || 4.0,
        reviews: product.reviews || 0,
        prices: [{
          store: product.store || 'Amazon',
          price: product.price || 0,
          shipping: 'Free shipping',
          availability: product.availability || 'In stock',
          link: product.affiliate_url || '#'
        }]
      }));

      // Cache the results
      cache.set(cacheKey, {
        data: normalizedProducts,
        timestamp: Date.now()
      });

      setProducts(normalizedProducts);
      
      toast({
        title: "Success",
        description: `Found ${normalizedProducts.length} products!`,
      });
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "Failed to fetch products. Please try again.",
      });
      
      setProducts([]);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const triggerLiveScraping = async () => {
    setRetrying(true);
    try {
      console.log('Triggering live Amazon scraping via Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('scrape-products', {
        body: {
          query: query || 'electronics',
          category: category || 'general'
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to invoke scrape function');
      }

      console.log('Live scraping completed:', data);
      
      if (data && data.success && data.products && data.products.length > 0) {
        // Normalize and set the scraped products immediately
        const normalizedProducts = data.products.map(product => ({
          id: product.id || `scraped-${Date.now()}-${Math.random()}`,
          name: product.name || product.title || 'Unknown Product',
          description: product.description || product.snippet || '',
          image: product.image_url || product.image || 'https://via.placeholder.com/400x400?text=No+Image',
          category: product.category || category || 'General',
          rating: product.rating || product.stars || 4.0,
          reviews: product.reviews || product.reviews_count || 0,
          prices: [{
            store: 'Amazon',
            price: product.price || product.current_price || 0,
            shipping: product.shipping || 'Free shipping',
            availability: product.availability || product.in_stock ? 'In stock' : 'Limited stock',
            link: product.affiliate_url || product.url || '#'
          }]
        }));
        
        setProducts(normalizedProducts);
        
        // Cache the fresh results
        const cacheKey = getCacheKey(query, category);
        cache.set(cacheKey, {
          data: normalizedProducts,
          timestamp: Date.now()
        });
        
        toast({
          title: "Success",
          description: `Found ${normalizedProducts.length} products!`,
        });
        
        return;
      }

      throw new Error('Live scraping failed or returned no results');
      
    } catch (error) {
      console.error('Error in live scraping:', error);
      setProducts([]);
      toast({
        variant: "destructive",
        title: "Scraping Error",
        description: "Failed to scrape live Amazon data. Please try a different search.",
      });
    } finally {
      setRetrying(false);
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
      <div className={cn(
        "bg-gray-200 rounded-lg mb-4",
        viewMode === 'list' && isMobile ? "h-20 w-20" : "aspect-square"
      )} />
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={cn(
        "max-w-7xl mx-auto py-4",
        isMobile ? "px-3" : "px-4 sm:px-6 lg:px-8 py-8"
      )}>
        {/* Search Header - Mobile Optimized */}
        <div className={cn("mb-4", isMobile ? "mb-3" : "mb-8")}>
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h1 className={cn(
                  "font-bold text-gray-900 truncate",
                  isMobile ? "text-lg" : "text-2xl"
                )}>
                  {query ? `Search results for "${query}"` : category || 'All Products'}
                </h1>
                <p className={cn(
                  "text-gray-600 mt-1",
                  isMobile ? "text-sm" : "text-base"
                )}>
                  {loading ? 'Searching...' : `${products.length} products found`}
                </p>
              </div>
              
              {/* View Toggle - Desktop only */}
              {!isMobile && (
                <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1 ml-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1",
                      viewMode === 'grid' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <Grid className="h-4 w-4" />
                    <span>Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1",
                      viewMode === 'list' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <List className="h-4 w-4" />
                    <span>List</span>
                  </button>
                </div>
              )}
            </div>
            
            <FilterPanel />
          </div>
        </div>

        {/* Results - Mobile Optimized */}
        {loading ? (
          <div className={cn(
            "grid gap-3",
            isMobile 
              ? "grid-cols-1" 
              : viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
          )}>
            {Array.from({ length: isMobile ? 4 : 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={cn(
            "grid gap-3",
            isMobile 
              ? "grid-cols-1" 
              : viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
          )}>
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                viewMode={isMobile ? 'list' : viewMode}
                isMobile={isMobile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className={cn("mx-auto", isMobile ? "max-w-sm px-4" : "max-w-md")}>
              <h3 className={cn(
                "font-medium text-gray-900 mb-2",
                isMobile ? "text-base" : "text-lg"
              )}>
                No products found
              </h3>
              <p className={cn(
                "text-gray-600 mb-4",
                isMobile ? "text-sm" : "text-base"
              )}>
                We're searching for products that match your criteria. This may take a moment.
              </p>
              <div className={cn(
                "flex gap-2",
                isMobile ? "flex-col" : "flex-row justify-center"
              )}>
                <button
                  onClick={triggerLiveScraping}
                  className={cn(
                    "inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors",
                    isMobile ? "w-full text-sm" : "text-base"
                  )}
                >
                  {retrying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Search Again'
                  )}
                </button>
                <Link
                  to="/"
                  className={cn(
                    "inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors",
                    isMobile ? "w-full text-sm" : "text-base"
                  )}
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
