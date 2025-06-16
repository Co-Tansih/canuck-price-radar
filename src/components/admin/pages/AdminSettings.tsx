import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Key, 
  Globe, 
  Bell, 
  Shield,
  Database,
  Palette,
  Mail,
  Smartphone
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'PriceTrackr',
    siteDescription: 'Canada\'s leading price comparison platform',
    maintenanceMode: false,
    
    // API Settings
    amazonApiKey: '••••••••••••••••',
    bestBuyApiKey: '••••••••••••••••',
    canadianTireApiKey: '••••••••••••••••',
    
    // Scraper Settings
    scrapingInterval: 30,
    maxConcurrentScrapers: 5,
    retryAttempts: 3,
    
    // Notification Settings
    emailNotifications: true,
    priceAlertEmails: true,
    systemAlerts: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordExpiry: 90,
    
    // Feature Toggles
    userRegistration: true,
    priceAlerts: true,
    affiliateLinks: true,
    searchAnalytics: true
  });

  const handleSave = () => {
    // Save settings logic here
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure system settings and integrations
          </p>
        </div>
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save All Changes</span>
        </Button>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
          <CardDescription>
            Basic site configuration and display settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <Input
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                placeholder="Enter site name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scraping Interval (minutes)
              </label>
              <Input
                type="number"
                value={settings.scrapingInterval}
                onChange={(e) => handleInputChange('scrapingInterval', parseInt(e.target.value))}
                placeholder="30"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Description
            </label>
            <Textarea
              value={settings.siteDescription}
              onChange={(e) => handleInputChange('siteDescription', e.target.value)}
              placeholder="Enter site description"
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
              <p className="text-sm text-gray-600">
                Enable to show maintenance page to users
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>API Configuration</span>
          </CardTitle>
          <CardDescription>
            Manage API keys for external integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amazon API Key
              </label>
              <Input
                type="password"
                value={settings.amazonApiKey}
                onChange={(e) => handleInputChange('amazonApiKey', e.target.value)}
                placeholder="Enter Amazon API key"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Best Buy API Key
              </label>
              <Input
                type="password"
                value={settings.bestBuyApiKey}
                onChange={(e) => handleInputChange('bestBuyApiKey', e.target.value)}
                placeholder="Enter Best Buy API key"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canadian Tire API Key
              </label>
              <Input
                type="password"
                value={settings.canadianTireApiKey}
                onChange={(e) => handleInputChange('canadianTireApiKey', e.target.value)}
                placeholder="Enter Canadian Tire API key"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Concurrent Scrapers
              </label>
              <Input
                type="number"
                value={settings.maxConcurrentScrapers}
                onChange={(e) => handleInputChange('maxConcurrentScrapers', parseInt(e.target.value))}
                placeholder="5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Settings</span>
          </CardTitle>
          <CardDescription>
            Configure email and system notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Send system emails to users</p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">Price Alert Emails</h4>
                  <p className="text-sm text-gray-600">Send price drop notifications</p>
                </div>
              </div>
              <Switch
                checked={settings.priceAlertEmails}
                onCheckedChange={(checked) => handleInputChange('priceAlertEmails', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">System Alerts</h4>
                  <p className="text-sm text-gray-600">Admin notifications for system events</p>
                </div>
              </div>
              <Switch
                checked={settings.systemAlerts}
                onCheckedChange={(checked) => handleInputChange('systemAlerts', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>
            Configure security and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                placeholder="60"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Expiry (days)
              </label>
              <Input
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => handleInputChange('passwordExpiry', parseInt(e.target.value))}
                placeholder="90"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">
                Require 2FA for admin accounts
              </p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Feature Toggles</span>
          </CardTitle>
          <CardDescription>
            Enable or disable platform features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">User Registration</h4>
                <p className="text-sm text-gray-600">Allow new user signups</p>
              </div>
              <Switch
                checked={settings.userRegistration}
                onCheckedChange={(checked) => handleInputChange('userRegistration', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Price Alerts</h4>
                <p className="text-sm text-gray-600">Enable price monitoring</p>
              </div>
              <Switch
                checked={settings.priceAlerts}
                onCheckedChange={(checked) => handleInputChange('priceAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Affiliate Links</h4>
                <p className="text-sm text-gray-600">Show affiliate links</p>
              </div>
              <Switch
                checked={settings.affiliateLinks}
                onCheckedChange={(checked) => handleInputChange('affiliateLinks', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Search Analytics</h4>
                <p className="text-sm text-gray-600">Track user searches</p>
              </div>
              <Switch
                checked={settings.searchAnalytics}
                onCheckedChange={(checked) => handleInputChange('searchAnalytics', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Database Management</span>
          </CardTitle>
          <CardDescription>
            Database maintenance and backup settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Backup Database</span>
            </Button>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Optimize Tables</span>
            </Button>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Clear Cache</span>
            </Button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Database Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Total Products</p>
                <p className="font-medium">15,432</p>
              </div>
              <div>
                <p className="text-gray-600">Total Users</p>
                <p className="font-medium">2,847</p>
              </div>
              <div>
                <p className="text-gray-600">Price Records</p>
                <p className="font-medium">1.2M</p>
              </div>
              <div>
                <p className="text-gray-600">Database Size</p>
                <p className="font-medium">2.4 GB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;