
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
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileSidebar = ({ isOpen, onClose, children }: MobileSidebarProps) => {
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-lg p-2">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <SheetTitle>PriceTrackr</SheetTitle>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>
        </SheetHeader>
        
        <nav className="p-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
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
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
