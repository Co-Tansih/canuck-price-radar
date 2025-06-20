
import React from 'react';
import { Search, ShoppingCart, TrendingUp, Shield, Clock, MapPin, Star, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const Homepage = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Clock,
      title: t('realTimePricing'),
      description: t('realTimePricing')
    },
    {
      icon: MapPin,
      title: t('canadianStores'),
      description: t('canadianStores')
    },
    {
      icon: TrendingUp,
      title: t('priceHistoryTracking'),
      description: t('priceHistoryTracking')
    }
  ];

  const categories = [
    { name: t('electronics'), icon: '📱', color: 'bg-blue-50 text-blue-600' },
    { name: t('homeGarden'), icon: '🏠', color: 'bg-green-50 text-green-600' },
    { name: t('tools'), icon: '🔧', color: 'bg-yellow-50 text-yellow-600' },
    { name: t('clothing'), icon: '👕', color: 'bg-purple-50 text-purple-600' },
    { name: t('sports'), icon: '⚽', color: 'bg-red-50 text-red-600' },
    { name: t('automotive'), icon: '🚗', color: 'bg-gray-50 text-gray-600' }
  ];

  const steps = [
    {
      icon: Search,
      title: t('searchProducts'),
      description: t('searchProductsDesc')
    },
    {
      icon: ShoppingCart,
      title: t('comparePrice'),
      description: t('comparePricesDesc')
    },
    {
      icon: TrendingUp,
      title: t('saveMoney'),
      description: t('saveMoneyDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-yellow-50">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-yellow-600/5" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-600 mb-8 border border-red-100 shadow-sm">
              <Shield className="h-4 w-4 text-red-500 mr-2" />
              {t('trustedBy')} <span className="font-semibold text-red-600 ml-1">100K+ {t('canadians')}</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              {t('heroTitle')}
              <br />
              <span className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                {t('heroSubtitle')}
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('heroDescription')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Search className="mr-2 h-5 w-5" />
                {t('getStarted')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-red-200 text-red-700 hover:bg-red-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:border-red-300"
              >
                {t('learnMore')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-yellow-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "500", suffix: "K+", label: t('productsTracked') },
              { number: "2", suffix: "M+", label: t('priceComparisons') },
              { number: "$15", suffix: "M+", label: t('moneySaved') }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                    {stat.number}
                  </span>
                  <span className="text-gray-700">{stat.suffix}</span>
                </div>
                <p className="text-gray-600 text-lg font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('shopByCategory')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('searchProductsDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-3 rounded-xl font-semibold">
              {t('viewMore')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('howItWorks')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('saveMoneyDesc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-yellow-100 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon className="h-10 w-10 text-red-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-red-700 to-yellow-600">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('getStarted')}
          </h2>
          <p className="text-xl text-red-100 mb-12 max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>
          <Button 
            size="lg" 
            className="bg-white text-red-600 hover:bg-gray-50 px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
          >
            <Search className="mr-3 h-6 w-6" />
            {t('search')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
