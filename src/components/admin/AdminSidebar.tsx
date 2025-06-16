import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Bot, 
  ExternalLink, 
  BarChart3, 
  Users, 
  Settings,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  isOpen: boolean;
}

const AdminSidebar = ({ isOpen }: AdminSidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      description: 'Overview & Stats'
    },
    {
      title: 'Products',
      icon: Package,
      path: '/admin/products',
      description: 'Manage Products'
    },
    {
      title: 'Scraper Control',
      icon: Bot,
      path: '/admin/scraper',
      description: 'Monitor Scrapers'
    },
    {
      title: 'Affiliate Links',
      icon: ExternalLink,
      path: '/admin/affiliates',
      description: 'Manage Links'
    },
    {
      title: 'Search Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      description: 'User Behavior'
    },
    {
      title: 'User Management',
      icon: Users,
      path: '/admin/users',
      description: 'Manage Users'
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      description: 'System Config'
    }
  ];

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-50",
      isOpen ? "w-64" : "w-16"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-primary rounded-lg p-2">
            <Search className="h-6 w-6 text-white" />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">PriceTrackr</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                )} />
                
                {isOpen && (
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.title}
                    </p>
                    <p className={cn(
                      "text-xs truncate",
                      isActive ? "text-white/80" : "text-gray-400"
                    )}>
                      {item.description}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <div className={cn(
          "bg-gray-50 rounded-lg p-3",
          !isOpen && "px-2"
        )}>
          {isOpen ? (
            <div>
              <p className="text-xs font-medium text-gray-900">Admin Access</p>
              <p className="text-xs text-gray-500">Full System Control</p>
            </div>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Settings className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;