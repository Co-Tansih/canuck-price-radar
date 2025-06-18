
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  ExternalLink,
  Package
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const ProductsManagement = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeScrapers: 0,
    priceUpdates: 0,
    avgPriceDrop: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedProducts = data?.map(product => ({
        id: product.id,
        name: product.name || 'Unnamed Product',
        description: product.description || 'No description available',
        category: product.category || 'Uncategorized',
        image: product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        prices: [{
          store: 'Store',
          price: parseFloat(product.price) || 0,
          affiliate_url: product.affiliate_url
        }],
        rating: (Math.random() * 2 + 3).toFixed(1), // Mock rating between 3-5
        reviews: Math.floor(Math.random() * 1000) + 10, // Mock review count
        created_at: product.created_at,
        status: product.status || 'active'
      })) || [];

      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(processedProducts.map(p => p.category))];
      
      setProducts(processedProducts);
      setCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Total products count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Active scrapers count (from scraper logs)
      const { data: scraperLogs } = await supabase
        .from('scraper_logs')
        .select('scraper_name')
        .order('created_at', { ascending: false })
        .limit(100);

      const uniqueScrapers = new Set(scraperLogs?.map(log => log.scraper_name) || []);
      const activeScrapers = uniqueScrapers.size;

      // Price updates today
      const today = new Date().toISOString().split('T')[0];
      const { count: updatesCount } = await supabase
        .from('scraper_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      setStats({
        totalProducts: productCount || 0,
        activeScrapers,
        priceUpdates: updatesCount || 0,
        avgPriceDrop: 8.5 // Mock average price drop
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t('productsManagement') || 'Products Management'}
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            {t('manageProductCatalog') || 'Manage your product catalog and pricing data'}
          </p>
        </div>
        <Button className="flex items-center space-x-2 text-sm">
          <Plus className="h-4 w-4" />
          <span>{t('addProduct') || 'Add Product'}</span>
        </Button>
      </div>

      {/* Stats Cards - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="glass-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  {t('totalProducts') || 'Total Products'}
                </p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalProducts.toLocaleString()}
                </p>
              </div>
              <Package className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  {t('activeScrapers') || 'Active Scrapers'}
                </p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">{stats.activeScrapers}</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  {t('priceUpdates') || 'Price Updates'}
                </p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">{stats.priceUpdates}</p>
                <p className="text-xs md:text-sm text-green-600">
                  {t('today') || 'Today'}
                </p>
              </div>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ExternalLink className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  {t('avgPriceDrop') || 'Avg. Price Drop'}
                </p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-2">{stats.avgPriceDrop}%</p>
                <p className="text-xs md:text-sm text-green-600">
                  {t('thisWeek') || 'This week'}
                </p>
              </div>
              <div className="w-6 h-6 md:w-8 md:h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Eye className="h-3 w-3 md:h-4 md:w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search - Mobile Responsive */}
      <Card className="glass-card">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('searchProducts') || 'Search products...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <Button variant="outline" className="flex items-center space-x-2 text-sm">
                <Filter className="h-4 w-4" />
                <span>{t('moreFilters') || 'More Filters'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Display - Mobile Responsive */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            {t('products') || 'Products'} ({filteredProducts.length})
          </CardTitle>
          <CardDescription className="text-sm">
            {t('manageProductCatalogDesc') || 'Manage your product catalog and monitor pricing data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              {/* Mobile Cards View */}
              <div className="block lg:hidden space-y-4">
                {filteredProducts.map((product) => {
                  const price = product.prices[0]?.price || 0;
                  
                  return (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex items-start space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {product.description}
                          </p>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            ${price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            1 store
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        {t('product') || 'Product'}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        {t('category') || 'Category'}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        {t('price') || 'Price'}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        {t('status') || 'Status'}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        {t('rating') || 'Rating'}
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        {t('actions') || 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const price = product.prices[0]?.price || 0;
                      
                      return (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div>
                                <p className="font-medium text-gray-900 line-clamp-1">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="secondary">{product.category}</Badge>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-medium text-gray-900">
                              ${price.toFixed(2)}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {product.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="font-medium">{product.rating}</span>
                              <span className="text-gray-500">({product.reviews})</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsManagement;
