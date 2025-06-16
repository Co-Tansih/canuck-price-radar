import React, { useState } from 'react';
import { 
  Search, 
  TrendingUp, 
  Users, 
  Clock,
  BarChart3,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const SearchAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Mock data - replace with real analytics data
  const searchStats = {
    totalSearches: 45672,
    uniqueUsers: 12847,
    avgSearchesPerUser: 3.6,
    topSearchTime: '2:00 PM - 4:00 PM'
  };

  const topSearches = [
    { query: 'iPhone 15', searches: 2847, trend: '+12%' },
    { query: 'winter jacket', searches: 2156, trend: '+8%' },
    { query: 'power drill', searches: 1923, trend: '+15%' },
    { query: 'laptop', searches: 1654, trend: '-3%' },
    { query: 'work boots', searches: 1432, trend: '+22%' },
    { query: 'smart tv', searches: 1287, trend: '+5%' },
    { query: 'gaming chair', searches: 1156, trend: '+18%' },
    { query: 'air fryer', searches: 1089, trend: '+7%' },
    { query: 'bluetooth headphones', searches: 987, trend: '+11%' },
    { query: 'coffee maker', searches: 876, trend: '+4%' }
  ];

  const searchTrends = [
    { date: '2024-01-01', searches: 1200, users: 450 },
    { date: '2024-01-02', searches: 1350, users: 520 },
    { date: '2024-01-03', searches: 1100, users: 410 },
    { date: '2024-01-04', searches: 1450, users: 580 },
    { date: '2024-01-05', searches: 1600, users: 620 },
    { date: '2024-01-06', searches: 1800, users: 690 },
    { date: '2024-01-07', searches: 1950, users: 750 }
  ];

  const categoryBreakdown = [
    { category: 'Electronics', searches: 12450, percentage: 27.3 },
    { category: 'Clothing', searches: 9876, percentage: 21.6 },
    { category: 'Hardware Tools', searches: 8234, percentage: 18.0 },
    { category: 'Home & Garden', searches: 6543, percentage: 14.3 },
    { category: 'Sports & Outdoors', searches: 4567, percentage: 10.0 },
    { category: 'Automotive', searches: 2345, percentage: 5.1 },
    { category: 'Books', searches: 1653, percentage: 3.6 }
  ];

  const hourlyActivity = [
    { hour: '00:00', searches: 45 },
    { hour: '02:00', searches: 23 },
    { hour: '04:00', searches: 12 },
    { hour: '06:00', searches: 67 },
    { hour: '08:00', searches: 234 },
    { hour: '10:00', searches: 456 },
    { hour: '12:00', searches: 678 },
    { hour: '14:00', searches: 789 },
    { hour: '16:00', searches: 654 },
    { hour: '18:00', searches: 543 },
    { hour: '20:00', searches: 432 },
    { hour: '22:00', searches: 234 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Search Analytics</h1>
          <p className="text-gray-600 mt-2">
            Analyze user search behavior and trending queries
          </p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Searches</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {searchStats.totalSearches.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">+15.3% from last week</p>
              </div>
              <Search className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {searchStats.uniqueUsers.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600">+8.7% from last week</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Searches/User</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {searchStats.avgSearchesPerUser}
                </p>
                <p className="text-sm text-purple-600">+12.1% from last week</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Peak Hours</p>
                <p className="text-lg font-bold text-gray-900 mt-2">
                  {searchStats.topSearchTime}
                </p>
                <p className="text-sm text-orange-600">Most active time</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Search Trends</CardTitle>
          <CardDescription>
            Daily search volume and unique users over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={searchTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-CA')}
                />
                <Line 
                  type="monotone" 
                  dataKey="searches" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Searches"
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Unique Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Search Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Search Queries</CardTitle>
            <CardDescription>
              Most popular search terms in the selected time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSearches.map((search, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{search.query}</p>
                      <p className="text-sm text-gray-500">{search.searches.toLocaleString()} searches</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    search.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {search.trend}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Search by Category</CardTitle>
            <CardDescription>
              Distribution of searches across product categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {category.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {category.searches.toLocaleString()} ({category.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Search Activity</CardTitle>
          <CardDescription>
            Search volume distribution throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="searches" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Search Filters</CardTitle>
          <CardDescription>
            Filter and analyze specific search patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Search query..." />
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Hardware Tools</option>
              <option>Home & Garden</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
              <option>All Users</option>
              <option>New Users</option>
              <option>Returning Users</option>
              <option>Premium Users</option>
            </select>
            <Button className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchAnalytics;