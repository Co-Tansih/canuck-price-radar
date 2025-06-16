import React, { useState } from 'react';
import { 
  Plus, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Copy,
  DollarSign,
  TrendingUp,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const AffiliateLinkManager = () => {
  const { toast } = useToast();
  
  const [affiliateLinks] = useState([
    {
      id: 1,
      store: 'Amazon Canada',
      productName: 'DEWALT 20V MAX Cordless Drill',
      originalUrl: 'https://amazon.ca/dewalt-drill-20v',
      affiliateUrl: 'https://amazon.ca/dewalt-drill-20v?tag=pricetrackr-20',
      commission: 4.5,
      clicks: 1247,
      conversions: 23,
      revenue: 127.45,
      status: 'active'
    },
    {
      id: 2,
      store: 'Best Buy Canada',
      productName: 'iPhone 15 Pro 256GB',
      originalUrl: 'https://bestbuy.ca/iphone-15-pro',
      affiliateUrl: 'https://bestbuy.ca/iphone-15-pro?ref=pricetrackr',
      commission: 2.0,
      clicks: 892,
      conversions: 12,
      revenue: 336.00,
      status: 'active'
    },
    {
      id: 3,
      store: 'Canadian Tire',
      productName: 'Carhartt Work Boots',
      originalUrl: 'https://canadiantire.ca/carhartt-boots',
      affiliateUrl: 'https://canadiantire.ca/carhartt-boots?affiliate=pricetrackr',
      commission: 3.5,
      clicks: 456,
      conversions: 8,
      revenue: 53.20,
      status: 'active'
    },
    {
      id: 4,
      store: 'Home Depot',
      productName: 'Pine Lumber 2x4x8',
      originalUrl: 'https://homedepot.ca/pine-lumber',
      affiliateUrl: 'https://homedepot.ca/pine-lumber?aff=pricetrackr',
      commission: 1.5,
      clicks: 234,
      conversions: 15,
      revenue: 2.01,
      status: 'pending'
    },
    {
      id: 5,
      store: 'Costco Canada',
      productName: 'Canada Goose Expedition Parka',
      originalUrl: 'https://costco.ca/canada-goose-parka',
      affiliateUrl: 'https://costco.ca/canada-goose-parka?ref=pt',
      commission: 2.5,
      clicks: 67,
      conversions: 2,
      revenue: 59.98,
      status: 'inactive'
    }
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Affiliate link copied to clipboard",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.inactive}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const totalRevenue = affiliateLinks.reduce((sum, link) => sum + link.revenue, 0);
  const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0);
  const totalConversions = affiliateLinks.reduce((sum, link) => sum + link.conversions, 0);
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Link Manager</h1>
          <p className="text-gray-600 mt-2">
            Manage affiliate partnerships and track commission revenue
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Affiliate Link</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${totalRevenue.toFixed(2)}
                </p>
                <p className="text-sm text-green-600">This month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {totalClicks.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600">This month</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {totalConversions}
                </p>
                <p className="text-sm text-purple-600">This month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {conversionRate.toFixed(1)}%
                </p>
                <p className="text-sm text-orange-600">Average</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search affiliate links..."
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>All Stores</option>
                <option>Amazon Canada</option>
                <option>Best Buy Canada</option>
                <option>Canadian Tire</option>
                <option>Home Depot</option>
                <option>Costco Canada</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Affiliate Links ({affiliateLinks.length})</CardTitle>
          <CardDescription>
            Manage your affiliate partnerships and track performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Store</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Commission</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliateLinks.map((link) => (
                  <tr key={link.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {link.productName}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {link.originalUrl}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{link.store}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{link.commission}%</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{link.clicks} clicks</p>
                        <p className="text-gray-500">{link.conversions} conversions</p>
                        <p className="text-gray-500">
                          {link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(1) : 0}% rate
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-green-600">${link.revenue.toFixed(2)}</p>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(link.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(link.affiliateUrl)}
                          title="Copy affiliate link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(link.affiliateUrl, '_blank')}
                          title="Open link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>
            Monthly affiliate revenue performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Revenue chart would be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateLinkManager;