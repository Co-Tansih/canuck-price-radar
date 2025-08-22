import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import FilterPanel from './FilterPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Grid, List, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockProducts } from '@/data/mockData';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Auto-switch to list view on mobile for better experience
  useEffect(() => {
    if (isMobile && viewMode === 'grid') {
      setViewMode('list');
    }
  }, [isMobile]);

  // Search effect
  useEffect(() => {
    if (query || category) {
      searchProducts();
    }
  }, [query, category]);

  const searchProducts = async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock products based on search query and category
      let filteredProducts = mockProducts;
      
      if (query) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      if (category && category !== 'All Categories') {
        filteredProducts = filteredProducts.filter(product =>
          product.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      setProducts(filteredProducts);
      
      toast({
        title: "Search Complete",
        description: `Found ${filteredProducts.length} products!`,
      });
      
    } catch (error) {
      console.error('Error searching products:', error);
      toast({
        variant: "destructive",
        title: "Search Error",
        description: "Failed to search products. Please try again.",
      });
      setProducts([]);
    } finally {
      setLoading(false);
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
                Try adjusting your search terms or browse our categories.
              </p>
              <div className={cn(
                "flex gap-2",
                isMobile ? "flex-col" : "flex-row justify-center"
              )}>
                <button
                  onClick={searchProducts}
                  className={cn(
                    "inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors",
                    isMobile ? "w-full text-sm" : "text-base"
                  )}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Search Again
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