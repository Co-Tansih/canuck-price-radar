
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, MapPin, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import LanguageToggle from './LanguageToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to sign out. Please try again.",
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
        navigate('/', { replace: true });
        window.location.reload();
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 relative z-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-2.5 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Search className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              PriceTrackr
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-lg mx-8">
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                  isActive('/') 
                    ? 'text-red-600' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                {t('home')}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform transition-transform duration-300 ${
                  isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
              
              <Link
                to="/search"
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                  isActive('/search') 
                    ? 'text-red-600' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                {t('search')}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform transition-transform duration-300 ${
                  isActive('/search') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
              
              <Link
                to="/stores"
                className={`relative flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                  isActive('/stores') 
                    ? 'text-red-600' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>{t('storeLocator')}</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform transition-transform duration-300 ${
                  isActive('/stores') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <LanguageToggle />
            
            {/* User Info - Minimalistic */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-sm">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              {isSigningOut ? 'Signing out...' : t('signOut')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isActive('/') 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                {t('home')}
              </Link>
              <Link
                to="/search"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isActive('/search') 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                {t('search')}
              </Link>
              <Link
                to="/stores"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isActive('/stores') 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>{t('storeLocator')}</span>
              </Link>
              
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="mb-4">
                  <LanguageToggle />
                </div>
                <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-600 truncate">{user?.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isSigningOut ? 'Signing out...' : t('signOut')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
