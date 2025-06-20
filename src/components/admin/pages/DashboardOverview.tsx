
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
import { supabase } from '@/integrations/supabase/client';

const DashboardOverview = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    dailySearches: 0,
    revenue: 0,
    activeScrapers: 0
  });
  const [chartData, setChartData] = useState([]);
  const [scraperStatus, setScraperStatus] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch product count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch daily searches
      const today = new Date().toISOString().split('T')[0];
      const { count: searchCount } = await supabase
        .from('search_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today + 'T00:00:00.000Z');

      // Fetch scraper status
      const { data: scraperLogs } = await supabase
        .from('scraper_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate revenue (mock calculation based on products)
      const { data: products } = await supabase
        .from('products')
        .select('price');
      
      const totalRevenue = products?.reduce((sum, product) => {
        const price = parseFloat(product.price?.toString() || '0');
        return sum + (isNaN(price) ? 0 : price);
      }, 0) || 0;

      // Fetch chart data for the last 6 months
      const chartData = await fetchChartData();

      // Process scraper status
      const processedScraperStatus = processScraperStatus(scraperLogs || []);

      // Fetch recent activity
      const activity = await fetchRecentActivity();

      setStats({
        totalUsers: userCount || 0,
        totalProducts: productCount || 0,
        dailySearches: searchCount || 0,
        revenue: Math.round(totalRevenue * 0.1), // 10% commission estimate
        activeScrapers: processedScraperStatus.filter(s => s.status === 'active').length
      });

      setChartData(chartData);
      setScraperStatus(processedScraperStatus);
      setRecentActivity(activity);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();

      // Users registered in this month
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart)
        .lte('created_at', monthEnd);

      // Searches in this month
      const { count: searchCount } = await supabase
        .from('search_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart)
        .lte('created_at', monthEnd);

      chartData.push({
        name: months[5 - i],
        users: userCount || 0,
        searches: searchCount || 0,
        revenue: Math.round((searchCount || 0) * 2.5) // Estimated revenue
      });
    }

    return chartData;
  };

  const processScraperStatus = (logs: any[]) => {
    const scrapers = [
      { name: 'Amazon Canada', id: 'amazon' },
      { name: 'Walmart Canada', id: 'walmart' },
      { name: 'Home Depot Canada', id: 'homedepot' }
    ];

    return scrapers.map(scraper => {
      const recentLogs = logs.filter(log => 
        log.scraper_name?.toLowerCase().includes(scraper.id)
      ).slice(0, 5);

      const lastLog = recentLogs[0];
      const totalProducts = recentLogs.reduce((sum, log) => {
        const products = parseInt(log.products_scraped?.toString() || '0');
        return sum + (isNaN(products) ? 0 : products);
      }, 0);
      const successRate = recentLogs.length > 0 ? 
        (recentLogs.filter(log => log.status === 'success').length / recentLogs.length) * 100 : 0;

      return {
        name: scraper.name,
        status: lastLog?.status === 'success' ? 'active' : 
                lastLog?.status === 'error' ? 'error' : 'warning',
        lastRun: lastLog ? formatTimeAgo(lastLog.created_at) : 'Never',
        products: totalProducts,
        successRate: Math.round(successRate)
      };
    });
  };

  const fetchRecentActivity = async () => {
    const activities = [];

    // Recent user registrations
    const { data: recentUsers } = await supabase
      .from('profiles')
      .select('email, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    recentUsers?.forEach(user => {
      activities.push({
        action: 'New user registered',
        user: user.email,
        time: formatTimeAgo(user.created_at)
      });
    });

    // Recent searches
    const { data: recentSearches } = await supabase
      .from('search_logs')
      .select('search_query, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    recentSearches?.forEach(search => {
      activities.push({
        action: 'Product searched',
        product: search.search_query,
        time: formatTimeAgo(search.created_at)
      });
    });

    // Recent scraper activity
    const { data: recentScraperLogs } = await supabase
      .from('scraper_logs')
      .select('scraper_name, message, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    recentScraperLogs?.forEach(log => {
      activities.push({
        action: log.message || 'Scraper completed',
        store: log.scraper_name,
        time: formatTimeAgo(log.created_at)
      });
    });

    // Sort by time and return latest 8
    return activities
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 8);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

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
