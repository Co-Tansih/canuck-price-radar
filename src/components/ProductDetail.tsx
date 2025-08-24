import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, ExternalLink, TrendingUp, ArrowLeft } from 'lucide-react';
import PriceTrendChart from './PriceTrendChart';
import StoreMap from './StoreMap';
import { useToast } from '@/hooks/use-toast';
import { mockProducts, mockPriceHistory } from '@/data/mockData';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [postalCode, setPostalCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find product in mock data
      const foundProduct = mockProducts.find(p => p.id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product details.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/search" className="text-primary hover:underline">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const lowestPrice = Math.min(...product.prices.map((p: any) => p.price));
  const highestPrice = Math.max(...product.prices.map((p: any) => p.price));
  const savings = highestPrice - lowestPrice;
  
  // Fallback for missing image
  const imageUrl = product.image || product.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/search" className="hover:text-primary">Search</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <Link
          to="/search"
          className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Results</span>
        </Link>

        {/* Product Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={imageUrl}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-gray-500">({product.reviews} reviews)</span>
                  </div>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {product.category}
                  </span>
                </div>
                <p className="text-gray-600 text-lg">{product.description}</p>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">${lowestPrice}</div>
                    <div className="text-sm text-gray-500">Starting from</div>
                  </div>
                  {savings > 0 && (
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        Save up to ${savings.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">vs highest price</div>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Compare prices from {product.prices.length} different stores
                </div>
              </div>

              {/* Postal Code Input */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Check Local Availability</h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter postal code (e.g., M5V 3A8)"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    Check
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Comparison */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Comparison</h2>
          <div className="space-y-4">
            {product.prices.map((priceInfo: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">{priceInfo.store}</div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{priceInfo.shipping}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{priceInfo.availability}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">${priceInfo.price}</div>
                    {priceInfo.price === lowestPrice && (
                      <div className="text-sm text-green-600 font-medium">Best Price</div>
                    )}
                  </div>
                  <a
                    href={priceInfo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <span>View Offer</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Price History</h2>
          </div>
          <PriceTrendChart data={mockPriceHistory} />
        </div>

        {/* Store Map */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Locator</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Enter your postal code above to find nearby stores with this product.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;