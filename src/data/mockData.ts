
export const mockProducts = [
  {
    id: '1',
    name: 'DEWALT 20V MAX Cordless Drill',
    description: 'Professional-grade cordless drill with lithium-ion battery and LED light. Perfect for construction and home improvement projects.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
    category: 'Hardware Tools',
    rating: 4.5,
    reviews: 1247,
    prices: [
      {
        store: 'Home Depot',
        price: 149.99,
        shipping: 'Free shipping',
        availability: 'In stock',
        link: 'https://homedepot.ca'
      },
      {
        store: 'Canadian Tire',
        price: 159.99,
        shipping: '2-3 days',
        availability: 'Limited stock',
        link: 'https://canadiantire.ca'
      },
      {
        store: 'Amazon Canada',
        price: 144.99,
        shipping: 'Prime 1-day',
        availability: 'In stock',
        link: 'https://amazon.ca'
      }
    ]
  },
  {
    id: '2',
    name: 'Canada Goose Expedition Parka',
    description: 'Premium winter jacket designed for extreme cold weather conditions. Features down insulation and waterproof exterior.',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
    category: 'Clothing',
    rating: 4.8,
    reviews: 892,
    prices: [
      {
        store: 'Canada Goose',
        price: 1199.99,
        shipping: 'Free shipping',
        availability: 'In stock',
        link: 'https://canadagoose.com'
      },
      {
        store: 'The Bay',
        price: 1149.99,
        shipping: 'Free shipping',
        availability: 'In stock',
        link: 'https://thebay.com'
      },
      {
        store: 'Sporting Life',
        price: 1179.99,
        shipping: '3-5 days',
        availability: 'Limited stock',
        link: 'https://sportinglife.ca'
      }
    ]
  },
  {
    id: '3',
    name: 'Pine Lumber 2x4x8',
    description: 'High-quality construction-grade pine lumber. Ideal for framing, construction projects, and DIY builds.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    category: 'Building Materials',
    rating: 4.2,
    reviews: 456,
    prices: [
      {
        store: 'Home Depot',
        price: 8.97,
        shipping: 'Store pickup',
        availability: 'In stock',
        link: 'https://homedepot.ca'
      },
      {
        store: 'Lowes',
        price: 9.25,
        shipping: 'Store pickup',
        availability: 'In stock',
        link: 'https://lowes.ca'
      },
      {
        store: 'Rona',
        price: 8.75,
        shipping: 'Store pickup',
        availability: 'Limited stock',
        link: 'https://rona.ca'
      }
    ]
  },
  {
    id: '4',
    name: 'iPhone 15 Pro 256GB',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Available in multiple colors.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.6,
    reviews: 2134,
    prices: [
      {
        store: 'Apple Store',
        price: 1399.99,
        shipping: 'Free shipping',
        availability: 'In stock',
        link: 'https://apple.com'
      },
      {
        store: 'Best Buy',
        price: 1379.99,
        shipping: 'Free shipping',
        availability: 'In stock',
        link: 'https://bestbuy.ca'
      },
      {
        store: 'Costco',
        price: 1349.99,
        shipping: 'Free shipping',
        availability: 'Members only',
        link: 'https://costco.ca'
      }
    ]
  },
  {
    id: '5',
    name: 'Carhartt Work Boots',
    description: 'Durable steel-toe work boots with waterproof leather construction. CSA approved for workplace safety.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
    category: 'Accessories',
    rating: 4.4,
    reviews: 678,
    prices: [
      {
        store: 'Mark\'s',
        price: 189.99,
        shipping: 'Free shipping',
        availability: 'In stock',
        link: 'https://marks.com'
      },
      {
        store: 'Canadian Tire',
        price: 199.99,
        shipping: '2-3 days',
        availability: 'In stock',
        link: 'https://canadiantire.ca'
      },
      {
        store: 'Amazon Canada',
        price: 179.99,
        shipping: 'Prime 2-day',
        availability: 'In stock',
        link: 'https://amazon.ca'
      }
    ]
  },
  {
    id: '6',
    name: 'Ryobi Circular Saw',
    description: 'Powerful 15-amp circular saw with 7-1/4" blade. Includes laser guide and adjustable depth settings.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop',
    category: 'Hardware Tools',
    rating: 4.3,
    reviews: 534,
    prices: [
      {
        store: 'Home Depot',
        price: 89.99,
        shipping: 'Free shipping',
        availability: 'In stock',
        link: 'https://homedepot.ca'
      },
      {
        store: 'Canadian Tire',
        price: 94.99,
        shipping: '2-3 days',
        availability: 'In stock',
        link: 'https://canadiantire.ca'
      }
    ]
  }
];

export const mockPriceHistory = [
  { date: '2024-01-01', price: 159.99, store: 'Home Depot' },
  { date: '2024-01-15', price: 154.99, store: 'Home Depot' },
  { date: '2024-02-01', price: 149.99, store: 'Home Depot' },
  { date: '2024-02-15', price: 149.99, store: 'Home Depot' },
  { date: '2024-01-01', price: 169.99, store: 'Canadian Tire' },
  { date: '2024-01-15', price: 164.99, store: 'Canadian Tire' },
  { date: '2024-02-01', price: 159.99, store: 'Canadian Tire' },
  { date: '2024-02-15', price: 159.99, store: 'Canadian Tire' },
  { date: '2024-01-01', price: 154.99, store: 'Amazon Canada' },
  { date: '2024-01-15', price: 149.99, store: 'Amazon Canada' },
  { date: '2024-02-01', price: 144.99, store: 'Amazon Canada' },
  { date: '2024-02-15', price: 144.99, store: 'Amazon Canada' },
];

export const mockNearbyStores = [
  {
    id: '1',
    name: 'Home Depot - Toronto Downtown',
    address: '50 Gerrard St E, Toronto, ON M5B 1G3',
    distance: '2.1 km',
    phone: '(416) 597-1234',
    hours: 'Open until 9 PM',
    inStock: true,
    price: 149.99,
    coordinates: [43.6566, -79.3849] as [number, number]
  },
  {
    id: '2',
    name: 'Canadian Tire - Front Street',
    address: '839 Front St W, Toronto, ON M5V 3G8',
    distance: '3.7 km',
    phone: '(416) 368-5678',
    hours: 'Open until 10 PM',
    inStock: true,
    price: 159.99,
    coordinates: [43.6426, -79.4071] as [number, number]
  },
  {
    id: '3',
    name: 'Lowes - Stockyards',
    address: '2425 St Clair Ave W, Toronto, ON M6N 1L1',
    distance: '8.5 km',
    phone: '(416) 762-9012',
    hours: 'Closes at 9 PM',
    inStock: false,
    price: 154.99,
    coordinates: [43.6729, -79.4926] as [number, number]
  },
  {
    id: '4',
    name: 'Rona - Leslieville',
    address: '1300 Gerrard St E, Toronto, ON M4L 1Y7',
    distance: '5.2 km',
    phone: '(416) 461-3456',
    hours: 'Open until 8 PM',
    inStock: true,
    price: 152.99,
    coordinates: [43.6677, -79.3389] as [number, number]
  }
];
