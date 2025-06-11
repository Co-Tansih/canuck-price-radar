
import React, { useState } from 'react';
import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  hours: string;
  inStock: boolean;
  price: number;
  coordinates: [number, number];
}

interface StoreMapProps {
  stores: Store[];
}

const StoreMap = ({ stores }: StoreMapProps) => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Map Placeholder */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <div className="aspect-square lg:aspect-auto lg:h-96 flex items-center justify-center">
          <div className="text-center p-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h3>
            <p className="text-gray-600">
              Map integration would show store locations relative to your postal code
            </p>
          </div>
        </div>
        
        {/* Map controls overlay */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
          <div className="flex flex-col space-y-1">
            <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">+</button>
            <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded">-</button>
          </div>
        </div>
      </div>

      {/* Store List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {stores.map((store) => (
          <div
            key={store.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedStore?.id === store.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedStore(store)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{store.name}</h3>
                <p className="text-sm text-gray-600">{store.address}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">${store.price}</div>
                <div className={`text-sm ${store.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {store.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{store.distance}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{store.hours}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{store.phone}</span>
                </div>
              </div>
              
              {store.inStock && (
                <button className="flex items-center space-x-1 text-primary hover:text-primary/80">
                  <span>Directions</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreMap;
