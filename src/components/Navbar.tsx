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
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 glass-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 hover-lift">
            <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-xl p-2 shadow-lg">
              <Search className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold gradient-text">PriceTrackr</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive('/') 
                  ? 'text-primary bg-primary/10 border-2 border-primary/20' 
                  : 'text-gray-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              to="/search"
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive('/search') 
                  ? 'text-primary bg-primary/10 border-2 border-primary/20' 
                  : 'text-gray-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              {t('search')}
            </Link>
            <Link
              to="/stores"
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                isActive('/stores') 
                  ? 'text-primary bg-primary/10 border-2 border-primary/20' 
                  : 'text-gray-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>{t('storeLocator')}</span>
            </Link>
            
            <LanguageToggle />
            
            <div className="flex items-center space-x-3">
              <div className="glass-card px-3 py-2 rounded-lg flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="truncate max-w-32">{user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="canadian-button text-white border-0 hover:scale-105 transition-transform disabled:opacity-50"
              >
                <LogOut className="h-4 w-4 mr-1" />
                {isSigningOut ? 'Signing out...' : t('signOut')}
              </Button>
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md glass-card rounded-b-2xl">
            <div className="px-2 pt-4 pb-6 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isActive('/') 
                    ? 'text-primary bg-primary/10 border border-primary/20' 
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {t('home')}
              </Link>
              <Link
                to="/search"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isActive('/search') 
                    ? 'text-primary bg-primary/10 border border-primary/20' 
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {t('search')}
              </Link>
              <Link
                to="/stores"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                  isActive('/stores') 
                    ? 'text-primary bg-primary/10 border border-primary/20' 
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>{t('storeLocator')}</span>
              </Link>
              
              <div className="border-t border-gray-200/50 pt-4 mt-4">
                <div className="mb-3">
                  <LanguageToggle />
                </div>
                <div className="glass-card mx-2 px-4 py-3 rounded-xl flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-white" />
                  </div>
                  <span className="truncate">{user?.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="mx-2 w-[calc(100%-1rem)] canadian-button text-white border-0 disabled:opacity-50"
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
