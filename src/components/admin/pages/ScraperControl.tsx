import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Settings,
  Download,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ScraperControl = () => {
  const [scrapers, setScrapers] = useState([
    {
      id: 1,
      name: 'Amazon Canada',
      status: 'running',
      lastRun: '2 minutes ago',
      nextRun: 'in 28 minutes',
      productsScraped: 5420,
      successRate: 98.5,
      avgResponseTime: '1.2s',
      errors: 0
    },
    {
      id: 2,
      name: 'Best Buy Canada',
      status: 'running',
      lastRun: '5 minutes ago',
      nextRun: 'in 25 minutes',
      productsScraped: 2130,
      successRate: 97.8,
      avgResponseTime: '0.8s',
      errors: 2
    },
    {
      id: 3,
      name: 'Canadian Tire',
      status: 'warning',
      lastRun: '15 minutes ago',
      nextRun: 'in 15 minutes',
      productsScraped: 3240,
      successRate: 89.2,
      avgResponseTime: '2.1s',
      errors: 12
    },
    {
      id: 4,
      name: 'Home Depot Canada',
      status: 'running',
      lastRun: '3 minutes ago',
      nextRun: 'in 27 minutes',
      productsScraped: 4560,
      successRate: 99.1,
      avgResponseTime: '1.0s',
      errors: 1
    },
    {
      id: 5,
      name: 'Costco Canada',
      status: 'error',
      lastRun: '2 hours ago',
      nextRun: 'paused',
      productsScraped: 1890,
      successRate: 45.2,
      avgResponseTime: '5.2s',
      errors: 45
    }
  ]);

  const [logs] = useState([
    { time: '14:32:15', scraper: 'Amazon Canada', level: 'info', message: 'Successfully scraped 1,247 products' },
    { time: '14:31:42', scraper: 'Best Buy Canada', level: 'info', message: 'Price update completed for Electronics category' },
    { time: '14:30:18', scraper: 'Canadian Tire', level: 'warning', message: 'Rate limit detected, backing off for 30 seconds' },
    { time: '14:29:55', scraper: 'Home Depot Canada', level: 'info', message: 'Started scraping Building Materials category' },
    { time: '14:28:33', scraper: 'Costco Canada', level: 'error', message: 'Connection timeout after 30 seconds' },
    { time: '14:27:12', scraper: 'Amazon Canada', level: 'info', message: 'Detected 23 price changes in last run' },
    { time: '14:26:45', scraper: 'Best Buy Canada', level: 'warning', message: 'Product page structure changed, updating parser' },
    { time: '14:25:20', scraper: 'Canadian Tire', level: 'info', message: 'Successfully updated 892 product prices' }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      running: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      paused: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.paused}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleScraperAction = (scraperId: number, action: string) => {
    setScrapers(prev => prev.map(scraper => 
      scraper.id === scraperId 
        ? { ...scraper, status: action === 'start' ? 'running' : 'paused' }
        : scraper
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scraper Control Panel</h1>
          <p className="text-gray-600 mt-2">
            Monitor and control your price scraping operations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Logs</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Run All Scrapers</span>
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Scrapers</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {scrapers.filter(s => s.status === 'running').length}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products Scraped</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {scrapers.reduce((sum, s) => sum + s.productsScraped, 0).toLocaleString()}
                </p>
                <p className="text-sm text-green-600">Today</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {(scrapers.reduce((sum, s) => sum + s.successRate, 0) / scrapers.length).toFixed(1)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Errors</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {scrapers.reduce((sum, s) => sum + s.errors, 0)}
                </p>
                <p className="text-sm text-red-600">Last 24h</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scrapers List */}
      <Card>
        <CardHeader>
          <CardTitle>Scraper Status</CardTitle>
          <CardDescription>
            Monitor and control individual scraper instances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scrapers.map((scraper) => (
              <div key={scraper.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(scraper.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {scraper.name}
                    </h3>
                    {getStatusBadge(scraper.status)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScraperAction(scraper.id, 'start')}
                      disabled={scraper.status === 'running'}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScraperAction(scraper.id, 'pause')}
                      disabled={scraper.status !== 'running'}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Last Run</p>
                    <p className="font-medium">{scraper.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Next Run</p>
                    <p className="font-medium">{scraper.nextRun}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Products</p>
                    <p className="font-medium">{scraper.productsScraped.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Success Rate</p>
                    <p className="font-medium">{scraper.successRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Avg Response</p>
                    <p className="font-medium">{scraper.avgResponseTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Errors</p>
                    <p className={`font-medium ${scraper.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {scraper.errors}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Live Scraper Logs</CardTitle>
          <CardDescription>
            Real-time activity from all scrapers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="space-y-2 font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-gray-400 flex-shrink-0">{log.time}</span>
                  <span className={`flex-shrink-0 ${
                    log.level === 'error' ? 'text-red-400' :
                    log.level === 'warning' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    [{log.level.toUpperCase()}]
                  </span>
                  <span className="text-blue-400 flex-shrink-0">{log.scraper}:</span>
                  <span className="text-gray-300">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScraperControl;