import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/Admin Context';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Homepage from '../components/Homepage';
import SearchResults from '../components/SearchResults';
import ProductDetail from '../components/ProductDetail';
import StoreLocator from '../components/StoreLocator';
import AuthPage from '../components/AuthPage';
import AdminDashboard from '../components/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const { isAdmin } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // If user is admin, show admin dashboard
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // Regular user interface
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/stores" element={<StoreLocator />} />
          <Route path="/auth" element={<Navigate to="/" replace />} />
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default Index;