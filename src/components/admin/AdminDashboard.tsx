
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import DashboardOverview from './pages/DashboardOverview';
import ProductsManagement from './pages/ProductsManagement';
import ScraperControl from './pages/ScraperControl';
import AffiliateLinkManager from './pages/AffiliateLinkManager';
import SearchAnalytics from './pages/SearchAnalytics';
import UserManagement from './pages/UserManagement';
import AdminSettings from './pages/AdminSettings';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close sidebar on mobile by default, open on desktop
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Enhanced swipe gestures for mobile
  useEffect(() => {
    if (!isMobile) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      // Prevent scrolling when swiping horizontally
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;
      isDragging = false;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && startX < 50) {
          // Swipe right from left edge - open sidebar
          setSidebarOpen(true);
        } else if (deltaX < -50 && sidebarOpen) {
          // Swipe left when sidebar is open - close sidebar
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, sidebarOpen]);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full relative overflow-hidden">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={handleOverlayClick}
        />
      )}
      
      <AdminSidebar 
        isOpen={sidebarOpen} 
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        !isMobile && sidebarOpen ? 'lg:ml-64' : !isMobile ? 'lg:ml-16' : 'ml-0'
      } min-w-0`}>
        <AdminHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />
        
        <main className={`flex-1 overflow-auto ${isMobile ? 'p-3' : 'lg:p-6 p-4'}`}>
          <div className="max-w-full">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/products" element={<ProductsManagement />} />
              <Route path="/scraper" element={<ScraperControl />} />
              <Route path="/affiliates" element={<AffiliateLinkManager />} />
              <Route path="/analytics" element={<SearchAnalytics />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
