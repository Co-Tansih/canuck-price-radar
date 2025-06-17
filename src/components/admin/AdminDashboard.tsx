
import React, { useState } from 'react';
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

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <AdminHeader 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
        
        <main className="p-6">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/scraper" element={<ScraperControl />} />
            <Route path="/affiliates" element={<AffiliateLinkManager />} />
            <Route path="/analytics" element={<SearchAnalytics />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
