import React from 'react';
import { 
  Users, 
  Package, 
  TrendingUp, 
  Activity,
  DollarSign,
  Eye,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const DashboardOverview = () => {
  // Mock data - replace with real data from your API
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Products Tracked',
      value: '15,432',
      change: '+8.2%',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Daily Searches',
      value: '8,921',
      change: '+23.1%',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Revenue',
      value: '$12,847',
      change: '+15.3%',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  const chartData = [
    { name: 'Jan', users: 400, searches: 2400, revenue: 2400 },
    { name: 'Feb', users: 300, searches: 1398, revenue: 2210 },
    { name: 'Mar', users: 200, searches: 9800, revenue: 2290 },
    { name: 'Apr', users: 278, searches: 3908, revenue: 2000 },
    { name: 'May', users: 189, searches: 4800, revenue: 2181 },
    { name: 'Jun', users: 239, searches: 3800, revenue: 2500 },
  ];

  const scraperStatus = [
    { name: 'Amazon Canada', status: 'active', lastRun: '2 min ago', products: 5420 },
    { name: 'Best Buy', status: 'active', lastRun: '5 min ago', products: 2130 },
    { name: 'Canadian Tire', status: 'warning', lastRun: '15 min ago', products: 3240 },
    { name: 'Home Depot', status: 'active', lastRun: '3 min ago', products: 4560 },
    { name: 'Costco', status: 'error', lastRun: '2 hours ago', products: 1890 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">
          Monitor your platform's performance and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Search Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Search Volume</CardTitle>
            <CardDescription>Daily search activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="searches" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scraper Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Scraper Status</span>
          </CardTitle>
          <CardDescription>Real-time status of all price scrapers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scraperStatus.map((scraper, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    scraper.status === 'active' ? 'bg-green-500' :
                    scraper.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{scraper.name}</p>
                    <p className="text-sm text-gray-500">Last run: {scraper.lastRun}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{scraper.products.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">products</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New user registered', user: 'john.doe@email.com', time: '2 minutes ago' },
              { action: 'Price alert triggered', product: 'iPhone 15 Pro', time: '5 minutes ago' },
              { action: 'Scraper completed', store: 'Amazon Canada', time: '8 minutes ago' },
              { action: 'Admin login', user: 'admin@pricetrackr.ca', time: '15 minutes ago' },
              { action: 'Product added', product: 'Samsung Galaxy S24', time: '23 minutes ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">
                    {activity.user || activity.product || activity.store}
                  </p>
                </div>
                <p className="text-sm text-gray-400">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;