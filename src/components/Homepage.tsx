
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Zap, MapPin } from 'lucide-react';
import SearchBar from './SearchBar';
import ProductCard from './ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const Homepage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
    const scrapingTimer = setTimeout(() => {
      triggerScraping();
    }, 2000);
    
    return () => clearTimeout(scrapingTimer);
  }, []);

  const loadProducts = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (products && products.length > 0) {
        const formattedProducts = products.map(product => ({
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

        setFeaturedProducts(formattedProducts.slice(0, 8));
        setTrendingProducts(formattedProducts.slice(8, 16));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerScraping = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('scrape-products', {
        body: { 
          query: 'popular products',
          category: 'electronics' 
        }
      });

      if (!error && data) {
        setTimeout(() => {
          loadProducts();
        }, 3000);
      }
    } catch (error) {
      console.error('Error triggering scraping:', error);
    }
  };

  const categories = [
    { name: t('electronics'), icon: '📱', link: '/search?category=Electronics' },
    { name: t('homeGarden'), icon: '🏠', link: '/search?category=Home & Garden' },
    { name: t('tools'), icon: '🔧', link: '/search?category=Tools' },
    { name: t('clothing'), icon: '👕', link: '/search?category=Clothing' },
    { name: t('sports'), icon: '⚽', link: '/search?category=Sports' },
    { name: t('automotive'), icon: '🚗', link: '/search?category=Automotive' }
  ];

  const SkeletonCard = () => (
    <div className="glass-card rounded-2xl p-6 animate-pulse hover-lift">
      <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4" />
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mb-2" />
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4 mb-3" />
      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/2" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background maple-leaf-bg">
      {/* Floating maple leaves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="maple-leaf-small floating-element absolute top-20 left-10 opacity-60" />
        <div className="maple-leaf floating-element absolute top-40 right-20 opacity-40" />
        <div className="maple-leaf-large floating-element absolute bottom-40 left-1/4 opacity-30" />
        <div className="maple-leaf-small floating-element absolute bottom-20 right-1/3 opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-canadian opacity-20" />
        <div className="shape-blob absolute top-10 left-10 w-64 h-64 opacity-30" />
        <div className="shape-organic absolute bottom-10 right-10 w-48 h-48 opacity-20" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-stagger">
            <span className="gradient-text">{t('heroTitle')}</span>
            <span className="block text-primary animate-stagger-delay-1">{t('heroSubtitle')}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-stagger-delay-2">
            {t('heroDescription')}
          </p>
          
          <div className="max-w-2xl mx-auto mb-8 animate-stagger-delay-3">
            <div className="glass-card rounded-2xl p-2">
              <SearchBar />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 animate-stagger-delay-3">
            <div className="flex items-center space-x-2 glass-card rounded-full px-4 py-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>{t('realTimePricing')}</span>
            </div>
            <div className="flex items-center space-x-2 glass-card rounded-full px-4 py-2">
              <MapPin className="h-4 w-4 text-green-500" />
              <span>{t('canadianStores')}</span>
            </div>
            <div className="flex items-center space-x-2 glass-card rounded-full px-4 py-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span>{t('priceHistoryTracking')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 gradient-text">
            {t('shopByCategory')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={category.link}
                className={`group clay-card p-6 text-center hover-lift animate-stagger-delay-${index % 3 + 1}`}
              >
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-16 relative">
        <div className="absolute inset-0 gradient-aurora opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900 gradient-text">{t('featuredDeals')}</h2>
            <Link
              to="/search"
              className="text-primary hover:text-primary/80 font-medium story-link"
            >
              {t('viewAllDeals')}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <div key={product.id} className={`animate-stagger-delay-${index % 3 + 1}`}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
                  <p className="text-gray-500 mb-4">Loading featured products...</p>
                  <button
                    onClick={triggerScraping}
                    className="canadian-button text-white px-6 py-3 rounded-full font-medium"
                  >
                    {t('loadProducts')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-16 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-3">
              <div className="neomorphism-canadian p-3 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 gradient-text">{t('trendingNow')}</h2>
            </div>
            <Link
              to="/search"
              className="text-primary hover:text-primary/80 font-medium story-link"
            >
              {t('viewAllTrending')}
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((product, index) => (
                <div key={product.id} className={`animate-stagger-delay-${index % 3 + 1}`}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="neomorphism rounded-2xl p-8 max-w-md mx-auto">
                  <p className="text-gray-500">Loading trending products...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 maple-leaf-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12 gradient-text">
            {t('howItWorks')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-stagger">
              <div className="glass-canadian w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 hover-lift">
                <Search className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('searchProducts')}</h3>
              <p className="text-gray-600">
                {t('searchProductsDesc')}
              </p>
            </div>
            <div className="text-center animate-stagger-delay-1">
              <div className="glass-canadian w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 hover-lift">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('comparePrice')}</h3>
              <p className="text-gray-600">
                {t('comparePricesDesc')}
              </p>
            </div>
            <div className="text-center animate-stagger-delay-2">
              <div className="glass-canadian w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 hover-lift">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('saveMoney')}</h3>
              <p className="text-gray-600">
                {t('saveMoneyDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
