
import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import LanguageToggle from '@/components/LanguageToggle';

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile?: boolean;
}

const AdminHeader = ({ sidebarOpen, setSidebarOpen, isMobile = false }: AdminHeaderProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    console.log('Sign out clicked');
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        console.log('Sign out successful');
      }
    } catch (error) {
      console.error('Sign out exception:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {isMobile && (
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <LanguageToggle />
          
          <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100">
            <Bell className="h-4 w-4 md:h-5 md:w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 md:w-56">
              <DropdownMenuLabel className="text-sm">
                {user?.email || 'Admin User'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut} 
                className="text-sm cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
