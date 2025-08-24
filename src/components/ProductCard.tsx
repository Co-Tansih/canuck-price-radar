
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    image: string;
    category: string;
    prices: Array<{
      store: string;
      price: number;
      shipping: string;
      availability: string;
      link: string;
    }>;
    rating: number;
    reviews: number;
  };
  viewMode?: 'grid' | 'list';
  isMobile?: boolean;
}

const ProductCard = ({ product, viewMode = 'grid', isMobile = false }: ProductCardProps) => {
  const validPrices = product.prices.filter(p => p.price && p.price > 0).map(p => p.price);
  const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const highestPrice = validPrices.length > 0 ? Math.max(...validPrices) : 0;
  const savings = highestPrice - lowestPrice;
  
  // Fallback for missing image
  const imageUrl = product.image || product.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
  
  // Fallback for missing name/title
  const productName = product.name || product.title || 'Product';
  const productDescription = product.description || productName;

  if (viewMode === 'list') {
    return (
      <div className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow",
        isMobile ? "p-3" : "p-6"
      )}>
        <div className={cn(
          "flex",
          isMobile ? "space-x-3" : "space-x-6"
        )}>
          <Link to={`/product/${product.id}`} className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={productName}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
              }}
              className={cn(
                "object-cover rounded-lg",
                isMobile ? "w-20 h-20" : "w-32 h-32"
              )}
            />
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className={cn(
              "flex",
              isMobile ? "flex-col space-y-2" : "justify-between"
            )}>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`}>
                  <h3 className={cn(
                    "font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2",
                    isMobile ? "text-sm mb-1" : "text-lg mb-2"
                  )}>
                    {productName}
                  </h3>
                </Link>
                
                {!isMobile && (
                  <p className="text-gray-600 mt-1 line-clamp-2 text-sm">{productDescription}</p>
                )}
                
                <div className={cn(
                  "flex items-center mt-2",
                  isMobile ? "space-x-2 text-xs" : "space-x-4 mt-3"
                )}>
                  <div className="flex items-center space-x-1">
                    <Star className={cn("text-yellow-400 fill-current", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                    <span className="text-gray-600">{product.rating}</span>
                    <span className="text-gray-400">({product.reviews})</span>
                  </div>
                  <span className="text-gray-500">{product.category}</span>
                </div>
              </div>
              
              <div className={cn(
                "text-right",
                isMobile ? "mt-2" : "flex-shrink-0"
              )}>
                <div className={cn(
                  "font-bold text-primary mb-1",
                  isMobile ? "text-lg" : "text-2xl"
                )}>
                  {lowestPrice > 0 ? `$${lowestPrice.toFixed(2)}` : 'Price unavailable'}
                </div>
                {savings > 0 && (
                  <div className={cn(
                    "text-green-600 font-medium",
                    isMobile ? "text-xs" : "text-sm"
                  )}>
                    Save up to ${savings.toFixed(2)}
                  </div>
                )}
                <div className={cn(
                  "text-gray-500 mt-1",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  {product.prices.length} stores
                </div>
              </div>
            </div>
            
            {isMobile ? (
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Free shipping</span>
                </div>
                <Link
                  to={`/product/${product.id}`}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs font-medium"
                >
                  Compare
                </Link>
              </div>
            ) : (
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{product.prices[0]?.shipping || 'Standard shipping'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{product.prices[0]?.availability || 'Available'}</span>
                  </div>
                </div>
                
                <Link
                  to={`/product/${product.id}`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Compare Prices
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={productName}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop';
            }}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-2">
            {productName}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{productDescription}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating}</span>
            <span className="text-sm text-gray-400">({product.reviews})</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-bold text-primary">
              {lowestPrice > 0 ? `$${lowestPrice.toFixed(2)}` : 'Price unavailable'}
            </div>
            {savings > 0 && (
              <div className="text-sm text-green-600 font-medium">
                Save ${savings.toFixed(2)}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{product.prices[0]?.shipping || 'Standard'}</span>
            </div>
            <span>{product.prices.length} stores</span>
          </div>
          
          <Link
            to={`/product/${product.id}`}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium text-center block"
          >
            Compare Prices
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
