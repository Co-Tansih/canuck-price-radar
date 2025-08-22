import React, { useState, useEffect } from 'react';
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
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardOverview = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 2847,
    totalProducts: 15432,
    dailySearches: 1247,
    revenue: 12500,
    activeScrapers: 3
  });
  
  const [chartData] = useState([
    { name: 'Jan', users: 400, searches: 2400, revenue: 2400 },
    { name: 'Feb', users: 300, searches: 1398, revenue: 2210 },
    { name: 'Mar', users: 200, searches: 9800, revenue: 2290 },
    { name: 'Apr', users: 278, searches: 3908, revenue: 2000 },
    { name: 'May', users: 189, searches: 4800, revenue: 2181 },
    { name: 'Jun', users: 239, searches: 3800, revenue: 2500 }
  ]);
  
  const [scraperStatus] = useState([
    { name: 'Amazon Scraper', status: 'active', lastRun: '2 minutes ago', products: 5420 },
    { name: 'Walmart Scraper', status: 'warning', lastRun: '15 minutes ago', products: 3240 },
    { name: 'Home Depot Scraper', status: 'active', lastRun: '5 minutes ago', products: 4560 }
  ]);
  
  const [recentActivity] = useState([
    { action: 'New user registered', user: 'john@example.com', time: '2 minutes ago' },
    { action: 'Product searched', product: 'iPhone 15', time: '5 minutes ago' },
    { action: 'Scraper completed', store: 'Amazon', time: '10 minutes ago' },
    { action: 'Price alert sent', product: 'DEWALT Drill', time: '15 minutes ago' }
  ]);

  const statsCards = [
    {
      title: t('totalUsers') || 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: t('productsTracked') || 'Products Tracked',
      value: stats.totalProducts.toLocaleString(),
      change: '+8.2%',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: t('dailySearches') || 'Daily Searches',
      value: stats.dailySearches.toLocaleString(),
      change: '+23.1%',
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: t('revenue') || 'Est. Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      change: '+15.3%',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {t('dashboardOverview') || 'Dashboard Overview'}
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          {t('monitorPlatformPerformance') || 'Monitor your platform\'s performance and key metrics'}
        </p>
      </div>

      {/* Stats Grid - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow glass-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium text-gray-600 truncate">
                      {stat.title}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1 md:mt-2">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-green-600 mt-1">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-2 md:p-3 rounded-full ${stat.bgColor} flex-shrink-0 ml-2`}>
                    <Icon className={`h-4 w-4 md:h-6 md:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section - Mobile Responsive */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        {/* User Growth Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl">
              {t('userGrowth') || 'User Growth'}
            </CardTitle>
            <CardDescription className="text-sm">
              {t('monthlyUserRegistration') || 'Monthly user registration trends'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Search Volume Chart */}
        <Card className="glass-card">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-lg md:text-xl">
              {t('searchVolume') || 'Search Volume'}
            </CardTitle>
            <CardDescription className="text-sm">
              {t('dailySearchActivity') || 'Daily search activity'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="searches" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scraper Status - Mobile Responsive */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
            <Activity className="h-4 w-4 md:h-5 md:w-5" />
            <span>{t('scraperStatus') || 'Scraper Status'}</span>
          </CardTitle>
          <CardDescription className="text-sm">
            {t('realTimeScraperStatus') || 'Real-time status of all price scrapers'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {scraperStatus.map((scraper, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    scraper.status === 'active' ? 'bg-green-500' :
                    scraper.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm md:text-base truncate">{scraper.name}</p>
                    <p className="text-xs md:text-sm text-gray-500">Last run: {scraper.lastRun}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-medium text-gray-900 text-sm md:text-base">{scraper.products.toLocaleString()}</p>
                  <p className="text-xs md:text-sm text-gray-500">products</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - Mobile Responsive */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            {t('recentActivity') || 'Recent Activity'}
          </CardTitle>
          <CardDescription className="text-sm">
            {t('latestSystemEvents') || 'Latest system events and user actions'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-100 last:border-0 space-y-1 sm:space-y-0">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm md:text-base">{activity.action}</p>
                  <p className="text-xs md:text-sm text-gray-500 truncate">
                    {activity.user || activity.product || activity.store}
                  </p>
                </div>
                <p className="text-xs md:text-sm text-gray-400 flex-shrink-0">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;