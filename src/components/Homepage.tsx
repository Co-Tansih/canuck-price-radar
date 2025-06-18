
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Zap, MapPin, ArrowRight, Star, Shield, Users } from 'lucide-react';
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
    { name: t('electronics'), icon: '📱', link: '/search?category=Electronics', color: 'from-blue-500 to-cyan-500' },
    { name: t('homeGarden'), icon: '🏠', link: '/search?category=Home & Garden', color: 'from-green-500 to-emerald-500' },
    { name: t('tools'), icon: '🔧', link: '/search?category=Tools', color: 'from-orange-500 to-red-500' },
    { name: t('clothing'), icon: '👕', link: '/search?category=Clothing', color: 'from-purple-500 to-pink-500' },
    { name: t('sports'), icon: '⚽', link: '/search?category=Sports', color: 'from-indigo-500 to-blue-500' },
    { name: t('automotive'), icon: '🚗', link: '/search?category=Automotive', color: 'from-gray-500 to-slate-500' }
  ];

  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: Users },
    { label: 'Products Tracked', value: '1M+', icon: Search },
    { label: 'Daily Savings', value: '$2M+', icon: TrendingUp },
    { label: 'Trust Rating', value: '4.9★', icon: Star }
  ];

  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-2xl mb-4" />
      <div className="h-4 bg-gray-200 rounded-full mb-3" />
      <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-4" />
      <div className="h-6 bg-gray-200 rounded-full w-1/2" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section - Modern Clean Design */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-red-100 to-red-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-red-100 mb-8">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">🇨🇦 Proudly Canadian</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                {t('heroTitle')}
              </span>
              <br />
              <span className="text-gray-900">{t('heroSubtitle')}</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('heroDescription')}
            </p>

            {/* Search Bar - Enhanced */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-2xl shadow-red-500/10 border border-gray-100 p-3">
                <SearchBar />
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{t('realTimePricing')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPin className="h-4 w-4 text-green-500" />
                <span className="font-medium">{t('canadianStores')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{t('priceHistoryTracking')}</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories - Modern Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('shopByCategory')}
            </h2>
            <p className="text-gray-600 text-lg">Discover products across all major categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={category.link}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl filter brightness-0 invert">{category.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-center group-hover:text-red-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals - Modern Cards */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {t('featuredDeals')}
              </h2>
              <p className="text-gray-600">Handpicked deals just for you</p>
            </div>
            <Link
              to="/search"
              className="group flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-all duration-300 hover:scale-105"
            >
              <span className="font-medium">{t('viewAllDeals')}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Products</h3>
                  <p className="text-gray-600 mb-6">We're fetching the latest deals for you...</p>
                  <button
                    onClick={triggerScraping}
                    className="bg-gradient-to-r from-red-600 to-yellow-500 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {t('loadProducts')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {t('trendingNow')}
                </h2>
                <p className="text-gray-600">What's popular right now</p>
              </div>
            </div>
            <Link
              to="/search"
              className="group flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
            >
              <span>{t('viewAllTrending')}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((product) => (
                <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Trending Products</h3>
                  <p className="text-gray-500">Discovering what's hot right now...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works - Clean Modern */}
      <section className="py-20 bg-gradient-to-br from-red-50 via-white to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('howItWorks')}
            </h2>
            <p className="text-gray-600 text-lg">Simple steps to save money</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: t('searchProducts'), desc: t('searchProductsDesc') },
              { icon: TrendingUp, title: t('comparePrice'), desc: t('comparePricesDesc') },
              { icon: Zap, title: t('saveMoney'), desc: t('saveMoneyDesc') }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-red-600 shadow-md">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
