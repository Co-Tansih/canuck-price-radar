
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  Activity,
  DollarSign,
  Eye,
  ShoppingCart,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ProductsManagement = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [stats, setStats] = useState({
    totalProducts: 0,
    priceUpdates: 0,
    avgPriceDrop: 0
  });

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Get total count
      const { count: totalCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get products with pagination
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      // Calculate stats with mock data since we don't have product_prices table
      const mockPriceUpdates = Math.floor(Math.random() * 100) + 50;
      const mockAvgPriceDrop = (Math.random() * 10).toFixed(1);

      setStats({
        totalProducts: totalCount || 0,
        priceUpdates: mockPriceUpdates,
        avgPriceDrop: parseFloat(mockAvgPriceDrop)
      });

      setProducts(productsData || []);
      setTotalPages(Math.ceil((totalCount || 0) / itemsPerPage));
      
    } catch (error) {
      console.error('Error in fetchProducts:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: t('totalProducts') || 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      change: '+12.5%',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: t('priceUpdates') || 'Price Updates',
      value: stats.priceUpdates.toLocaleString(),
      change: '+8.2%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: t('avgPriceDrop') || 'Avg. Price Drop',
      value: `${stats.avgPriceDrop}%`,
      change: '+23.1%',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-6 p-2 md:p-4 lg:p-0">
      {/* Page Header */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
            {t('productsManagement') || 'Products Management'}
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-xs md:text-sm lg:text-base">
            {t('manageProductCatalogDesc') || 'Manage your product catalog and monitor pricing data'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" className="flex items-center justify-center space-x-2 text-xs md:text-sm w-full sm:w-auto">
            <Plus className="h-3 w-3 md:h-4 md:w-4" />
            <span>{t('addProduct') || 'Add Product'}</span>
          </Button>
        </div>
      </div>

      {/* Overview Stats - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow glass-card">
              <CardContent className="p-3 md:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                      {stat.title}
                    </p>
                    <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mt-1 md:mt-2">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-green-600 mt-1">
                      {stat.change} from last week
                    </p>
                  </div>
                  <div className={`p-2 md:p-3 rounded-full ${stat.bgColor} flex-shrink-0 ml-2`}>
                    <Icon className={`h-3 w-3 md:h-4 md:w-4 lg:h-6 lg:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Products List - Mobile Responsive */}
      <Card className="glass-card">
        <CardHeader className="p-3 md:p-4 lg:p-6">
          <CardTitle className="text-base md:text-lg lg:text-xl">
            {t('manageProductCatalog') || 'Manage Product Catalog'}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            {t('manageProductCatalogDesc') || 'Manage your product catalog and monitor pricing data'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 md:p-4 lg:p-6 pt-0">
          {/* Mobile Cards View */}
          <div className="block md:hidden space-y-3">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-3 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm truncate">{product.name}</h3>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {product.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <p><span className="font-medium">Category:</span> {product.category}</p>
                  <p><span className="font-medium">Price:</span> ${product.price}</p>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Edit className="h-3 w-3"/>
                  </Button>
                  <Button variant="destructive" size="sm" className="text-xs">
                    <Trash2 className="h-3 w-3"/>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4"/>
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between py-3 md:py-4 space-y-2 sm:space-y-0">
            <div className="text-xs md:text-sm text-muted-foreground">
              {products.length} of {stats.totalProducts} {t('products') || 'Products'}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="text-xs md:text-sm"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="text-xs md:text-sm"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsManagement;
